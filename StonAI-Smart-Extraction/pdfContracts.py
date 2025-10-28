from pprint import pprint
# from word2vec import get_all_embedding_w2v
from collections import Counter
from queue import Empty
import pdfminer
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from joblib import dump, load
from sklearn.ensemble import RandomForestClassifier
from pdfminer.pdfpage import PDFPage, PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.layout import LAParams
from pdfminer.converter import PDFPageAggregator
from pdfminer.pdfdocument import PDFDocument
import ray
import re
# from pathlib import Path
import requests,boto3

import traceback

import io
import time
import datetime
import pandas as pd
import multiprocessing as mp
from multiprocessing.pool import ThreadPool
import numpy as np
import math
import re
import pdfplumber
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument


TEXT_ELEMENTS = [
    pdfminer.layout.LTTextBox,
    pdfminer.layout.LTTextBoxHorizontal,
    pdfminer.layout.LTTextLine,
    pdfminer.layout.LTTextLineHorizontal
]
@ray.remote
def get_tables(a,page):
    tlist = list()
    # page = dl[a]
    try:
        for table in page.find_tables():
            if table:
                t = table.extract()
                if len(t) > 1:
                    colHeadings = t.pop(0)
                    jd = len(set.intersection(set(colHeadings), set(headText)))
                    if jd == len(set(colHeadings)) or jd == 0:
                        l, tp, rt, bt = table.bbox
                        tlist.append({'Page': a+1, "Columns": colHeadings, "Table": t, "BBox": {
                                     'Left': int(l), 'Top': int(tp), 'Right': int(rt), 'Bottom': int(bt)}})
    except Exception as ex:
        print(ex)
    if len(tlist) != 0:
        return tlist
    else:
        return None

def keep_visible_lines(obj):
    """
    If the object is a ``rect`` type, keep it only if the lines are visible.

    A visible line is the one having ``non_stroking_color`` as 0.
    """
    if obj['object_type'] == 'rect':
        # print("="*100)
        # print(obj['non_stroking_color'])
        # print(obj['non_stroking_color'][0] == 0)
        return obj['non_stroking_color'][0] == 0
    return True


def borderTableRower(cols,table):
    cis=list()
    for n,i in enumerate(cols):
        if i is None:
            cis.append(n)
    repo=cis
    jango=False
    tableRes=table
    jrows=list()
    jrows.append(cols)
    for p,row in enumerate(table):
        for n,col in enumerate(row):
            if len(cis)==0:
                jango=True
                break
            if n in repo and col is not None:
                cis.pop(cis.index(n))
        if jango:
            break
        jrows.append(tableRes.pop(p))
    del cis
    prev=None
    nRows=list()
    for row in jrows:
        axe=list()
        for n in row:
            if n is None and prev is None:
                axe.append(" ")
                continue
            elif n is None and prev is not None:
                axe.append(prev)
            elif n is not None:
                prev = n
                continue
        nRows.append(axe)
    prev=None
    for row in jrows:
        if prev is None:
            prev=row
            continue
        else:
            for n,(x,y) in enumerate(zip(prev,row)):
                if x is None:
                    x=" "
                if y is None:
                    y=" "
                prev[n]=x+" "+y
    return prev,tableRes


def get_border_tables(file):
    global maxPageSize
    pdf = pdfplumber.open(file)
    page_1 = pdf.pages[0]
    dax=dict()
    maxPageSize = (page_1.height)
    print(time.time()-start)
    global dl
    ts = {
            "vertical_strategy": "lines",
            "horizontal_strategy": "lines",
        }
    tbList=list()
    for a,page in enumerate(pdf.pages):
        wd=page.width
        ht=page.height
        dax["{}".format(a)]={"Width":wd,"Height":ht}
        page=page.filter(keep_visible_lines)
        colsList=list()
        for tables in page.find_tables(table_settings=ts):
            if type(tables)!=list:
                tables=[tables]
            for table in tables:
                if table:
                    t =table.extract()#_table(table_settings=ts)
                    # t=table
                    if len(t) > 1:
                        colHeadings = t.pop(0)
                        jd = len(set.intersection(set(colHeadings), set(headText)))
                        if jd == len(set(colHeadings)) or jd == 0:
                            l, tp, rt, bt = table.bbox
                            colHeadings,t=borderTableRower(colHeadings,t)
                            tbList.append({'Page': a+1, "Columns": colHeadings, "Table": t, "BBox": {
                                            'Left': int(l), 'Top': int(tp), 'Right': int(rt), 'Bottom': int(bt)}})

    print(time.time()-start)
    return dax,tbList


