import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class BertDepressionClassifier:
    def __init__(self, model_dir):
        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_dir)

    def predict(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1).cpu().numpy()[0]
        pred_class = int(probs.argmax())
        confidence = float(probs[pred_class])
        return {"prediction": "Depression" if pred_class == 1 else "Not Depression", "confidence": confidence}

# Usage:
# classifier = BertDepressionClassifier("depression_distilbert_model")
# result = classifier.predict("I feel so empty and worthless all the time, nothing brings me joy anymore.")
