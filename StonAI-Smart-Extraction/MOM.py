from pprint import pprint
from botocore.exceptions import ClientError
import io
import time
import json
from trp import Document
import pdfplumber
import re
import boto3
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from pprint import pprint
from botocore.client import Config
import traceback

config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)


def get_jpeg(img):
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format="jpeg")
    return imgByteArr.getvalue()

def txtrctAPI(img):
    return textract.analyze_document(
        Document={
            'Bytes': get_jpeg(img),
        },
        FeatureTypes=["TABLES","FORMS"])

def parseDocr(level,data,proceesed=False,label=None):
    
  results=list()
  node={"Level":5,"Label":"None","Data":list()}
  if label is None:
    for item in data:
      if item["Level"]!=level:
        node["Data"].append(item)
      elif item["Level"]==level:
        results.append(node)
        node={"Level":item["Level"],"Label":item["Text"],"Data":list()}
    results.append(node)
    return results
  else:
    lastLabel=""
    for item in data["Data"]:
      if item["Level"]==level:
        results.append(node)
        node={"Level":item["Level"],"Label":label+item["Text"],"Data":list()}
        lastLabel=label+item["Text"]
        
      
      elif item["Level"]!=level:
        node["Data"].append(item)


    if len(results)==0 or len(results)==1:
      results.append(node)
    else:
      results.append(node)
    for item in results:
      if item["Label"]=="None" and len(item["Data"])!=0:
        item["Label"]=label
    return results

def reMatch(text):
  
  if re.match(r"^[A-Z]\.[0-9](\s|\S)*",text):
    return 2
  if re.match(r"^[A-Z][0-9]\s(\s|\S)*",text):
    return 2
  elif re.match(r"^[A-Z][0-9]\.([0-9])*(\s|\S)*",text):
    return 3
  elif re.match(r"^\#\s[0-9]*\s\/[0-9]*\.[0-9]*\.[0-9]*\s(\s|\S)*",text):
    return 4
  elif re.match(r"^[A-Z]\s(\s|\S)*",text):
    return 1
  else:
    return 5

def processCover(cover):
    found={
        "keys":False,
        "doc_Details":False,
        "people":False,
        "next_Meet":False
    }
    keys={"FROM:":None,
        "TO:":None,
        "DATE:":None,
        "COPY:":None,
        "SUBJECT:":None}
    doc_Details={
        "Creation date:":None,
        "Project no.:":None,
        "Date of meeting:":None,
        "Doc. no.:":None,
        "Time:":None,
        "Manager:":None,
        "Place:":None,
        "Script Writer:":None,
        "Subject:":None,}
    people={
        "Participant / Dispatcher:":["Name","Function","Company","Present","by proxy"]
        }

    nextMeet={
        "Number:":None,
        "Subject:":None,
        "Date:":None,
        "Time:":None,
        "Place:":None,}
    pTables=list()
    for n,row in enumerate(cover):
        if found['keys'] is not True:
            if all(keys.values()) is False:
                if row is not "":
                    if "FROM:" in row and keys["FROM:"] is None:
                        start=row.index("FROM:")
                        end=row.index("TO:")
                        keys["FROM:"]=row[start:end]
                    if "TO:" in row and keys["TO:"] is None:
                        start=row.index("TO:")
                        end=row.index("DATE:")
                        keys["TO:"]=row[start:end]
                    if "DATE:" in row and keys["DATE:"] is None:
                        start=row.index("DATE:")
                        keys["DATE:"]=row[start:]
                    if "COPY:" in row and keys["COPY:"] is None:
                        start=row.index("COPY:")
                        keys["COPY:"]=row[start:]
                    if "SUBJECT:" in row and keys["SUBJECT:"] is None:
                        start=row.index("SUBJECT:")
                        keys["SUBJECT:"]=row[start:]
                    if all(keys.values()) is True:
                        found["keys"]=True
        if found['doc_Details'] is not True:
            if all(doc_Details.values()) is False:
                if row is not "":
                    if "Creation date:" in row and doc_Details["Creation date:"] is None:
                        start=row.index("Creation date:")
                        end=row.index("Project no.:")
                        doc_Details["Creation date:"]=row[start:end]
                if row is not "":
                    if "Project no.:" in row and doc_Details["Project no.:"] is None:
                        start=row.index("Project no.:")
                        doc_Details["Project no.:"]=row[start:]
                if row is not "":
                    if "Date of meeting:" in row and doc_Details["Date of meeting:"] is None:
                        start=row.index("Date of meeting:")
                        end=row.index("Doc. no.:")
                        doc_Details["Date of meeting:"]=row[start:end]
                if row is not "":
                    if "Doc. no.:" in row and doc_Details["Doc. no.:"] is None:
                        start=row.index("Doc. no.:")
                        doc_Details["Doc. no.:"]=row[start:]
                if row is not "":
                    if "Time:" in row and doc_Details["Time:"] is None:
                        start=row.index("Time:")
                        end=row.index("Manager:")
                        doc_Details["Time:"]=row[start:end]
                if row is not "":
                    if "Manager:" in row and doc_Details["Manager:"] is None:
                        start=row.index("Manager:")
                        doc_Details["Manager:"]=row[start:]
                if row is not "":
                    if "Place:" in row and doc_Details["Place:"] is None:
                        start=row.index("Place:")
                        end=row.index("Script Writer:")
                        doc_Details["Place:"]=row[start:end]
                if row is not "":
                    if "Script Writer:" in row and doc_Details["Script Writer:"] is None:
                        start=row.index("Script Writer:")
                        doc_Details["Script Writer:"]=row[start:]
                if row is not "":
                    if "Subject:" in row and doc_Details["Subject:"] is None:
                        start=row.index("Subject:")
                        doc_Details["Subject:"]=row[start:]
                if all(doc_Details.values()) is True:
                    found["doc_Details"]=True

        if found['next_Meet'] is not True:
            if all(nextMeet.values()) is False:
                if row is not "":
                    if "Number:" in row and nextMeet["Number:"] is None:
                        start=row.index("Number:")
                        nextMeet["Number:"]=row[start:]
                if row is not "":
                    if "Subject:" in row and nextMeet["Subject:"] is None:
                        start=row.index("Subject:")
                        nextMeet["Subject:"]=row[start:]
                if row is not "":
                    if "Date:" in row and nextMeet["Date:"] is None:
                        start=row.index("Date:")
                        nextMeet["Date:"]=row[start:]
                if row is not "":
                    if "Time:" in row and nextMeet["Time:"] is None:
                        start=row.index("Time:")
                        nextMeet["Time:"]=row[start:]
                if row is not "":
                    if "Place:" in row and nextMeet["Place:"] is None:
                        start=row.index("Place:")
                        nextMeet["Place:"]=row[start:]



    found=False
    for row in cover:
        if "Participant / Dispatcher" in row:
            found=True
            continue
        if "Next meeting:" in row:
            break
        if found and row != "":
            pTables.append(re.split(r'\s{3,}', row))
    resTable=list()
    cols=pTables.pop(0)
    for row in pTables:
        d=dict()
        for i,m in zip(row,cols):
            if i =="":
                continue
            if m=="":
                continue
            d[m]=i
        resTable.append(d)

    return resTable,keys,doc_Details,nextMeet