def get_toc(fp):
    # # Open a PDF document.
    # fp = open(file, 'rb')
    parser = PDFParser(fp)

    document = PDFDocument(parser)
    toc = list()
    # Get the outlines of the document.
    try:
        outlines = document.get_outlines()
        for (level, title, dest, a, se) in outlines:
            if level <= 2:
                toks = title.split()
                # if re.match(r"[.\d]+",toks[0]):
                if len(toks) < 10:
                    # if not re.match(r"\([a-z]\)",toks[0]):
                    toc.append((level, title))
    except Exception as ex:
        print(ex)
    print(time.time()-start)
    if len(toc) == 0:
        toc = None
    return toc


def get_intersection(value, jinker):
    minx = value['Left']
    dy = value['Top']
    maxx = value['Left']+value['Width']
    retDict = dict()
    for ax, a in iter(jinker.items()):
        x, y, w, h = a
        x2 = x+w
        if y > dy:
            if minx < x and maxx > x and maxx <= x2:
                retDict[ax] = True
            elif maxx < x and minx >= x and minx <= x2:
                retDict[ax] = True
            elif minx >= x and minx <= x2 and maxx >= x and maxx <= x2:
                retDict[ax] = True
            elif minx < x and maxx > x2:
                retDict[ax] = True
            else:
                retDict[ax] = False
    count = 0
    for key, values in retDict.items():
        if values == True:
            count += 1
    if count == 1:
        return retDict
    else:
        return None


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
        if x["Is_Bullet"].tolist()[0] == 2:
            return pd.DataFrame({"Width": x["Width"].sum(), "Is_Bullet": x["Is_Bullet"].iloc[0],
                                 "Page": x["Page"].iloc[0], "Left": x["Left"].iloc[0], "Top": x["Top"].min(), "Height": x["Height"].max(),
                                 "Text": ' '.join(x['Text'].tolist()), "Font": ' '.join(list(set(x['Font'].tolist()))), "Size": ' '.join(list(set((x['Size'].tolist())))),
                                 "Font Count": len(' '.join(list(set(x['Font'].tolist()))).split(' '))}, index=[0])
        else:
            return x
    else:
        return x



def lp(page):
    try:
        interpreter.process_page(page)
        return device.get_result()
    except Exception as ex:
        print(ex)


def extract_page_layouts(pdf_file):
    """
    Extracts LTPage objects from a pdf file.
    modified from: http://www.degeneratestate.org/posts/2016/Jun/15/extracting-tabular-data-from-pdfs/
    Tests show that using PDFQuery to extract the document is ~ 5 times faster than pdfminer.
    """
    global toc
    laparams = LAParams()

    # with open('{}'.format(file), mode='rb') as pdf_file:
    print("Open document ")
    toc = get_toc(pdf_file)
    # if not document.is_extractable:
    #     raise PDFTextExtractionNotAllowed
    rsrcmgr = PDFResourceManager()
    global device
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)
    global interpreter
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    layouts = []
    pages = PDFPage.get_pages(pdf_file, check_extractable=False)

    print(time.time()-start)
    layouts = [lp(page) for page in pages]
    print(time.time()-start)

    return layouts


def get_text_objects(page_layout):
    # do multi processing
    texts = []
    # seperate text and rectangle elements
    for elem in page_layout:
        if isinstance(elem, pdfminer.layout.LTTextBoxHorizontal) or isinstance(elem, pdfminer.layout.LTTextBox):
            texts.extend(elem)
        elif isinstance(elem, pdfminer.layout.LTTextLine) or isinstance(elem, pdfminer.layout.LTTextLineHorizontal):
            texts.append(elem)
    return texts


def get_data(element):
    pgno, element = element
    text = element.get_text()
    if not text.isspace():
        (x0, y0, x1, y1) = element.bbox
        w = x1-x0
        h = y1-y0
        deto = list(element)
        font = list()
        size = list()
        for deto in list(element):
            if isinstance(deto, pdfminer.layout.LTChar):
                font.append(deto.fontname)
                size.append(str(round(deto.size, 2)))
        font = list(set(font))
        size = list(set(size))
        return pd.DataFrame({"Width": int(float(w)), "Page": pgno, "Left": int(float(x0)), "Top": int(float(y1)), "Height": int(float(h)),
                             "Text": text, "Font": ' '.join(font), "Size": ' '.join(size), "Font Count": len(font)}, index=[0])


