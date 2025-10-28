from joblib import dump,load
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier



csv=pd.read_csv("StonAI-Smart-Extraction/newHeadingsDataset.csv",header=0)
dado=csv

dado['TextCount']=[len(x["Text"].split()) for a,x in dado.iterrows()]

dado['IsCapital']=[1 if x["Text"].isupper() else 0 for a,x in dado.iterrows()]
xado=dado[[ "Left","Top","Size" ,  "Is_Bullet", "IsCapital" ,  "TextCount"]]
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(dado["Text"].values)
features=pd.DataFrame(X.toarray(),columns=vectorizer.get_feature_names())

xado.reset_index(drop=False, inplace=True)
features.reset_index(drop=False, inplace=True)

x=pd.concat([xado,features ],axis=1)
clf = RandomForestClassifier()
y=dado["Heading"].astype(int)
clf=clf.fit(x,y)
dump(clf,"/home/ubuntu/NewModel.joblib")
dump(vectorizer,"/home/ubuntu/NewVectorizer.pkl")
print(clf.predict(x))
vectorizer=load("/home/ubuntu/NewVectorizer.pkl")
clf=load("/home/ubuntu/NewModel.joblib")
print(clf.predict(x))