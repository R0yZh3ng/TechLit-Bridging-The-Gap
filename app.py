from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from langchain_aws import BedrockLLM
import os
from dotenv import load_dotenv
import re
from models import db, User, AnalysisHistory

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scamsense.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Create tables
try:
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
except Exception as e:
    print(f"❌ Database initialization failed: {e}")

# Load config from .env or defaults
MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "meta.llama3-8b-instruct-v1:0")
REGION = os.getenv("AWS_REGION", "us-west-2")

# Initialize Bedrock with default credentials
try:
    import boto3
    session = boto3.Session()
    
    bedrock_client = session.client('bedrock-runtime', region_name=REGION)
    
    llm = BedrockLLM(
        model_id=MODEL_ID,
        region_name=REGION,
        client=bedrock_client
    )
    bedrock_available = True
    print(f"✅ Bedrock initialized successfully with {MODEL_ID} in {REGION}")
except Exception as e:
    print(f"❌ Bedrock initialization failed: {e}")
    llm = None
    bedrock_available = False
    print("⚠️ Falling back to rule-based analysis")


@app.route('/')
def health_check():
    return jsonify({'status': 'Backend is running', 'port': 8000})

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print(f"Register request: {data}")
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        print(f"User registered successfully: {email}")
        return jsonify({'access_token': access_token, 'user': user.to_dict()})
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        print(f"Login request: {data}")
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=email).first()
        print(f"User found: {user is not None}")
        
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            print(f"Login successful: {email}")
            return jsonify({'access_token': access_token, 'user': user.to_dict()})
        
        print(f"Login failed for: {email}")
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_text():
    user_id = get_jwt_identity()
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

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
            if hasattr(response, 'content'):
                response = response.content
            elif isinstance(response, dict) and 'content' in response:
                response = response['content']
        except Exception as e:
            response = rule_based_analysis(text)
    else:
        response = rule_based_analysis(text)

    # Save analysis to history
    analysis_record = AnalysisHistory(
        user_id=user_id,
        text=text,
        result=response
    )
    db.session.add(analysis_record)
    db.session.commit()
    
    return jsonify({'analysis': response})

@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    analyses = AnalysisHistory.query.filter_by(user_id=user_id).order_by(AnalysisHistory.created_at.desc()).limit(20).all()
    return jsonify([analysis.to_dict() for analysis in analyses])


def rule_based_analysis(text: str) -> str:
    text_lower = text.lower()

    high_risk = ['urgent', 'click here', 'verify now', 'suspended', 'expire', 'act now', 'limited time', 'winner', 'congratulations']
    investment_scam = ['give me', 'send me', 'i give you', 'double your money', 'guaranteed return', 'easy money', 'quick profit']
    medium_risk = ['free', 'guarantee', 'no risk', 'exclusive', 'special offer']

    money_pattern = re.search(r'\$?\d+.*(?:dollar|money|cash|profit|return)', text_lower)
    give_pattern = re.search(r'(?:give|send).*\$?\d+', text_lower)

    high_count = sum(1 for word in high_risk if word in text_lower)
    investment_count = sum(1 for word in investment_scam if word in text_lower)
    medium_count = sum(1 for word in medium_risk if word in text_lower)

    if investment_count >= 1 or give_pattern or money_pattern:
        return "Risk Level: HIGH\nWarning Signs: Investment/money scam pattern detected\nExplanation: This appears to be a financial scam. Never send money to strangers promising returns. Legitimate investments don't work this way."
    elif high_count >= 2:
        return "Risk Level: HIGH\nWarning Signs: Multiple urgency tactics detected\nExplanation: This text uses several fraud indicators like urgency and pressure tactics."
    elif high_count >= 1:
        return "Risk Level: HIGH\nWarning Signs: Urgency tactics detected\nExplanation: Fraudsters use pressure tactics to make you act quickly without thinking."
    elif medium_count >= 2:
        return "Risk Level: MEDIUM\nWarning Signs: Suspicious promotional language\nExplanation: Be cautious of offers that seem too good to be true."
    elif medium_count >= 1:
        return "Risk Level: MEDIUM\nWarning Signs: Promotional language detected\nExplanation: Be cautious of unsolicited offers and verify sources."
    else:
        return "Risk Level: LOW\nWarning Signs: No obvious fraud indicators\nExplanation: Text appears normal, but always verify requests for personal information through official channels."


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
    print("Starting Flask server...")
    app.run(debug=True, port=8000, host='0.0.0.0')