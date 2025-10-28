
from trp import Document
from botocore.exceptions import ClientError
import io
import traceback
import time
import datetime, requests,re
import boto3
from urllib.parse import urlencode
import pandas as pd
import multiprocessing as mp
from multiprocessing.pool import ThreadPool
from pdf2image import convert_from_bytes
from botocore.client import Config
from elasticsearch import Elasticsearch
from elasticsearch import helpers

config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)
es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
sizes=pd.read_csv('/home/ubuntu/StonAI-Smart-Extraction/sizes.csv',header=0)




def get_Lines(pgno, data):
    a, x = data
    doc = Document(a)
    w, h = x.size
    lines = list()
    for page in doc.pages:
        lines.extend(page._lines)
    
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

def ingDoc(request):

    global sizes
    print("Start :{}".format(datetime.datetime.now()))
    print(request.query_params)
    bucket_name = request.query_params["BUCKET"]#'documentsstonai'
    key_name = request.query_params["KEY"]#'Schedule 7_ Responsibility Matrix.pdf'
    project_id=request.query_params['project_id']
    doc_type=request.query_params['doc_type']
    doc_name=request.query_params['NAME']
    s3 = boto3.resource('s3')
    buf=io.BytesIO()
    print("Getting Document from S3 Bucket")
    s3.Bucket(bucket_name).download_fileobj(key_name, buf)

    print(datetime.datetime.now())
    start = time.time()
    print("Starting")
    try:
        images=convert_from_bytes(buf.getvalue())
        print("GOT Images: {}".format(len(images)))
        print(time.time()-start)
        p2 = ThreadPool(mp.cpu_count())
        axe = p2.map(txtrctAPI, images)

        print(time.time()-start)
        p2.close()

        df = pd.concat([get_Lines(a, x)
                        for a, x in enumerate(zip(axe, images))])
        print(df.head())
        print(time.time()-start)
        documents=[]
        for i,frame in df.groupby("Page"):
            # documents.append(re.sub(r"[^a-zA-Z0-9. ]", "", " ".join(frame.sort_values(["Top", "Left"])['Text'].tolist()))+"__PageEND__")
            doc=re.sub(r"[^a-zA-Z0-9. ]", "", " ".join(frame.sort_values(["Top", "Left"])['Text'].tolist()))
            # print(len(" ".join(documents).split("__PageEND__")))
            data = {"DOCUMEN_TYPE":doc_type,"PROJECT_ID":project_id,"DOCUMENT_ID":key_name,"Page_No":i,"TEXT":doc,"DOC_NAME":doc_name}
            data_encoded = urlencode(data)
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            print(data)
            response = requests.post("http://13.232.88.244:8080/DocING", headers=headers,params=data_encoded)
            print(response)
        # df = df.sort_values(["Page", "Top", "Left"])
        # hnText=" ".join(df['Text'].tolist())
        # print(len(" ".join(documents).split("__PageEND__")))
        # data = {"DOCUMEN_TYPE":doc_type,"PROJECT_ID":project_id,"DOCUMENT_ID":key_name,"TEXT":" ".join(documents),}
        # data_encoded = urlencode(data)
        # headers = {"Content-Type": "application/x-www-form-urlencoded"}
        # print(data)
        # response = requests.post("http://3.110.197.105:8080/DocING", headers=headers,params=data_encoded)
        # print(response)
        
        print("DONE")
    except Exception as ex:
        print(time.time()-start)
        print(traceback.format_exc())
        print(ex)
        return "Error Found: {}".format(ex)

