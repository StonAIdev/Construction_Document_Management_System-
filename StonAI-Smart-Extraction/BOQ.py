import tempfile
from trp import Document
from botocore.exceptions import ClientError
import io
import time
import numpy as np
import json
import boto3
from elasticsearch import Elasticsearch
from elasticsearch import helpers
import pandas as pd
import multiprocessing as mp
from multiprocessing.pool import ThreadPool
import requests
import traceback
from pprint import pprint
from pdf2image import convert_from_bytes,convert_from_path
from botocore.client import Config
import ray

tablesList = list()

config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)

es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))

tablesList = list()
formsList=list()
rawLines=list()

def get_jpeg(img):
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format="jpeg")
    return imgByteArr.getvalue()


def get_Lines(pgno, data):
    a, x = data
    doc = Document(a)
    w, h = x.size
    lines = list()
    for page in doc.pages:
        tbList = list()
        tLocList=list()
        for table in page.tables:
            is_table = True
            for row in table.rows:
                if len(row.cells) <= 2:
                    is_table = False
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
                
                tablesList.append((pgno, t,rLoc))
                tbList.append(table.geometry)

def txtrctAPI(img):
    return textract.analyze_document(
        Document={
            'Bytes': get_jpeg(img),
        },
        FeatureTypes=["TABLES"])

@ray.remote(num_cpus=0.15)
def get_Table_Columns(table):
    i,table,locs=table
    cols=list()
    iTabl=list()
    for loc,row in zip(locs,table):
        row=[" ".join(col) for col in row]
        iTabl.append(row)
    for n,row in enumerate(iTabl):
        lot=len(row)
        if len(cols)==lot:
            break
        for col in row:
            if len(cols)==lot:
                break
            elif len(col)>0 or col is not None or col != "" or col.isspace() != True:
                if col == "":
                    break
                if col.isspace():
                    break
                lot+=1
                cols.append(col)
            else:
                lot=0
                cols=list()
                break
    return {"Columns":cols,"Table":iTabl,"Locations":locs}

def boq(request=None):
    start = time.time()
    try:
        global tablesList,formsList,rawLines
        bucket_name = request.query_params["BUCKET"]#'documentsstonai'
        key_name = request.query_params["KEY"]#'Schedule 7_ Responsibility Matrix.pdf'
        s3 = boto3.resource('s3')
        buf=io.BytesIO()
        s3.Bucket(bucket_name).download_fileobj(key_name, buf)
        images=convert_from_bytes(buf.getvalue())
        print("GOT Images: {}".format(len(images)))
        print(time.time()-start)
        print(time.time()-start)
        p2 = ThreadPool(mp.cpu_count())
        axe = p2.map(txtrctAPI, images)
        print(time.time()-start)
        p2.close()
        jj=[get_Lines(a, x) for a, x in enumerate(zip(axe, images))]
        cols=None
        tb=list()
        found=False

        tabls=ray.get([get_Table_Columns.remote(table=table) for table in tablesList])
        locs=list()
        for d in tabls:
            locs.extend(d['Locations'])
        cols=[d["Columns"] for d in tabls]
        tabls=[d["Table"] for d in tabls]

        print(cols)
        if len(cols) != 1:
            data,counts=np.unique(cols,return_counts=True)
            data=list(data)
            counts=list(counts)
            columns=data[counts.index(max(counts))]
        else:
            columns=cols[0]
        columns=[col.replace("."," ") for col in columns]
        print(columns)
        tables=pd.concat([pd.DataFrame(tabl,columns=list(columns)) for tabl in tabls if len(tabl[0])==len(columns)]).to_dict('records')
        outputs=list()
        for loc,row in zip(locs,tables):
            row=dict(row)
            row.update(loc)
            row.update(eval(request.query_params["DOC_INFO"]))
            row["Columns"]=columns
            outputs.append(row)
        
        
        actions = [
        {
            "_index": "boq_results",
            "_source": item
        }
        for item in outputs
        ]
        helpers.bulk(es, actions)

        print("DONE")    # return {"Outputs":outputs,"Raw Data":tb.to_dict("records")}
    except Exception as ex:
        traceback.print_exc()