def get_text_data(objs, pgno):
    objs = [(pgno, obj) for obj in objs]
    p1 = ThreadPool(mp.cpu_count())
    dfs = p1.map(get_data, objs)
    p1.close()
    try:
        return pd.concat(dfs)
    except Exception as ex:
        print(ex)
        return None


def get_table_rects(lst):
    if lst is not None:
        jk = list()
        if len(lst) > 1:
            ele = lst.pop(0)
            for i in lst:
                if not is_intersect(i['BBox'], ele['BBox']):
                    jk.append(i)

            jk.extend(get_table_rects(lst))
            return jk
        else:
            jk.extend(lst)
            return jk


def is_intersect(r1, r2):
    if r1['Left'] >= r2['Left'] and r1['Right'] <= r2['Right'] and r1['Top'] <= r2['Top'] and r1['Bottom'] >= r2['Bottom']:
        return False
    # # if r1['Left'] > r2['Right'] or r1['Right'] < r2['Left']:
    # #     return False
    # # if r1['Top'] > r2['Bottom'] or r1['Bottom'] < r2['Top']:
    # #     return False
    return True
    # if r2['Left'] < r1['Left'] < r2['Right'] and r2['Top'] < r1['Top'] < r2['Bottom']:
    #     return False
    # else:
    #     return True

@ray.remote(num_cpus=0.2)
def hMerger(dpgno, adf):
    adt = [x.sort_values(
        "Left", inplace=False) for a, x in adf.groupby(["Top"])]
    p2 = ThreadPool(mp.cpu_count())
    adf = pd.concat(p2.map(zero, adt))
    p2.close()
    return adf

def getRowState(row):
    # print(row.values())
    states=dict()
    for key,text in row.items():
        if type(text)==str:
            if len(text)>0:
                states[key]="Text"
                
        elif not math.isnan(text):
            states[key]="Text"
        elif math.isnan(text) :
            states[key]="No_Text"
    return states

def get_table_struct(tbdf):
    rows = list()
    for top, x in tbdf.groupby('Top'):
        row = dict()
        for jojo in x.to_dict('records'):
            row[jojo['column']] = jojo['Text']
        rows.append(row)
    
    return pd.DataFrame(rows)


@ray.remote(num_cpus=0.3)
def tb_detr(a, x, pgNo, ylvl):
    tbDF = pd.DataFrame()
    cols_cords = dict()
    cols_dict = dict()
    for jojo in x.to_dict('records'):
        cols_cords[jojo['Text']] = (
            jojo['Left'], jojo['Top'], jojo['Width'], jojo['Height'])

        cols_dict[jojo['Text']] = list()
        for b, y in ylvl:
            if b != a:
                for dodo in y.to_dict('records'):
                    rDic = get_intersection(dodo, cols_cords)
                    if rDic:
                        for key, value in rDic.items():
                            if value == True:
                                dodo['column'] = key
                                dodo['Right'] = dodo['Left']+dodo['Width']
                                dodo['Bottom'] = dodo['Top']+dodo['Height']
                                tbDF = tbDF.append(
                                    pd.DataFrame(dodo, index=[0]))
                                dodo['DP'] = (dodo['Left'], dodo['Top'])

                                cols_dict[key].append(dodo)
    if set(['Left', 'Bottom', 'Right', 'Top']).issubset(tbDF.columns):
        dek = {'Left': tbDF['Left'].min(), 'Top': tbDF['Bottom'].max(
        ), 'Right': tbDF['Right'].max(), 'Bottom': tbDF['Top'].min()}
    else:
        dek = None

    rowId = list()
    tble = dict()
    jd = len(set.intersection(set(cols_dict.keys()), set(headText)))
    if bool(cols_dict) and dek is not None and len(cols_dict.keys()) > 2 and (jd == len(set(cols_dict.keys())) or jd == 0):
        for key in cols_dict:
            try:
                if len(cols_dict[key]) != 0:
                    df = pd.DataFrame(cols_dict[key])
                    df = df.drop_duplicates(subset='DP')
                    rowId.extend(df['DP'].values.tolist())
                    tble[key] = df[["Text", "DP"]].to_dict('records')
                else:
                    tble = None
                    break
            except Exception as ex:
                iop = 0
    else:
        tble = None
    rowId = list(set(rowId))

    if bool(tble):
        return {"BBox": dek, "Page": pgNo, "Table": get_table_struct(tbDF), "Columns": list(tble.keys())}
    else:
        return None

