from pprint import pprint
from trp import Document
from botocore.exceptions import ClientError
from json import JSONEncoder
import re
import io
import traceback
import time
import itertools
import json
import os
import datetime
from collections import Counter
import boto3
import pandas as pd
# import gridfs,base64
import multiprocessing as mp
from multiprocessing.pool import ThreadPool
from pdf2image import convert_from_bytes
import numpy as np
import cv2,math
from botocore.client import Config
from elasticsearch import Elasticsearch
from elasticsearch import helpers

from joblib import   load
tablesList = list()

config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)
es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
sizes=pd.read_csv('/home/ubuntu/StonAI-Smart-Extraction/sizes.csv',header=0)

# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# mydb = myclient["ZContracts"]



class Grouper:
    """simple class to perform comparison when called, storing last element given"""

    def __init__(self, diff):
        self.last = None
        self.diff = diff

    def predicate(self, item):
        if self.last is None:
            return True
        return abs(self.last - item) < self.diff

    def __call__(self, item):
        """called with each item by takewhile"""
        result = self.predicate(item)
        self.last = item
        return result

def group_by_difference(items, diff=10):
    results = []
    start = 0
    remaining_items = items
    while remaining_items:
        g = Grouper(diff)
        group = [*itertools.takewhile(g, remaining_items)]
        results.append(group)
        start += len(group)
        remaining_items = items[start:]
    return results

def get_level(value, jinker):
    axe = iter(jinker.items())
    for x, a in axe:
        if value in a:
            return x

def get_REMatch(jaxx):
    if re.match(r'/\d\.\s+|\([a-z]\)\s+|\(.*?\)|[a-z]\)\s+|\[\d+\]$|\([0-9].*?\)|\w[.)]\s*|\([a-z]\)\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g', jaxx):
        return 2
    elif re.match(r'[0-9]*\n', jaxx):
        return 1
    elif re.match(r'^-?\d+(?:\.\d+)$', jaxx):
        return 1
    else:
        return 0

def zero(x):
    if len(x) == 2:
        if x["Is_Bullet"].tolist()[0] == 1:
            return pd.DataFrame({"Width": x["Width"].sum(), "Is_Bullet": x["Is_Bullet"].iloc[0], "Y_level": x["Y_level"].iloc[0],
                                 "Page": x["Page"].iloc[0], "Left": x["Left"].iloc[0], "Top": x["Top"].min(), "Height": x["Height"].max(),
                                 "Text": ' '.join(x['Text'].tolist()), "X_level": x["X_level"].min()}, index=[0])

        else:
            return x
    else:
        return x

def hMerger(pgno, adf):
    ya = group_by_difference(list(set(adf["Top"].values.tolist())), 40)
    for sublist in ya:
        sublist.sort()
    ya.sort()
    qwe = list(range(len(ya)))
    ya = {q: a for q, a in zip(qwe, ya)}
    adf["Y_level"] = [get_level(r, ya) for r in adf["Top"].tolist()]
    adf = pd.concat([zero(x) for x in [x.sort_values(
        "X_level", inplace=False) for a, x in adf.groupby(["Y_level"])]])

    return adf

def get_Lines(pgno, data):
    a, x = data
    doc = Document(a)
    w, h = x.size
    lines = list()
    for page in doc.pages:
        tbList = list()
        for table in page.tables:
            is_table = True
            for row in table.rows:
                if len(row.cells) <= 2:
                    is_table = False
            # if is_table:
            #     t = list()
            #     for row in table.rows:
            #         r = list()
            #         dummy = [r.append([cell.text]) for cell in row.cells]
            #         t.append(r)
            if is_table:
                t = list()
                rLoc=list()
                for row in table.rows:
                    r = list()
                    dummy = [r.append([cell.text]) for cell in row.cells]
                    t.append(r)
                    left=top=height=None
                    width=0.0
                    for cell in row.cells:
                        bb=cell.geometry.boundingBox
                        width+=bb.width
                        if left is None:
                            left=bb.left
                        elif left is not None and bb.left<left:
                            left=bb.left
                        if top is None :
                            top=bb.top
                        elif top is not None and bb.top<top:
                            top=bb.top
                        if height is None:
                            height=bb.height
                        elif top+height<top+bb.height:
                            height=bb.height
                    rLoc.append({"x1":left*w,"y1":top*h,"x2":(left+width)*w,"y2":(top+height)*h,"height":height*h,"width":width*h,"page_width":w,"page_height":h,"Page":pgno+1})
                
                tablesList.append({"pgno":pgno,"Table":t,"Locations":rLoc})

                tbList.append(table.geometry)
        for line in page._lines:
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
    lines = [{"Text": line.text, "Page": pgno, "Left": line.geometry.boundingBox.left*w, "Top": line.geometry.boundingBox.top *
              h, "Height": line.geometry.boundingBox.height*h, "Width": line.geometry.boundingBox.width*w} for line in lines]
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

def get_tH(img,txt,ht):
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

