import numpy as np
import pandas as pd
# from tenacity import retry
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.metrics import classification_report
import transformers
from transformers import AutoModel, BertTokenizerFast
from sklearn import metrics
import transformers
import torch
from torch.utils.data import Dataset, DataLoader, RandomSampler, SequentialSampler
from transformers import BertTokenizer, AutoTokenizer, BertModel, BertConfig, AutoModel, AdamW
import warnings
warnings.filterwarnings('ignore')
import math
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
import spacy

def dist(x,y):
    ans=x-y
    # if ans==0:
    #     return 1000
    if x>y:
        return ans
    else:
        return -1*(ans)

def find_X_Center(row):
    if not math.isnan(row['Top']):
        return row['Width']
    else:
        return "Remove"

def find_Y_Center(row):
    if not math.isnan(row['Height']):
        return row['Height']/2
    else:
        return "Remove"

def janko(x):
    import spacy
    #df['Label'] = df['Label'].replace({'answer':0, 'key':1, 'other':2})
    nlp = spacy.load("en_core_web_sm")
    df=x
    # words=df['Text']
    # text = str(words)
    # doc = nlp(text)
    # for token in doc:
    #   spacy=[token.text,token.pos_]
    #   print(spacy)
    ndf=list()
    df['Text']= df['Text'].astype(str)
    for i,x in df.iterrows():
        #print("="*150)
        a={"ADJ":0}
        b={"ADP":0}
        c={"ADV":0}
        d={"AUX":0}
        e={"CONJ":0}
        f={"CCONJ":0}
        g={"DET":0}
        h={"INTJ":0}
        ii={"NOUN":0}
        j={"NUM":0}
        k={"PART":0}
        l={"PRON":0}
        m={"PROPN":0}
        n={"PUNCT":0}
        o={"SCONJ":0}
        p={"SYM":0}
        q={"VERB":0}
        r={"X":0}
        s={"SPACE":0}
        doc = nlp(x['Text'])
        for token in doc:
            spacy=[token.text,token.pos_]
            #print(spacy)
            if token.pos_ == "ADJ":
                a['ADJ']+=1
            elif token.pos_ == "ADP":
                b['ADP']+=1
            elif token.pos_ == "ADV":
                c['ADV']+=1
            elif token.pos_ == "AUX":
                d['AUX']+=1
            elif token.pos_ == "CONJ":
                e['CONJ']+=1
            elif token.pos_ == "CCONJ":
                f['CCONJ']+=1
            elif token.pos_ == "DET":
                g['DET']+=1  
            elif token.pos_ == "INTJ":
                h['INTJ']+=1
            elif token.pos_ == "NOUN":
                ii['NOUN']+=1
            elif token.pos_ == "NUM":
                j['NUM']+=1
            elif token.pos_ == "PART":
                k['PART']+=1
            elif token.pos_ == "PRON":
                l['PRON']+=1
            elif token.pos_ == "PROPN":
                m['PROPN']+=1
            elif token.pos_ == "PUNCT":
                n['PUNCT']+=1
            elif token.pos_ == "SCONJ":
                o['SCONJ']+=1
            elif token.pos_ == "SYM":
                p['SYM']+=1
            elif token.pos_ == "VERB":
                q['VERB']+=1
            elif token.pos_ == "X":
                r['X']+=1
            elif token.pos_ == "SPACE":
                s['SPACE']+=1
            else:
                print("Not found")

        x['ADJ']=a['ADJ']
        x['ADP']=b['ADP']
        x['ADV']=c['ADV']
        x['AUX']=d['AUX']
        x['CONJ']=e['CONJ']
        x['CCONJ']=f['CCONJ']
        x['DET']=g['DET']
        x['INTJ']=h['INTJ']
        x['NOUN']=ii['NOUN']
        x['NUM']=j['NUM']
        x['PART']=k['PART']
        x['PRON']=l['PRON']
        x['PROPN']=m['PROPN']
        x['PUNCT']=n['PUNCT']
        x['SCONJ']=o['SCONJ']
        x['SYM']=p['SYM']
        x['VERB']=q['VERB']
        x['X']=r['X']
        x['SPACE']=s['SPACE']
        ndf.append(x)
    ndf=pd.DataFrame(ndf)
    return ndf