def rowMerger(rows):
    print("="*200)
    newRows=list()
    changeState=False
    sChange=False
    states="Empty"
    nrow=None
    for row in rows:
        if sChange:
            newRows.append(nrow)
            states = "Empty"
            nrow=None
            changeState=False
            sChange=False
            # continue
        if states == "Empty" and nrow is None:
            states=getRowState(row)
            nrow=row
            # continue
        elif states != "Empty":
            newState=getRowState(row)
            for key,state in newState.items():
                if states.get(key) != state:
                    if changeState == False:
                        changeState=True
                        states=newState
                        break
                    elif changeState:
                        sChange=True
                    break
            if sChange == False:
                for key in nrow.keys():
                    a=str(nrow.get(key))
                    b=str(row.get(key))
                    if a=="nan":
                        a=""
                    if b=="nan":
                        b=""
                    
                    nrow[key]=a+b

    # print(newRows)
    if len(newRows)>1:
        rows=newRows
    return rows

@ray.remote(num_cpus=0.3)
def blTD(pgNo, df):
    ylvl = df.groupby(["Top"])

    tablesList = ray.get([tb_detr.remote(a, x, pgNo, ylvl) for a, x in ylvl if len(x) > 2])

    tablesList = [x for x in tablesList if x is not None]

    if len(tablesList) > 0:
        tl = get_table_rects(tablesList)
        print(tl[0].get('Table').keys())
        print('PageNo:{}'.format(pgNo))
        t2=list()
        for t in tl:
            t["Table"]=t["Table"].to_dict("records")
        print(len(tl))
        return tl
    else:
        return None



def toc_lines(row):
    if re.match(r'/\d\.\s+|\([a-z]\)\s+|\(.*?\)|[a-z]\)\s+|\[\d+\]$|\([0-9].*?\)|\w[.)]\s*|\([a-z]\)\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g', row['Text']):
        return 1
    else:
        return 0


def parse_layouts(axe):
    global layouts
    pg_no = axe
    layout = layouts[axe]
    return get_text_data(get_text_objects(layout), pgno=pg_no+1)


def colFix(m):
    if m is None:
        return "_"
    elif m.isspace() :
        return "_"
    elif len(m)==0 or m.strip() == "" :
        return "_"
    elif m is None:
        return "_"
    elif len(m)!=0:
        return "{}".format(m).replace(".","  ")


def removeHF(final_df,doc_len):
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


