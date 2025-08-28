from flask import Flask, request, jsonify, render_template
from langchain_aws import BedrockLLM
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Load config from environment variables
MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "meta.llama3-8b-instruct-v1:0")
REGION = os.getenv("AWS_REGION", "us-west-2")

# Initialize Bedrock
llm = None
bedrock_available = False

try:
    # Check if AWS credentials are set in environment
    if not (os.getenv('AWS_ACCESS_KEY_ID') and os.getenv('AWS_SECRET_ACCESS_KEY')):
        print("⚠️ AWS credentials not found in environment variables")
        print("   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")
    else:
        # Create boto3 session with explicit environment credentials
        import boto3
        session = boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=REGION
        )
        
        # Initialize Bedrock client
        bedrock_client = session.client('bedrock-runtime', region_name=REGION)
        
        llm = BedrockLLM(
            model_id=MODEL_ID,
            region_name=REGION,
            client=bedrock_client
        )
        bedrock_available = True
        print(f"✅ Bedrock initialized successfully with {MODEL_ID} in {REGION}")
        print(f"   Using AWS credentials from environment variables")
        
except Exception as e:
    print(f"❌ Bedrock initialization failed: {e}")

# Route handlers
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    if not bedrock_available or not llm:
        return jsonify({'error': 'Bedrock service not available. Please check AWS credentials.'}), 503

    prompt = f"""Analyze this text for fraud indicators:

Text: {text}

Provide:
1. Risk Level (Low/Medium/High)
2. Warning Signs found
3. Simple explanation for beginners

Response:"""

    try:
        print("➡️ Sending prompt to Bedrock...")
        response = llm.invoke(prompt)
        print("✅ Bedrock response received")

        if hasattr(response, 'content'):
            response = response.content
        elif isinstance(response, dict) and 'content' in response:
            response = response['content']

        return jsonify({'analysis': response})

    except Exception as e:
        print(f"❌ Bedrock error: {e}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/examples')
def get_examples():
    examples = [
        {
            'type': 'phishing_email',
            'text': 'URGENT: Your account will be suspended! Click here immediately to verify your information.',
            'is_fraud': True
        },
        {
            'type': 'fake_news',
            'text': "Scientists discover miracle cure that doctors don't want you to know about!",
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
