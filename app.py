from flask import Flask, request, jsonify, render_template
from langchain_aws import BedrockLLM
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set AWS profile and initialize Bedrock
os.environ["AWS_PROFILE"] = "bokchoy"

try:
    llm = BedrockLLM(
        model_id="amazon.titan-text-express-v1",
        region_name="us-west-2"
    )
    bedrock_available = True
except Exception as e:
    print(f"Bedrock not available: {e}")
    llm = None
    bedrock_available = False



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Create prompt for fraud analysis
    prompt = f"""Analyze this text for fraud indicators:

Text: {text}

Provide:
1. Risk Level (Low/Medium/High)
2. Warning Signs found
3. Simple explanation for beginners

Response:"""
    
    if bedrock_available and llm:
        try:
            response = llm.invoke(prompt)
        except Exception as e:
            response = "Risk Level: MEDIUM\nWarning Signs: AI analysis failed\nExplanation: Please check text manually for urgency tactics and suspicious requests."
    else:
        # Simple rule-based analysis
        text_lower = text.lower()
        high_risk = ['urgent', 'click here', 'verify now', 'suspended', 'expire']
        if any(word in text_lower for word in high_risk):
            response = "Risk Level: HIGH\nWarning Signs: Urgency tactics detected\nExplanation: Fraudsters use pressure tactics to make you act quickly without thinking."
        else:
            response = "Risk Level: LOW\nWarning Signs: No obvious fraud indicators\nExplanation: Text appears normal, but always verify requests through official channels."
    
    # Could store analysis locally if needed
    
    return jsonify({'analysis': response})

@app.route('/examples')
def get_examples():
    # Sample fraud examples for learning
    examples = [
        {
            'type': 'phishing_email',
            'text': 'URGENT: Your account will be suspended! Click here immediately to verify your information.',
            'is_fraud': True
        },
        {
            'type': 'fake_news',
            'text': 'Scientists discover miracle cure that doctors don\'t want you to know about!',
            'is_fraud': True
        },
        {
            'type': 'legitimate',
            'text': 'Your monthly statement is now available. Log in to your account to view it.',
            'is_fraud': False
        }
    ]
    return jsonify(examples)

if __name__ == '__main__':
    app.run(debug=True)