def extract_from_pdf(request=None):
    es=Elasticsearch(hosts="http://15.207.181.20:9200",http_auth=("elastic","Zaytrics123"))
    try:
        bucket_name = request.query_params["BUCKET"]
        key_name = request.query_params["KEY"]
        s3 = boto3.resource('s3')
        buf=io.BytesIO()
        print("Getting Document from S3 Bucket")
        s3.Bucket(bucket_name).download_fileobj(key_name, buf)
        global toc
        global images
        interpreter = None
        device = None
        global max_page_width
        global maxPageSize
        global layouts, start, maxFontStyle, maxSize, headText
        if buf is not None:
            start = time.time()
            print(datetime.datetime.now())
            page_layouts = extract_page_layouts(buf)

            print("Number of pages: %d" % len(page_layouts))
            final_df = pd.DataFrame()
            adf = list()

            layouts = {pg_no: layout for pg_no, layout in enumerate(page_layouts)}
            print(time.time()-start)
            p1 = mp.Pool(mp.cpu_count())
            print('Starting multiprocessing')
            adf = p1.map(parse_layouts, layouts.keys())
            adf = [x for x in adf if x is not None]
            p1.close()
            final_df = pd.concat(adf)
            print(final_df.head(50))
            final_df.to_csv("extracted.csv",index=False)

            print(time.time()-start)
            final_df["Is_Bullet"] = [get_REMatch(x["Text"])
                                    for indx, x in final_df.iterrows()]
            dst = ray.get([hMerger.remote(a, x) for a, x in final_df.groupby(["Page"])])
            final_df = pd.concat(dst)
            print(time.time()-start)

            final_df = final_df.sort_values(
                ["Page", "Top", "Left"], ascending=[True, False, True])
            jo = final_df[final_df['Font'].str.contains('Bold')]

            jo['Size'] = jo.Size.str.split(' ').apply(lambda x: max(
                [int(float(i)) for i in x if i is not None])).values.tolist()
            jox = jo['Text'].values.tolist()
            final_df['Size'] = final_df.Size.str.split(' ').apply(lambda x: max(
                [int(float(i)) for i in x if i is not None])).values.tolist()
            final_df['Heading'] = final_df.Text.apply(
                lambda x: 1 if x in jox else 0)
            dado=final_df
            dado['TextCount']=[len(x["Text"].split()) for a,x in dado.iterrows()]

            dado['IsCapital']=[1 if x["Text"].isupper() else 0 for a,x in dado.iterrows()]
            jojo={"FULL":1,"None":0,"Partially":0.5,"NONE":0,"PARTIALLY":0.5}

            pae = load('/home/ubuntu/StonAI-Smart-Extraction/New_Vectorizer.pkl')
            print(len(pae.get_feature_names()))
            print(pae.get_feature_names())
            xado=dado[["Size" ,  "Is_Bullet", "IsCapital" ,  "TextCount"]]
            print(xado.columns)
            y=dado["Heading"].astype(int)
            fs=pd.DataFrame(pae.transform(dado['Text']).toarray(),columns=pae.get_feature_names())
            xado.reset_index(drop=False, inplace=True)
            fs.reset_index(drop=False, inplace=True)
            x=pd.concat([xado,fs ],axis=1)

            if "index" in x.columns:
                print("Found")
            try:
                x=x.drop('level_0',axis=1)
            except Exception as ex:
                print(1)
            try:
                x=x.drop("index",axis=1)
            except Exception as ex:
                print(2)
            dt = load('/home/ubuntu/StonAI-Smart-Extraction/New_Heading_Model.joblib')
            # dt = load("/home/ubuntu/NewModel.joblib")
            dado["Preds"]=dt.predict(x)
            dado['Probs']=[max(a) for a in dt.predict_proba(x)]
            final_df["SScore"]=dado['Preds'].tolist()

            maxSize = int(float(final_df['Size'].mode()[0]))
            print('Max Size: {}'.format(maxSize))
            fl = list()
            dd = [fl.extend(x.split()) for x in final_df['Font'].tolist()]
            headText=final_df[final_df['SScore']==1]['Text'].tolist()
            fl = Counter(fl)
            pprint(fl)
            maxFontStyle = fl.most_common(1)[0]
            pprint(maxFontStyle[0])
            print(time.time()-start)
            awe=ray.get([blTD.remote(pg, sdf) for pg, sdf in final_df.groupby(["Page"])])
            awe=[x for x in awe if x is not None]
            awe=[item for sublist in awe for item in sublist if sublist is not None]
            awe = list(filter(None, awe))
            for table in awe:
                table["Table"]=rowMerger(table["Table"][::-1])
            print(time.time()-start)
            pgs,bTables=get_border_tables(buf)
            print(pgs.keys())
            dmy=bTables
            bless_Table=list()
            # for (a, b) in itertools.product(awe, dmy):
            #     if a['Page']==b['Page']:
            #         if not is_intersect(a['BBox'], b['BBox']):
            #             bless_Table.append(a)
            print('len after:{}'.format(len(bless_Table)))
            data = final_df[final_df['SScore'] > 0]['Text'].values.tolist()
            data = Counter(data)
            dd = [k for k, c in data.items() if c < 5]
            data = final_df[final_df['Text'].isin(dd)]
            data = data[data['Heading'] > 0]

            final_df = final_df.sort_values(
                ["Page", "Top", "Left"], ascending=[True, False, True])
            try:
                final_df=removeHF(final_df,len(page_layouts))
            except Exception as ex:
                print(ex)
                traceback.print_exc()
            print(time.time()-start)
            pprint(final_df.columns)
            # pprint(final_df.head(20))
            data = final_df.to_dict("records")
