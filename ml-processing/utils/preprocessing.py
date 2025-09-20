import pandas as pd

def clean_text(text):
    # Lowercase, remove URLs and unwanted chars
    import re
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|@[\w]+|#\w+', '', text)
    text = re.sub(r'[^a-z\s.,!?]', '', text)
    return ' '.join(text.split())

def read_and_preprocess(filepath):
    df = pd.read_csv(filepath)
    df['clean_text'] = df['clean_text'].apply(clean_text)
    # Optionally map labels (0/1)
    df['label'] = df['is_depression'].astype(int)
    return df[['clean_text', 'label']]
 