
from trp import Document
from botocore.exceptions import ClientError
import math
from elasticsearch import Elasticsearch
import traceback
from fuzzywuzzy import fuzz
from pprint import pprint
import io
import re,cv2
from difflib import SequenceMatcher
import string
import json
import time
import re
import numpy as np
import datetime
import boto3
# from Submittals_Utils import classify,kvLinker
from date_extractor import extract_dates
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
import pandas as pd
from pdf2image import convert_from_bytes
from botocore.client import Config

tablesList = list()
formsList=dict()
rawLines=list()
aliases=list()
endpoint = "https://stonaisubmittals.cognitiveservices.azure.com/"
credential = AzureKeyCredential("714f9fef4eaa4534b41ebc69d82f73df")

print(credential)
document_analysis_client = DocumentAnalysisClient(endpoint, credential)

with open("/home/ubuntu/StonAI-Smart-Extraction/aliases.json","r") as f:
# with open("/mnt/d/StonAI/StonAI-Smart-Extraction/aliases.json","r") as f:
    ado=json.load(f)
    for x,y in ado.items():
        doto=list()
        if type(y)==list:
            for m in y:
                m['label']=x
                doto.append(m)
            aliases.extend(doto)

aliases=pd.DataFrame(aliases)
config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)
es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
wd,ht=0,0

def get_Lines(a,x,pgno=1):
    global rawLines,formsList
    # a, x = data
    doc = Document(a)
    w, h = x.size
    lines = list()
    for page in doc.pages:
        tbList = list()
        # for field in page.form.fields:
        #     fld=dict()
        #     if field.key is not None:
        #         fld["Field"]=field.key.text
        #         fld["Field_location"]={"Left":field.key.geometry.boundingBox.left,"Top":field.key.geometry.boundingBox.top,"Height":field.key.geometry.boundingBox.height,"Width":field.key.geometry.boundingBox.width}
        #     if field.value is not None:
        #         fld["Value"]=field.value.text
        #         fld["Value_Location"]={"Left":field.value.geometry.boundingBox.left,"Top":field.value.geometry.boundingBox.top,"Height":field.value.geometry.boundingBox.height,"Width":field.value.geometry.boundingBox.width}

        #     formsList.append(fld)
        for table in page.tables:
            is_table = True
            for row in table.rows:
                if len(row.cells) <= 2:
                    is_table = False
            if is_table:
                t = list()
                for row in table.rows:
                    r = list()
                    dummy = [r.append([cell.text]) for cell in row.cells]
                    t.append(r)
                tablesList.append({"{}".format(pgno): t})

                tbList.append(table.geometry)
        for line in page._lines:
            # print(line)
            rawLines.append(line)
            inside = False
            for rect in tbList:
                if not(line.geometry.boundingBox.left >= rect.boundingBox.left
                       and line.geometry.boundingBox.top >= rect.boundingBox.top
                       and line.geometry.boundingBox.left+line.geometry.boundingBox.width <= rect.boundingBox.left+rect.boundingBox.width
                       and line.geometry.boundingBox.top+line.geometry.boundingBox.height <= rect.boundingBox.top+rect.boundingBox.height):

                    inside = True
                    if len(tbList) == 1:
                        lines.append(line)
                        inside = False
            if not inside and len(tbList) > 1:
                lines.append(line)
                inside = False
            elif len(tbList) == 0:
                lines.append(line)
        nlines=list()
        for line in lines:
            inside = False
            for rect in formsList:
                if not(line.geometry.boundingBox.left >= rect["Field_location"]["Left"]*w
                       and line.geometry.boundingBox.top >= rect["Field_location"]["Top"]*h
                       and line.geometry.boundingBox.left+line.geometry.boundingBox.width <= rect["Field_location"]["Width"]*w
                       and line.geometry.boundingBox.top+line.geometry.boundingBox.height <= rect["Field_location"]["Height"]*h
                       and line.geometry.boundingBox.left >= rect["Value_Location"]["Left"]*w
                       and line.geometry.boundingBox.top >= rect["Value_Location"]["Top"]*h
                       and line.geometry.boundingBox.left+line.geometry.boundingBox.width <= rect["Value_Location"]["Width"]*w
                       and line.geometry.boundingBox.top+line.geometry.boundingBox.height <= rect["Value_Location"]["Height"]*h):

                    inside = True
                    if len(formsList) == 1:
                        nlines.append(line)
                        inside = False
            if not inside and len(formsList) > 1:
                nlines.append(line)
                inside = False
            elif len(formsList) == 0:
                nlines.append(line)

    lines = [{"Text": line.text, "Page": pgno, "Left": line.geometry.boundingBox.left*w, "Top": line.geometry.boundingBox.top *
              h, "Height": line.geometry.boundingBox.height*h, "Width": line.geometry.boundingBox.width*w} for line in nlines]
    rawLines = [{"Text": line.text, "Page": pgno, "Left": line.geometry.boundingBox.left*w, "Top": line.geometry.boundingBox.top *
              h, "Height": line.geometry.boundingBox.height*h, "Width": line.geometry.boundingBox.width*w} for line in rawLines]
    print(len(lines))
    return pd.DataFrame(lines)