# [["Text", "Page", "Is_Bullet", "SScore"]
#                             ]
            print(final_df.columns)
            hnText = list()
            node = {"Doc Name": request.query_params["KEY"], "Page": 0,
                    "Heading": None,"Raw_Texts":list() ,"Text": " ", "embedding": None}

            print("Segmenting")
            for x in data:
                if x['SScore'] > 0 and node["Heading"] is not None:
                    node["Text"] = re.split(r'\. \n', node["Text"])
                    hnText.append(node)
                    node = {"Doc Name": request.query_params["KEY"], "Page": 0,
                            "Heading": None,"Raw_Texts":list(), "Text": " "}
                if x['SScore'] > 0 and node["Heading"] is None:
                    node['Heading'] = x['Text']
                    node['Score'] = x['SScore']
                    node["Page"] = x["Page"]
                if x['SScore'] == 0:
                    node['Text'] = node['Text']+x['Text']
                    x["page_width"]=pgs["{}".format(x['Page']-1)]["Width"]
                    x["page_height"]=pgs["{}".format(x['Page']-1)]["Height"]
                    x['x1']=x['Left']
                    x['y1']=x['Top']
                    x['y2']=x['Top']+x['Height']
                    x['x2']=x['Left']+x['Width']
                    node['Raw_Texts'].append(x)
            hnText.append(node)
            print(len(hnText))
            print("Getting embeddings")
            print("Got embeddings")
            if len(hnText) == 0:
                print('-'*200)
                print('NO HEADINGS DETECTED')
                print('-'*200)
                data = final_df['Text'].values.tolist()
                data = " ".join([x for x in data])
                data = data.split('. \n|\. \n')
                data = [{"Doc Name": request.query_params["KEY"], "Heading": " ", 'Score': 0,
                        "Text": data}]
            else:
                data = hnText
            print(time.time()-start)
            pprint(final_df.head(50))
            texts=list()
            # print(type(hnText[0]),type(awe[0]),type(bTables[0]))
            for a in hnText:
                a.update(eval(request.query_params["DOC_INFO"]))
                texts.append(a)
            print("BordlerLess Tables")
            bLtables=list()
            for tn,table in enumerate(awe):
                a=table
                
                for rn,row in enumerate(table["Table"]):
                    # print(row)
                    if a.get("Table") is not None:
                        del a["Table"]
                    a["Columns"]=["{}".format(col) if col is not None else "_" for col in a["Columns"]]
                    for key,value in row.items():
                        a["{}".format(key).replace("."," ")]=str(value)
                    a["Row_No"]=rn
                    a["Table_No"]=tn
                    a["Doc_Name"]=request.query_params["KEY"]
                    a.update(eval(request.query_params["DOC_INFO"]))
                    print(a)
                    bLtables.append(a.copy())
                    print(bLtables)
            bts=list()

            print("Bordered Tables")
            for tn,table in enumerate(bTables):
                q=0
                w=0
                columns=list()
                for col in table["Columns"]:
                    columns.append("{}".format(col).replace(".","  "))
                    q+=1
                for rn,row in enumerate(table["Table"]):
                    a={"Page":table["Page"],"Columns":columns,"BBox":table["BBox"],"Row_No":rn,"Table_No":tn}
                    for m,x in zip(columns,row):
                        a["{}".format(m)]="{}".format(x)
                        a["Doc_Name"]=request.query_params["KEY"]
                    a.update(eval(request.query_params["DOC_INFO"]))
                    bts.append( a.copy())
            print(1)
            actions = [
                        {
                            "_index": "pdf_contracts_texts",
                            "_source": item
                        }
                        for item in texts
                        ]

            helpers.bulk(es, actions)
            print(2)
            actions = [
                        {
                            "_index": "pdf_contracts_borderless_tables",
                            "_source": item
                        }
                        for item in bLtables
                        ]

            helpers.bulk(es, actions)
            print(3)
            actions = [
                        {
                            "_index": "pdf_contracts_texts_bordered_tables",
                            "_source": item
                        }
                        for item in bts
                        ]

            helpers.bulk(es, actions)
            print(4)
            # actions = [
            #             {
            #                 "_index": "pdf_contracts_raw_data",
            #                 "_source": item
            #             }
            #             for item in [{"Text":texts,"BorderLess_Tables":[{"Borderless_Table_No":tn,"Borderless_Table":table} for tn,table in enumerate(bLtables)],"Bordered_Tables":[{"Bordered_Table_No":tn,"Bordered_Table":table} for tn,table in enumerate(bts)]}]
            #             ]

            # helpers.bulk(es, actions)


        else:
            print("No File")
    except Exception as ex:
        traceback.print_exc()
