from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch
from collections import OrderedDict
from nltk.corpus import stopwords
import nltk
import pandas as pd



nltk.download('stopwords')

nltk.download('punkt')

stop_words = stopwords.words('english');

def Union(lst1, lst2):
    final_list = list(set(lst1) | set(lst2))
    return final_list

# stop_words2 = pd.read_json('rayServe/stop_words_english.json')[0].tolist()
# stop_words2=Union(stop_words,stop_words2)
# stop_words = stop_words2

def checkIsStopWord(x):
    if len(x.split())==1:
        if x in stop_words:
            return ""
        else:
            return x
    else:
        return x


class DocumentReader:
    def __init__(self, pretrained_model_name_or_path='bert-large-uncased-whole-word-masking-finetuned-squad'):
        self.READER_PATH = pretrained_model_name_or_path
        self.tokenizer = AutoTokenizer.from_pretrained(self.READER_PATH)
        self.model = AutoModelForQuestionAnswering.from_pretrained(self.READER_PATH)
        self.max_len = self.model.config.max_position_embeddings
        self.chunked = False

    def tokenize(self, question, text):
        self.inputs = self.tokenizer.encode_plus(question, text, add_special_tokens=True, return_tensors="pt")
        self.input_ids = self.inputs["input_ids"].tolist()[0]

        if len(self.input_ids) > self.max_len:
            self.inputs = self.chunkify()
            self.chunked = True

    def chunkify(self):
        """ 
        Break up a long article into chunks that fit within the max token
        requirement for that Transformer model. 

        Calls to BERT / RoBERTa / ALBERT require the following format:
        [CLS] question tokens [SEP] context tokens [SEP].
        """

        # create question mask based on token_type_ids
        # value is 0 for question tokens, 1 for context tokens
        qmask = self.inputs['token_type_ids'].lt(1)
        qt = torch.masked_select(self.inputs['input_ids'], qmask)
        chunk_size = self.max_len - qt.size()[0] - 1 # the "-1" accounts for
        # having to add an ending [SEP] token to the end

        # create a dict of dicts; each sub-dict mimics the structure of pre-chunked model input
        chunked_input = OrderedDict()
        for k,v in self.inputs.items():
            q = torch.masked_select(v, qmask)
            c = torch.masked_select(v, ~qmask)
            chunks = torch.split(c, chunk_size)
            
            for i, chunk in enumerate(chunks):
                if i not in chunked_input:
                    chunked_input[i] = {}

                thing = torch.cat((q, chunk))
                if i != len(chunks)-1:
                    if k == 'input_ids':
                        thing = torch.cat((thing, torch.tensor([102])))
                    else:
                        thing = torch.cat((thing, torch.tensor([1])))

                chunked_input[i][k] = torch.unsqueeze(thing, dim=0)
        return chunked_input

    def get_answer(self):
        if self.chunked:
            outputsLst=list()
            answer = ''
            for k, chunk in self.inputs.items():
                outputs = self.model(**chunk)
                answer_start = torch.argmax(outputs.start_logits)
                answer_end = torch.argmax(outputs.end_logits) + 1
                ans = self.convert_ids_to_string(chunk['input_ids'][0][answer_start:answer_end])
                if ans != '[CLS]':
                    answer += ans + " / "
                    outputsLst.append(outputs)
            return (outputs,answer,True)
        else:
            outputs = self.model(**self.inputs)
            
            answer_start = torch.argmax(outputs.start_logits)  # get the most likely beginning of answer with the argmax of the score
            answer_end = torch.argmax(outputs.end_logits) + 1  # get the most likely end of answer with the argmax of the score
        
            return (outputs, self.convert_ids_to_string(self.inputs['input_ids'][0][
                                              answer_start:answer_end]),False)

    def convert_ids_to_string(self, input_ids):
        return self.tokenizer.convert_tokens_to_string(self.tokenizer.convert_ids_to_tokens(input_ids))