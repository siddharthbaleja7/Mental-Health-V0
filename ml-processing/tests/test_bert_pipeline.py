from models.bert_depression_classifier import BertDepressionClassifier

def test_predict():
    clf = BertDepressionClassifier("depression_distilbert_model")
    sample_text = "I feel hopeless and empty."
    result = clf.predict(sample_text)
    assert result["prediction"] in ["Depression", "Not Depression"]
    assert 0.0 <= result["confidence"] <= 1.0
