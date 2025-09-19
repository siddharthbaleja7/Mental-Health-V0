from datasets import Dataset, load_dataset,ClassLabel
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    Trainer, TrainingArguments
)
from utils.preprocessing import read_and_preprocess
from utils.tokenization import get_tokenizer


def load_and_prepare_data():
    ds = load_dataset("ShreyaR/DepressionDetection")
    
    # Cast the label column to ClassLabel type to allow stratified split
    ds = ds.cast_column("is_depression", ClassLabel(num_classes=2))
    
    train_test = ds["train"].train_test_split(test_size=0.2, stratify_by_column="is_depression")
    
    def preprocess(example):
        import re
        text = example["clean_text"].lower()
        text = re.sub(r"http\S+|www\S+|@\w+|#\w+", "", text)
        text = re.sub(r"[^a-z\s.,!?]", "", text)
        example["clean_text"] = " ".join(text.split())
        return example
    
    processed_ds = train_test.map(preprocess)
    return processed_ds



def tokenize_examples(examples, tokenizer):
    return tokenizer(
        examples["clean_text"], padding="max_length", truncation=True, max_length=128
    )

def train_transformer(model_name="distilbert-base-uncased", output_dir="depression_distilbert_model"):
    train_test = load_and_prepare_data()
    tokenizer = get_tokenizer(model_name)
    tokenized = train_test.map(lambda x: tokenize_examples(x, tokenizer), batched=True)
    train_ds = tokenized["train"].remove_columns(["clean_text"])
    eval_ds = tokenized["test"].remove_columns(["clean_text"])

    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
    args = TrainingArguments(output_dir=output_dir, num_train_epochs=3, report_to="none")
    trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=eval_ds, tokenizer=tokenizer)

    trainer.train()
    trainer.save_model(output_dir)
    res = trainer.evaluate()
    print("Evaluation:", res)
