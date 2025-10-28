# from crypt import methods
from flask import Flask, request
import os
import urllib.request
from flask import Flask, request, redirect, jsonify
from werkzeug.utils import secure_filename
# from rayServeTest import *
import ray
from ray import  serve
from elasticsearch import Elasticsearch
from pprint import pprint
import traceback
from elasticsearch import helpers
from matrix import resMatrix
from submittals import ocrSubmittals
from text_pdf_extractor import extract
from ContractsOCR import ocrDoc
import requests
from tender_addendums import addendums
from bertModel import DocumentReader
import json
from bertModel import checkIsStopWord
import torch
from elasticsearch import Elasticsearch
from BOQ import boq
from pdfContracts import extract_from_pdf
from MOM import mom
from elasticsearch import helpers
import pandas as pd
from rayServeTest import *


bertModel=None

opts={"host":"0.0.0.0","port":"8080"}
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
# BertQA.options(ray_actor_options={"num_cpus":1}).deploy()
if ray.is_initialized() == False:
    print("="*400)
    ray.init("auto")
    # serve.shutdown()
    serve.start(http_options=opts,detached=True)
    # BertQA.delete()
    # BertQA.options(ray_actor_options={"num_cpus":1}).deploy()
    bertModel=BertQA.get_handle()
    # ray.shutdown()
    print("+"*200)

class Reqs():
    def __init__(self,request) -> None:
        self.query_params=dict(request.args)

@app.route('/StopBert', methods=['POST','GET'])
def stopBERT():
    BertQA.delete()
    return "Stopped"

@app.route('/StartBert', methods=['POST','GET'])
def startBERT():
    BertQA.options(ray_actor_options={"num_cpus":1}).deploy()
    return "Working"

@app.route('/RM',methods=["POST",'GET'])
def rMatrix():
    req=Reqs(request)
    c=RespMatrix.options(name="RM_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/Submittals',methods=["POST",'GET'])
def submittalsCaller():
    req=Reqs(request)
    c=Submittals.options(name="Submittals_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/Addendums',methods=["POST",'GET'])
def addendumsCaller():
    req=Reqs(request)
    c=Addendums.options(name="Addendums_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/PdfContract',methods=["POST",'GET'])
def pdfContractsCaller():
    req=Reqs(request)
    c=PdfContract.options(name="PdfContract_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/OCRContract',methods=["POST",'GET'])
def ocrContractsCaller():
    req=Reqs(request)
    index="OCRContract"
    if eval(req.query_params["DOC_INFO"]).get("otherDocumentCategory") is not None:
        index="others"
    c=OCRContract.options(name=index+"_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/BOQ',methods=["POST",'GET'])
def boqCaller():
    req=Reqs(request)
    c=BOQ.options(name="BOQ_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/MOM',methods=["POST",'GET'])
def momCaller():
    req=Reqs(request)
    c=MOM.options(name="MOM_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

@app.route('/BERT',methods=["POST",'GET'])
def bertCaller():
    req=Reqs(request)
    
    # c=bert.options(name="BERT_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    # print(ray.get(c.caller.remote(req)))
    return {"data":ray.get(bertModel.remote(req))}

if __name__ == '__main__':
    app.run(debug=False,use_reloader=False,threaded=True)
    # ray.shutdown()