def fdist(answer,question):
    import math
    a = np.array((answer['Left'], answer["Top"]))
    # b = np.array((question['x_Center'], question['y_Center']))
    # dist=math.hypot(answer['x_Center']-question['x_Center'], answer["y_Center"]- question['y_Center'])
    # dist = np.linalg.norm(a-b)
    b = np.array((question['Left'], question['Top']))
    dist = np.linalg.norm(a-b)
    return dist

class BERT_Arch(nn.Module):

    def __init__(self, bert):
      
      super(BERT_Arch, self).__init__()

      self.bert = bert 
      
      # dropout layer
      self.dropout = nn.Dropout(0.1)
      
      # relu activation function
      self.relu =  nn.ReLU()

      # dense layer 1
      self.fc1 = nn.Linear(768,512)
      
      # dense layer 2 (Output layer)
      self.fc2 = nn.Linear(512,3)

      #softmax activation function
      self.softmax = nn.LogSoftmax(dim=1)

    #define the forward pass
    def forward(self, sent_id, mask):

      #pass the inputs to the model  
      _, cls_hs = self.bert(sent_id, attention_mask=mask,return_dict=False)
      
      x = self.fc1(cls_hs)

      x = self.relu(x)

      x = self.dropout(x)

      # output layer
      x = self.fc2(x)
      
      # apply softmax activation
      x = self.softmax(x)

      return x

# def loadModel():
#     # specify GPU
#     device = torch.device("cpu")

#     # import BERT-base pretrained model
#     bert = AutoModel.from_pretrained('bert-base-uncased')
#     # Load the BERT tokenizer
#     tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')

#     # pass the pre-trained BERT to our define architecture
#     model = BERT_Arch(bert)

#     #load weights of best model
#     path = '/content/drive/MyDrive/Bert Model/new_saved_weights.pt'
#     model.load_state_dict(torch.load(path))

#     # push the model to GPU
#     model = model.to(device)
#     return {"Model":model,"Device":device,"Tokenizer":tokenizer}


def classify(df):
    # specify GPU
    device = torch.device("cpu")

    # import BERT-base pretrained model
    bert = AutoModel.from_pretrained('bert-base-uncased')
    # Load the BERT tokenizer
    tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')

    # pass the pre-trained BERT to our define architecture
    model = BERT_Arch(bert)

    model = model.to(device)
    #load weights of best model
    path = '/home/ubuntu/new_submittals_saved_weights.pt'
    model.load_state_dict(torch.load(path, map_location='cpu'))

    # push the model to GPU
    df['Words'] = df['Text'].str.split().str.len()
    # bdf=df
    # df.drop(['Page',"Left","Top","Height","Width"],axis=1,inplace=True)
    # Load the BERT tokenizer
    tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')
    xdf=df[list(df.columns)]
    xdf['Text']=df['Text'].astype(str)
    # tokenize and encode sequences in the training set
    tokens_train = tokenizer.batch_encode_plus(
        xdf['Text'].tolist(),
        max_length = 55,
        padding=True,
        truncation=True
    )

    train_seq = torch.tensor(tokens_train['input_ids'])
    train_mask = torch.tensor(tokens_train['attention_mask'])

    # #define a batch size
    # batch_size = 32

    # # wrap tensors
    # train_data = TensorDataset(train_seq, train_mask)
    # # sampler for sampling the data during training
    # train_sampler = RandomSampler(train_data)

    # # dataLoader for train set
    # train_dataloader = DataLoader(train_data, sampler=train_sampler, batch_size=batch_size)



    # get predictions for test data'
    conf=None
    with torch.no_grad():
        preds = model(train_seq.to(device), train_mask.to(device))
        conf, classes = torch.max(preds, 1)
        preds = preds.detach().cpu().numpy()

    preds = np.argmax(preds, axis = 1)
    df['Preds']=preds
    df['Confidence']=conf
    # df=df[['Text',"Preds"]]
    df['Preds'].replace({0: "answer", 1: "key",2:"other"},inplace=True)
    print(df.columns)
    return df

