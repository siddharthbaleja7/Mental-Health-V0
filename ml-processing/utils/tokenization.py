from transformers import AutoTokenizer

def get_tokenizer(model_name="distilbert-base-uncased"):
    return AutoTokenizer.from_pretrained(model_name)

def batch_tokenize(texts, tokenizer, max_length=128):
    return tokenizer(
        texts, padding="max_length", truncation=True, max_length=max_length, return_tensors="pt"
    )
