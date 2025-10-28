# import tempfile

# from cv2 import trace
from trp import Document
from botocore.exceptions import ClientError
import io
import time,traceback
import json
import boto3
from elasticsearch import Elasticsearch
from elasticsearch import helpers
import pandas as pd
import multiprocessing as mp
from multiprocessing.pool import ThreadPool
import requests
from pdf2image import convert_from_bytes
from botocore.client import Config

tablesList = list()

config = Config(retries = dict(max_attempts = 15))
textract = boto3.client('textract',config=config)

es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))


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

def get_images(pdf):
    print("Getting Image")
    imgs=list()
    example = Pdf.open(pdf)
    for page in example.pages:
        imkeys=list(page.images.keys())
        for key in imkeys:
            imgs.append(PdfImage(page.images[key]).as_pil_image())
            print("Width and Height:{}".format(PdfImage(page.images[key]).as_pil_image().size))
    x=[ a.save("images/{}.jpg".format(i)) for i,a in enumerate(imgs)]
    return imgs

def resMatrix(request):
    start = time.time()
    try:
        bucket_name = request.query_params["BUCKET"]#'documentsstonai'
        key_name = request.query_params["KEY"]#'Schedule 7_ Responsibility Matrix.pdf'
        s3 = boto3.resource('s3')
        buf=io.BytesIO()
        s3.Bucket(bucket_name).download_fileobj(key_name, buf)
        images=convert_from_bytes(buf.getvalue())
        print("GOT Images: {}".format(len(images)))
        print(time.time()-start)
        print(time.time()-start)
        wd,ht=images[0].size
        p2 = ThreadPool(mp.cpu_count())
        axe = p2.map(txtrctAPI, images)
        print(time.time()-start)
        p2.close()
        ad = {
            "S/N": "S/N",
            "ACTIVITY": "ACTIVITY",
            "REMARKS": "REMARKS"}
        jj=[get_Lines(a, x) for a, x in enumerate(zip(axe, images))]
        cols=None
        tb=list()
        found=False
        rLocs=list()
        for n,(a,tabl,locs) in enumerate(tablesList):
            if  found is False:
                if len([string for string in [" ".join(r) for r in tabl[0]] if any(substring in string for substring in list(ad.values()))]):
                    cols=[" ".join(r) for r in tabl.pop(0)]
                    dunpo=locs.pop(0)
                    tb.append(pd.DataFrame(tabl,columns=cols))
                    rLocs.extend(locs)
                    found = True
            elif found :
                print(3)
                if len(cols)==len(tabl[0]):
                    tb.append(pd.DataFrame(tabl,columns=cols))
                    rLocs.extend(locs)
        tb=pd.concat(tb,ignore_index=True)
        outputs=list()
        print(len(rLocs),len(tb))
        for loc,row in zip(rLocs,tb.to_dict("records")):
            d=dict()
            ig=list()
            eCols=list()
            for key in list(ad.keys()):
                for strings in row.keys():
                    if key in strings:
                        d[ad[key]]=row[strings]
                        ig.append(strings)
                    else:
                        eCols.append(strings)
            sd=list()
            # print(eCols)
            print(ig)
            for x in list(set(eCols)):
                if row[x][0] != "" and x not in ig:
                    for i in ig:
                        if row[x][0] not in i:
                            sd.append(x)
            d["Responsible"]=list(set(sd))
            d.update(loc)
            d.update(eval(request.query_params["DOC_INFO"]))
            outputs.append(d)

        actions = [
        {
            "_index": "resp_matrix",
            "_source": item
        }
        for item in outputs
        ]

        helpers.bulk(es, actions)

        print("DONE")    # return {"Outputs":outputs,"Raw Data":tb.to_dict("records")}
    except Exception as ex:
        traceback.print_exc()