def removeHF(final_df,doc_len,maxPageSize):
    fdf=list()
    df=final_df
    pgs=list(set(df['Page'].tolist()))
    reps = {a: x for a, x in final_df['Text'].value_counts(
        ).to_dict().items() if x > 3}

    uper = (maxPageSize/4)*3
    lowr = maxPageSize/4
    print(uper, lowr)
    for page in pgs:
        adf = final_df[final_df['Text'].isin(reps.keys())]
        adf=df[df['Page']==page]
        adf['Bottom'] = adf['Top']+adf['Height']
        adf = adf.groupby(["Text"]).size(
        ).reset_index().rename(columns={0: 'count'})

        adf = adf[adf['count'] > 2]
        h1 = adf['Text'].values.tolist()
        h1 = final_df[final_df['Text'].isin(h1)]
        hheaders = h1[h1['Top'] >= uper].groupby(
            ["Text"]).size().reset_index().rename(columns={0: 'count'})
        hfooters = h1[h1['Top'] <= lowr].groupby(
            ["Text"]).size().reset_index().rename(columns={0: 'count'})

        hheaders = hheaders[hheaders['count'] >= doc_len/2]
        hheaders = h1[h1['Text'].isin(hheaders['Text'].values.tolist())]
        hh1 = hheaders
        hheaders = hheaders['Top'].min()

        hfooters = hfooters[hfooters['count'] >= doc_len/2]
        hfooters = h1[h1['Text'].isin(hfooters['Text'].values.tolist())]
        hf1 = hfooters
        hfooters = hfooters['Top'].max()
        if hheaders == 0:
            hheaders = maxPageSize
        if math.isnan(hheaders):
            hheaders = maxPageSize

        final_df = final_df[final_df['Top'] < hheaders]
        if math.isnan(hfooters):
            hfooters = 0
        final_df = final_df[final_df['Top'] > hfooters]
        fdf.append(final_df)
    return pd.concat(fdf)