def get_jpeg(img):
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format="jpeg")
    return imgByteArr.getvalue()


def txtrctAPI(img):
    return textract.analyze_document(
        Document={
            'Bytes': get_jpeg(img),
        },
        FeatureTypes=["TABLES"])

def clarify(text):
    global aliases
    for i,x in aliases.iterrows():
        a=text.lower()
        b=x['Key'].lower()
        b=re.sub(r'[^A-Za-z0-9]+', '', b)
        # print(x['Position'])
        if a in b or a==b:
            print("="*150)
            print("Found")
            print(a)
            return x['label']
    print("Not Found")
    return None

def isRectangleOverlap( R1, R2):
    if (R1[0]>=R2[2]) or (R1[2]<=R2[0]) or (R1[3]<=R2[1]) or (R1[1]>=R2[3]):
        return False
    else:
        return True


def get_tH(img,txt):
    global sizes
    try:
        txt="".join(txt.split())
        imggray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        th3,t=cv2.threshold(imggray, 127, 255, cv2.THRESH_BINARY_INV|cv2.THRESH_OTSU)
        contours, hierarchy = cv2.findContours(t, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boxes = [cv2.boundingRect(contour) for contour in contours]
        xa=[h/ht for (x,y,w,h) in boxes]
        a=sizes[sizes["Character"].isin(list(txt))]
        idx=a['Relative Height'].sub(max(xa)).abs().idxmin()
        a=a.loc[[idx]]
        return int(a.to_dict('recods')[0]['Height'])
    except Exception as ex:
        return 0

def process_string(input_string):

    # Check if the list of words contains only "unselected" or "selected"
    if input_string in [":unselected:", ":selected:"]:
        return False
    
    return input_string

def ocrSubmittals(request):
    global tablesList,formsList,rawLines
    global sizes
    sizes=pd.read_csv('/home/ubuntu/StonAI-Smart-Extraction/sizes.csv',header=0)
    print(datetime.datetime.now())
    start = time.time()
    lines=list()
    try:
        start = time.time()
        bucket_name = request.query_params["BUCKET"]
        key_name = request.query_params["KEY"]
        s3 = boto3.resource('s3')
        buf=io.BytesIO()
        s3.Bucket(bucket_name).download_fileobj(key_name, buf)
        img1=convert_from_bytes(buf.getvalue(),first_page=1,last_page=1)[0]
        global wd,ht
        wd,ht=img1.size
        # img1=convert_from_path(request)[0]
        print("GOT Images")
        print(wd,ht)
        print(time.time()-start)
        axe=txtrctAPI(img1)
        print(time.time()-start)
        lines=get_Lines(axe,img1)
        
        dforms=list()
        forms=pd.DataFrame(rawLines)
        dd=list()
        for n,i in forms.iterrows():
            if i['Text'][0]==':':
                txt=list(i['Text'])
                txt[0]=""
                i['Text']="".join(txt)
            dforms.append(i)
        forms=pd.DataFrame(dforms)
        # dforms=list()
        # d1=None
        # d2=None
        # for n,i in forms.iterrows():
        #     if len(i['Text'].split(":"))==2:
        #         amper=i['Text'].split(":")
        #         print("+"*100)
        #         print(amper[0])
        #         print(amper[1])
        #         d1=i.copy()
        #         d2=i.copy()
        #         d1['Text']=amper[0]
        #         d2["Text"]=amper[1]
        #         d1['Width']=i['Width']*(len(amper[0])/len(i['Text']))
        #         d2['Width']=i['Width']*(len(amper[1])/len(i['Text']))
        #         d2['Left']=i['Left']+d1['Width']
        #     if d1 is not None:
        #         dforms.append(d1)
        #     if d2 is not None:
        #         dforms.append(d2)
        #     dforms.append(i)
        # for i,albedo in forms.iterrows():
        #     x0=math.ceil(albedo['Left'])
        #     x1=math.ceil(albedo['Left']+albedo['Width'])
        #     y0=math.ceil(albedo['Top'])
        #     y1=math.ceil(albedo["Top"]+albedo["Height"])
        #     dd.append(get_tH(np.array(img1)[y0:y1,x0:x1],albedo["Text"]))
        # forms['Size']=np.array(dd)
        # pprint(forms.head(50))
        # print(len(forms.head(50)))

        # forms=classify(forms)
        # print(forms.head(50))
        # formsList,kvConf=kvLinker(forms)
        # pprint(formsList)
        img_byte_arr = io.BytesIO()
        img1.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()

        poller = document_analysis_client.begin_analyze_document("prebuilt-document", img_byte_arr)
        result = poller.result()
        kvs=result.key_value_pairs
        print(kvs)
        # print(result.fields)
        kpd=list()
        kvConf=dict()
        for a in kvs:
            key=val=None
            key=a.key.content
            kvConf[key]=a.confidence
            if a.value is not None:
                val=a.value.content
            if formsList.get(key) is None and val is not None and process_string(val):
                formsList[key.replace(":","")]=[val]
            elif formsList.get(key) is not None and val is not None and process_string(val):
                formsList[key.replace(":","")].append(val)
        deko=dict()
        print(aliases.head())
        table = str.maketrans(dict.fromkeys(string.punctuation + ' '))
        aliases['Key']=[s.translate(table).lower() for s in aliases['Key'].tolist()]
        confList=dict()
        # kvConf=dict()
        for k,v in formsList.items():
            m=list()
            print("+"*150)
            print("Key:",k)
            print("value:",v)
            aliases['Score']=[SequenceMatcher(a=a, b=k.translate(table).lower()).ratio() for a in aliases['Key'].tolist()]
            for n,a in aliases.iterrows():
                if a['Key']==k.translate(table).lower():
                    m=a['label']
            if k is not None and v is not None:
                if deko.get(k) is not None:
                    if len(m)!=0:
                        
                        deko[m]=deko[m]+", "+v
                else:
                    if len(m)!=0:
                        if len(v)!=0:
                            
                            deko[m]=v
                            if kvConf.get(k) is not None:
                                confList[m]=kvConf.get(k)
                            else:
                                confList[m]=0

        for k,v in deko.items():
            deko[k]=" , ".join(v)
        
        print(deko.get('DATE_1'))
        
        if deko.get('SUBMITTAL_TITLE') is None:
            if deko.get("DESCRIPTION") is not None:
                deko['SUBMITTAL_TITLE']=deko['DESCRIPTION']
        if deko.get("DATE_1") is not None:
            dates=extract_dates(" ".join(forms['Text'].tolist()))
            # dates=extract_dates(deko["DATE_1"])
            dates=[d for d in dates if d is not None and d.year>2000]
            if len(dates) != 0:
                
                deko["DATE_1"]=dates[0].isoformat()
        print(deko.get('DATE_1'))
        if deko.get("DISCIPLINE") is not None:
            sub_str_found=False
            sub_str_scores=[]
            allDiscipline = ["Administration","Architectural", "Civil","Commercial","Electrical","Environmental","Fire","Geotechnical","Health and Safety","HVAC","Hydraulics","Internal Fit out","Landscape","Mechanical","Project Management","Structural","Sustainability","Traffic","Vertical Transportation"]
            n=deko.get("DISCIPLINE").split(" , ")[0]
            for i in allDiscipline:
                print("+"*100)
                print(i)
                if n.lower() in i.lower() is True:
                    sub_str_found=True
                print(n.lower() in i.lower())
                score=fuzz.ratio(n.lower(),i.lower())
                print("ratio",score)
                sub_str_scores.append((i,score))
                # print("token_sort_ratio",fuzz.token_sort_ratio(n.lower(),i.lower()))
            if sub_str_found is False:
                deko['DISCIPLINE']="Others"
            else:
                txt,score=max(sub_str_scores, key = lambda t: t[1])
                deko["DISCIPLINE"]=txt
        if deko.get("STATUS") is not None:
            sub_str_found=False
            sub_str_scores=[]
            allStatus = [
                            "A-Approved",
                            "B-Approved as noted",
                            "C-Revise & resubmit",
                            "D-Rejected",
                        ]
            n=deko.get("STATUS").split(" , ")[0]
            for i in allStatus:
                print("+"*100)
                print(i)
                if n.lower() in i.lower() is True:
                    sub_str_found=True
                print(n.lower() in i.lower())
                score=fuzz.ratio(n.lower(),i.lower())
                print("ratio",score)
                sub_str_scores.append((i,score))
                # print("token_sort_ratio",fuzz.token_sort_ratio(n.lower(),i.lower()))
                txt,score=max(sub_str_scores, key = lambda t: t[1])
                deko["STATUS"]=txt
                
        forms.rename(columns={'Left':'x1','Top':'y1','Width':'width','Height':'height'},inplace=True)
        forms['x2']=forms['x1']+forms['width']
        forms['y2']=forms['y1']+forms['height']
        
        final_results = {"mapped_field":deko,"mapped_field_Conf":confList,"unMapped_field":{"Text": lines.to_dict("records"), "Tables": tablesList,"Raw_Text":forms.to_dict('records'),"Key_Values":formsList},"page_width":wd,'page_height':ht}
        final_results.update(eval(request.query_params["DOC_INFO"]))
        print(final_results)
        print("DONE")
        tablesList = list()
        formsList=list()
        rawLines=list()
        return [final_results]
    except Exception as ex:
        print(time.time()-start)
        print(ex)
        traceback.print_exc()
        defRes=dict()
        if len(rawLines) >0:
            defRes["Text"]=lines
        else:
            defRes["Text"]=None
        if len(rawLines) >0:
            defRes["Raw_Text"]=rawLines
        else:
            defRes["Raw_Text"]=None
        if len(rawLines) >0:
            defRes["Tables"]=tablesList
        else:
            defRes["Tables"]=None
        if len(rawLines) >0:
            defRes["Forms"]=formsList
        else:
            defRes["Forms"]=None
        # defRes.update(eval(request.query_params["DOC_INFO"]))
        tablesList = list()
        formsList=list()
        rawLines=list()
        return ["Error Found: {}".format(ex),defRes]

# with open("DummyOutput.json",'w') as f:
#     json.dump(ocrSubmittals("./VEE-RIH-MIR-HVAC-0014-HGE-R0.pdf"),f)