def mom(request=None):
    es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
    start = time.time()
    global tablesList,formsList,rawLines
    try:
        bucket_name = request.query_params["BUCKET"]#'documentsstonai'
        key_name = request.query_params["KEY"]#'Schedule 7_ Responsibility Matrix.pdf'
        s3 = boto3.resource('s3')
        buf=io.BytesIO()
        s3.Bucket(bucket_name).download_fileobj(key_name, buf)
        pdf=pdfplumber.open(buf)
        print(start)
        pages=pdf.pages
        body=[[{"Page":n,"Text":text,"Level":reMatch(text) } for text in page.extract_text().split("\n")] for n,page in enumerate(pages) if n!=0]
        cover=pages.pop(0)
        bdy=list()
        nod=[bdy.extend(x) for x in body]
        body=bdy
        resList=list()
        body=parseDocr(level=1,data=body)
        nbody=list()
        for item in body:
            res=parseDocr(level=2,data=item,label=item["Label"])
            nbody.extend(res)
        body=nbody
        nbody=list()
        for item in body:
            res=parseDocr(level=3,data=item,label=item["Label"])
            nbody.extend(res)
            nbody=[item for item in nbody if item["Label"]!="None" and len(item["Data"])!=0]


        node={"Page":"","Label":"None","Text":""}
        last=None
        for item in nbody:
            found=False
            if last is not None:
                resList.append(node)
            node={"Page":"","Label":"None","Text":""}
            for dip in item["Data"]:
                if dip["Level"]==4:
                    if found is True:
                        resList.append(node)
                        last=node
                        node={"Page":"","Label":"None","Text":""}
                        node["Page"]=dip["Page"]
                        node["Label"]=item["Label"]
                        node["Text"]=dip["Text"]
                        found=True
                    else:
                        node={"Page":"","Label":"None","Text":""}
                        node["Page"]=dip["Page"]
                        node["Label"]=item["Label"]
                        node["Text"]=dip["Text"]
                        found=True
                elif dip["Level"]==5:
                    if found is False:
                        node={"Page":"","Label":"None","Text":""}
                        node["Page"]=dip["Page"]
                        node["Label"]=item["Label"]
                        node["Text"]=dip["Text"]
                        resList.append(node)
                        last=node
                        found=False
                    else:
                        node["Text"]=node["Text"]+dip["Text"]
        
        
        resTable,keys,doc_Details,nextMeet=processCover(cover.extract_text(layout=True,x_density=5).split("\n"))
        for row in resTable:
            row.update(eval(request.query_params["DOC_INFO"]))
        
        
        actions = [
        {
            "_index": "mom_attendees_extractions",
            "_source": item
        }
        for item in resTable
        ]

        helpers.bulk(es, actions)
        dd={"Doc_Information":doc_Details,"Meeting_Details":keys,"Next_Meeting_Details":nextMeet}
        dd.update(eval(request.query_params["DOC_INFO"]))
        actions = [
        {
            "_index": "mom_cover_extractions",
            "_source": item
        }
        for item in [dd]
        ]

        helpers.bulk(es, actions)
        dd={"Doc_Information":doc_Details,"Meeting_Details":keys,"Next_Meeting_Details":nextMeet}
        dd.update(eval(request.query_params["DOC_INFO"]))
        
        for row in resList:
            row.update(eval(request.query_params["DOC_INFO"]))
        actions = [
        {
            "_index": "mom_body_extractions",
            "_source": item
        }
        for item in resList
        ]

        helpers.bulk(es, actions)
    except Exception as ex:
        traceback.print_exc()