def kvLinker(df):
    xl,yl=[],[]

    for x,row in df.iterrows():
        am=find_X_Center(row)
        if type(am) != str:
            xl.append(float(row['Left'])+am)
        else:
            xl.append(am)

    for x,row in df.iterrows():
        am=find_Y_Center(row)
        if type(am) != str:
            yl.append(float(row['Top'])+am)
        else:
            yl.append(am)

    df['x_Center']=xl
    df['y_Center']=yl
    # df=df[df['Page']==0]
    df=df[df['x_Center']!='Remove' ]
    df=df[ df['y_Center']!='Remove' ]

    ans=df[df['Preds']=='answer']
    qs=df[df['Preds']=='key']
    temp={
        "Value": "",
        "Confidence":0.0,
        "Field_location_Left": 0.0,
        "Field_location_Top": 0.0,
        "Field_location_Height": 0.0,
        "Field_location_Width": 0.0,
        "Value_Location_Left": 0.0,
        "Value_Location_Top": 0.0,
        "Value_Location_Height": 0.0,
        "Value_Location_Width": 0.0
    }
    kvs={k['Text']:list() for i,k in qs.iterrows()}
    kvConf={k['Text']:list() for i,k in qs.iterrows()}

    for n,a in ans.iterrows():
        ques=qs[qs['Left']<=a["Left"]]
        ques=ques[ques['y_Center']<float(a["Top"]+a['Height'])]
        if len(ques)==0:
            ques=qs[qs['Left']<=float(a["Left"]+a['Height'])]
            ques=ques[ques['y_Center']<float(a["Top"]+a['Height'])]
            if len(ques)==0:
                ques=qs[qs['Left']<=a["Left"]]
        ques['Dist']=[fdist(a,q) for i,q in ques.iterrows()]
        cand=ques[ques.Dist == ques.Dist.min()].to_dict('records')
        # cand=ques[ques.Dist == ques.Dist.min()]['Text'].tolist()
        if len(cand)!=0:
            var=cand[0]
            kvs['{}'.format(var.get('Text'))].append(a['Text'])
            kvConf['{}'.format(var['Text'])]=var["Confidence"]
            # # kvs['{}'.format(var['Text'])]
            # kvs['{}'.format(var['Text'])]["Value"]=kvs['{}'.format(var['Text'])]["Value"]+ " " +a["Text"]
            # kvs['{}'.format(var['Text'])]["Confidence"]=var["Confidence"]
            # kvs['{}'.format(var['Text'])]["Field_location_Left"]= var['Left']
            # kvs['{}'.format(var['Text'])]["Field_location_Top"]= var["Top"]
            # kvs['{}'.format(var['Text'])]["Field_location_Height"]= var["Height"]
            # kvs['{}'.format(var['Text'])]["Field_location_Width"]= var['Width']
            # if kvs['{}'.format(var['Text'])]["Value_Location_Left"]==0:
            #     kvs['{}'.format(var['Text'])]["Value_Location_Left"]= a['Left']
            # else:
            #     kvs['{}'.format(var['Text'])]["Value_Location_Left"]=kvs['{}'.format(var['Text'])]["Value_Location_Left"]+ a['Left']
            # if kvs['{}'.format(var['Text'])]["Value_Location_Left"]==0:
            #     kvs['{}'.format(var['Text'])]["Value_Location_Top"]= a["Top"]
            # else:
            #     kvs['{}'.format(var['Text'])]["Value_Location_Top"]=kvs['{}'.format(var['Text'])]["Value_Location_Top"]+ a["Top"]
            # # kvs['{}'.format(var['Text'])]["Value_Location_Left"]=kvs['{}'.format(var['Text'])]["Value_Location_Left"]+ a['Left']
            # # kvs['{}'.format(var['Text'])]["Value_Location_Top"]=kvs['{}'.format(var['Text'])]["Value_Location_Top"]+ a["Top"]
            # kvs['{}'.format(var['Text'])]["Value_Location_Height"]=kvs['{}'.format(var['Text'])]["Value_Location_Height"]+ a["Height"]
            # kvs['{}'.format(var['Text'])]["Value_Location_Width"]=kvs['{}'.format(var['Text'])]["Value_Location_Width"]+ a['Width']
    return kvs,kvConf