def ocrDoc(request):

    global sizes
    print("Start :{}".format(datetime.datetime.now()))
    bucket_name = request.query_params["BUCKET"]#'documentsstonai'
    key_name = request.query_params["KEY"]#'Schedule 7_ Responsibility Matrix.pdf'
    s3 = boto3.resource('s3')
    buf=io.BytesIO()
    print("Getting Document from S3 Bucket")
    s3.Bucket(bucket_name).download_fileobj(key_name, buf)

    print(datetime.datetime.now())
    start = time.time()
    print("Starting")
    try:
        images=convert_from_bytes(buf.getvalue())
        maxPageSize=images[0].size[1]
        pgs=dict()
        for n,i in enumerate(images):
            wd,ht=i.size
            pgs['{}'.format(n+1)]={"Width":wd,"Height":ht}
        print("GOT Images: {}".format(len(images)))
        print(time.time()-start)
        print(time.time()-start)
        # wd,ht=images[0].size
        p2 = ThreadPool(mp.cpu_count())
        axe = p2.map(txtrctAPI, images)

        print(time.time()-start)
        p2.close()

        df = pd.concat([get_Lines(a, x)
                        for a, x in enumerate(zip(axe, images))])
        print(df.head())
        print(time.time()-start)

        df = df.sort_values(["Page", "Top", "Left"])
        df["Is_Bullet"] = [get_REMatch(x["Text"]) for indx, x in df.iterrows()]

        print(time.time()-start)
        print(df.head())

        xa = group_by_difference(list(set(df["Left"].values.tolist())), 10)
        for sublist in xa:
            sublist.sort()
        xa.sort()
        qwe = list(range(len(xa)))
        xa = {q: a for q, a in zip(qwe, xa)}
        df["X_level"] = [get_level(x["Left"], xa) for i, x in df.iterrows()]
        print(time.time()-start)

        df = pd.concat([hMerger(a, x) for a, x in df.groupby(["Page"])])

        print(time.time()-start)

        print(df.head())
        df["Label"] = ["Heading" if fdf["X_level"] ==
                       1 else "Text" for i, fdf in df.iterrows()]
        print(df.head())
        dd=list()
        for i,albedo in df.iterrows():
            x0=math.ceil(albedo['Left'])
            x1=math.ceil(albedo['Left']+albedo['Width'])
            y0=math.ceil(albedo['Top'])
            y1=math.ceil(albedo["Top"]+albedo["Height"])
            dd.append(get_tH(np.array(images[int(albedo['Page'])])[y0:y1,x0:x1],albedo["Text"],pgs["{}".format(int(albedo['Page'])+1)]))
        print(Counter(dd))
        df['Size']=np.array(dd)
        df = df[["Text", "Page", "Left","Size", "Top", "Height", "Width","Is_Bullet"]]
        print(time.time()-start)

        df['TextCount']=[len(x["Text"].split()) for a,x in df.iterrows()]

        df['IsCapital']=[1 if x["Text"].isupper() else 0 for a,x in df.iterrows()]
        pae = load('/home/ubuntu/StonAI-Smart-Extraction/New_Vectorizer.pkl')
        xado=df[["Size","Is_Bullet", "IsCapital","TextCount"]]
        fs=pd.DataFrame(pae.transform(df['Text']).toarray(),columns=pae.get_feature_names())
        xado.reset_index(drop=False, inplace=True)
        fs.reset_index(drop=False, inplace=True)
        x=pd.concat([xado,fs ],axis=1)
        try:
            x=x.drop('level_0',axis=1)
        except Exception as ex:
            print(1)
        if "index" in x.columns:
            print("Found")
        try:
            x=x.drop("index",axis=1)
        except Exception as ex:
            print(2)
        dt = load('/home/ubuntu/StonAI-Smart-Extraction/New_Heading_Model.joblib')
        df["Preds"]=dt.predict(x)
        df['Probs']=[max(a) for a in dt.predict_proba(x)]
        try:
            df=removeHF(df,len(images),maxPageSize)
        except Exception as ex:
            print(ex)
            traceback.print_exc()

        df["Heading"]=df['Preds']
        df["SScore"]=df["Heading"]
        data = df.to_dict("records")
        print(df.columns)
        hnText = list()
        #[["Text", "Page", "Is_Bullet", "SScore"]]
        print("Segmenting")
        node = {"Doc Name": key_name, "Page": 0,
                "Heading": None,"Raw_Texts":list(), "Text": "_ "}
        for x in data:
            if x['SScore'] > 0 and node["Heading"] is not None:
                # node["Text"] = re.split(r'\. \n', node["Text"])
                hnText.append(node)
                node = {"Doc Name": key_name, "Page": x["Page"],
                        "Heading": x['Text'], "Raw_Texts":list(),"Text": " "}
            if x['SScore'] > 0 and node["Heading"] is None:
                node['Heading'] = x['Text']
                node['Score'] = x['SScore']
                node["Page"] = x["Page"]+1
            if x['SScore'] == 0:
                node['Text'] = node['Text']+x['Text']
                x["page_width"]=pgs["{}".format(x['Page']+1)].get("Width")
                x["page_height"]=pgs["{}".format(x['Page']+1)].get("Height")
                x['x1']=x['Left']
                x['Page']=x['Page']+1
                x['y1']=x['Top']
                x['y2']=x['Top']+x['Height']
                x['x2']=x['Left']+x['Width']
                node['Raw_Texts'].append(x)
        print(len(hnText))
        print("Done")
        df=df.to_dict("records")
        final_results = {"Text": hnText, "Tables": tablesList}
        final_results.update(eval(request.query_params["DOC_INFO"]))
        # actions = [
        #             {
        #                 "_index": "ocr_contracts",
        #                 "_source": item
        #             }
        #             for item in [final_results]
        #         ]

        # helpers.bulk(es, actions)
        index="ocr_contracts"
        if eval(request.query_params["DOC_INFO"]).get("sub_category") == "Other":
            index="others"
        texts=list()
        for a in hnText:
            a.update(eval(request.query_params["DOC_INFO"]))
            texts.append(a)
        actions = [
                    {
                        "_index": index+"_texts",
                        "_source": item
                    }
                    for item in texts
                ]

        helpers.bulk(es, actions)
        tbList=list()
        for tn,table in enumerate(tablesList):
            columns=[" ".join(col) if " ".join(col) is not None else "_"  for col in table["Table"].pop(0)]
            table['Locations'].pop(0)
            # for col in columns:
                # if len(col)==0:
                #     continue
            for (rn,row),locs in zip(enumerate(table["Table"]),table['Locations']):
                a=dict()
                a={"Page":table["pgno"],"Columns":columns,"Row_No":rn,"Table_No":tn}
                for m,x in zip(columns,row):
                    m="".join(m)
                    if m is None:
                        a["{}".format(m)]="{}".format(x)
                    elif m.isspace() :
                        a["_"]="{}".format(x)
                    elif len(m)==0 or m.strip() == "" :
                        a["_{}".format("".join(m))]="{}".format(x)
                    elif m is None:
                        a["_{}".format("".join(m))]="{}".format(x)
                    elif len(m)!=0:
                        a["{}".format(m).replace(".","  ")]="{}".format(x)
                a["Doc_Name"]=request.query_params["KEY"]
                a["x1"]=locs['x1']
                a["y1"]=locs['y1']
                a["x2"]=locs['x2']
                a["y2"]=locs['y2']
                a["height"]=locs['height']
                a["width"]=locs['width']
                a["page_width"]=locs['page_width']
                a["page_height"]=locs['page_height']
                a["Page"]=locs['Page']
                a.update(eval(request.query_params["DOC_INFO"]))
                tbList.append(a)
        actions = [
                {
                    "_index": index+"_tables",
                    "_source": item
                }
                for item in tbList
            ]

        helpers.bulk(es, actions)
        print("DONE")
    except Exception as ex:
        print(time.time()-start)
        print(traceback.format_exc())
        print(ex)
        return "Error Found: {}".format(ex)

