import ray
from fastapi import FastAPI, Request
from ray import serve
from urllib.parse import urlencode
from rayServeTest import *
import requests

app = FastAPI()

@ray.remote
class Dcheck():
    a=0
def checker():
    a=Dcheck.options(name="Romper").remote()
    return "Yolo"



def rMatrix(req: Request):
    c=RespMatrix.options(name="RM_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

def submittalsCaller(req: Request):
    c=Submittals.options(name="Submittals_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"


def addendumsCaller(req: Request):
    c=Addendums.options(name="Addendums_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"


def pdfContractsCaller(req: Request):
    c=PdfContract.options(name="PdfContract_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"


def ocrContractsCaller(req: Request):
    index="OCRContract"
    if eval(req.query_params["DOC_INFO"]).get("otherDocumentCategory") == "Other":
        index="others"
    c=OCRContract.options(name=index+"_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

def ingressDocument(req: Request):
    c=IngDOC.options(name="IngDOC_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

def boqCaller(req: Request):
    c=BOQ.options(name="BOQ_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"


def momCaller(req: Request):
    c=MOM.options(name="MOM_{}".format(eval(req.query_params['DOC_INFO']).get('document_id'))).remote()
    print(ray.get(c.caller.remote(req)))
    return "DONE"

def genAIqa(req: Request):
    print(req.query_params)
    # c=MOM.options(name="GenAI_Question_{}".format(eval(req.query_params['question'])).remote()
    question,doc_type,project_id=(req.query_params['question'],req.query_params['DOCUMEN_TYPE'],req.query_params['PROJECT_ID'])
    data = {"DOCUMEN_TYPE":doc_type,"PROJECT_ID":project_id,"question":question}
    data_encoded = urlencode(data)
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    print(data)
    response = requests.get("http://13.232.88.244:8080/GenQA", headers=headers,params=data_encoded)
    print(response.json())
    return response.json()


app.add_api_route('/checker',methods=["POST",'GET'],endpoint=checker)
app.add_api_route('/RM',methods=["POST",'GET'],endpoint=rMatrix)
app.add_api_route('/Submittals',methods=["POST",'GET'],endpoint=submittalsCaller)
app.add_api_route('/Addendums',methods=["POST",'GET'],endpoint=addendumsCaller)
app.add_api_route('/PdfContract',methods=["POST",'GET'],endpoint=pdfContractsCaller)
app.add_api_route('/OCRContract',methods=["POST",'GET'],endpoint=ocrContractsCaller)
app.add_api_route('/BOQ',methods=["POST",'GET'],endpoint=boqCaller)
app.add_api_route('/MOM',methods=["POST",'GET'],endpoint=momCaller)
app.add_api_route('/DocING',methods=["POST",'GET'],endpoint=ingressDocument)
app.add_api_route('/GenQA',methods=["POST",'GET'],endpoint=genAIqa)

@serve.deployment(route_prefix="/")
@serve.ingress(app)
class FastAPIWrapper:
    pass


serve.run(FastAPIWrapper.bind(),host="0.0.0.0",port="8080")