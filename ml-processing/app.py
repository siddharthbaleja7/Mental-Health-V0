from flask import Flask, request, jsonify
from flask_cors import CORS
from models.bert_depression_classifier import BertDepressionClassifier
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize the model
model_dir = os.path.join(os.path.dirname(__file__), 'depression_distilbert_model')
classifier = None

def load_model():
    global classifier
    try:
        if os.path.exists(model_dir):
            logger.info(f"Loading model from local directory: {model_dir}")
            classifier = BertDepressionClassifier(model_dir)
        else:
            logger.info("Local model not found. Loading base model from Hugging Face Hub...")
            # You can replace 'distilbert-base-uncased' with your own Hugging Face model ID if you upload it
            # e.g., 'your-username/your-model-name'
            classifier = BertDepressionClassifier('distilbert-base-uncased') 
            
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": classifier is not None})

@app.route('/analyze', methods=['POST'])
def analyze():
    if classifier is None:
        return jsonify({"error": "Model not loaded"}), 503
        
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        logger.info(f"Analyzing text: {text[:100]}...")
        result = classifier.predict(text)
        logger.info(f"Analysis result: {result}")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Load model immediately when this file is imported (by Gunicorn)
try:
    load_model()
except Exception as e:
    logger.warning(f"Initial model load failed (this is expected during build): {e}")

if __name__ == '__main__':
    try:
        # load_model() is already called above
        app.run(host='0.0.0.0', port=8080)
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        exit(1)