import ray
# from ray import  serve
from elasticsearch import Elasticsearch
import traceback
from matrix import resMatrix
from submittals import ocrSubmittals
from ContractsOCR import ocrDoc
from tender_addendums import addendums
# from bertModel import DocumentReader
from genAI import ingDoc
import torch
from elasticsearch import Elasticsearch
from BOQ import boq
from pdfContracts import extract_from_pdf
from MOM import mom
from elasticsearch import helpers
opts={"host":"0.0.0.0","port":"8080"}

# runner=True


# ray.init("auto")
# serve.shutdown()
# serve.start(http_options=opts,detached=True)

@ray.remote(num_cpus=0.3)
class RespMatrix:
    def caller(self, request):
        try:
            resMatrix(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex


@ray.remote(num_cpus=0.3)
class Submittals:
    def caller(self, request):
        try:
            data=ocrSubmittals(request)
            es = Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
            if len(data)==1:
                # actions = [
                # {
                #     "_index": "submittals",
                #     "_source": item
                # }
                # for item in data
                # ]

                # helpers.bulk(es, actions)
                es.update(index='documents',id=request.query_params["KEY"], body={"doc":data[0]})
                return "DONE"
            else:
                return data
        except Exception as ex:
            traceback.print_exc()
            return ex


@ray.remote(num_cpus=0.3)
class Addendums:
    def caller(self, request):
        try:
            addendums(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex

@ray.remote(num_cpus=0.3)
class PdfContract:
    def caller(self, request):
        try:
            # extract(request)
            extract_from_pdf(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex


@ray.remote(num_cpus=0.3)
class OCRContract:
    def caller(self, request):
        try:
            ocrDoc(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex

@ray.remote(num_cpus=0.3)
class IngDOC:
    def caller(self, request):
        try:
            ingDoc(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex
        
@ray.remote(num_cpus=0.3)
class BOQ:
    def caller(self, request):
        try:
            boq(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex

@ray.remote(num_cpus=0.3)
class MOM:
    def caller(self, request):
        try:
            mom(request)
            return "DONE"
        except Exception as ex:
            traceback.print_exc()
            return ex

#dummy class to hide the commented code
class dumpo():
    # @ray.remote(num_replicas=3)
    # class BertQA:
    #     def __init__(self):
    #         self.reader=DocumentReader()
    #     def  caller(self,request):
    #         try:
    #             print("Starting")
    #             df=pd.DataFrame()
    #             texts=list()
    #             print("Getting Fields")
    #             question=request.query_params['QUESTION']
    #             print("Got question")
    #             paraMaxLogit = []
    #             print(type(request.query_params['TEXTS']))
    #             texts=eval(request.query_params['TEXTS'])
    #             print("Got fields")
    #             answers=list()
    #             for text in texts:
    #                 self.reader.tokenize(question, text)
    #                 outputs,answer,chunked=self.reader.get_answer()
    #                 answers.append(answer)
    #             #     if(type(outputs) != str):
    #             #         start_scores = outputs.start_logits
    #             #         end_scores = outputs.end_logits
    #             #         maxstart = torch.max(start_scores)
    #             #         maxend = torch.max(end_scores)
    #             #         maxii = (maxstart+maxend)/2
    #             #         value = maxii.item()
    #             #         paraMaxLogit.append(value)
    #             #         name = outputs.answer
    #             #         sep = '[SEP]'
    #             #         cls = '[CLS]'
    #             #         find = name.find(sep);
    #             #         fCLS = name.find(cls);
    #             #         if find != -1:
    #             #             name = name.lstrip().split(sep)[1].lstrip()
    #             #             print(name)
    #             #         elif fCLS != -1:
    #             #             name = name.lstrip().split(cls)[1].lstrip()
    #             #             print(name)
    #             #         answers.append(name)
    #             #         print("______________XXX___________")
    #             #     else:
    #             #         answers.append("longContext")
    #             #         paraMaxLogit.append(-10)
    #             # answers=[checkIsStopWord(x) for x in answers]
    #             return answers
    #         except Exception as ex:
    #             print(ex)
    # Counter.options(name="123").delete()
    # RespMatrix.options(name="RM",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()
    # Submittals.options(name="Submittals",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()
    # Addendums.options(name="Addendums",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()
    # # PdfContract.options(name="PdfContract",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    # #         "min_replicas": 0,
    # #         "max_replicas": 25,
    # #         "target_num_ongoing_requests_per_replica": 50,
    # #     }).deploy()
    # OCRContract.options(name="OCRContract",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()
    # # BertQA.options(name="BERT",ray_actor_options={"num_cpus":1}).deploy()
    # BOQ.options(name="BOQ",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()
    # MOM.options(name="MOM",ray_actor_options={"num_cpus":0.3},autoscaling_config={
    #         "min_replicas": 0,
    #         "max_replicas": 25,
    #     }).deploy()

    # serve.run(port=80)
    ducks=0