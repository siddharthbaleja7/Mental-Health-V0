import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class BertDepressionClassifier:
    def __init__(self, model_dir):
        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_dir, low_cpu_mem_usage=True, torch_dtype=torch.float16)

    def predict(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)
            # probs will be an array like [prob_not_depression, prob_depression]
            probs = torch.nn.functional.softmax(outputs.logits, dim=1).cpu().numpy()[0]
        
        # Get the probability of "Depression" (assuming it's class 1)
        depression_score = float(probs[1]) 
        
        return {
            "prediction": "Depression" if depression_score > 0.5 else "Not Depression", 
            "score": depression_score  # <-- We now return the raw score
        }
# Usage:
# classifier = BertDepressionClassifier("depression_distilbert_model")
# result = classifier.predict("I feel so empty and worthless all the time, nothing brings me joy anymore.")
