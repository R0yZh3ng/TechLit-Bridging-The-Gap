from flask import Flask, request, jsonify, render_template
from langchain_aws import BedrockLLM
import os
from dotenv import load_dotenv
import speech_recognition as sr
import re

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
libraries
    print(f"Bedrock not available: {e}")
    llm = None
    bedrock_available = False


    print(f"❌ Bedrock initialization failed: {e}")

# Route handlers
main
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
libraries
def analyze():
    """
    Unified endpoint that handles both text and audio analysis with message type and sender info
    """
    try:
        # Check if this is an audio file upload
        if 'audio_file' in request.files:
            audio_file = request.files['audio_file']
            
            if audio_file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            allowed_extensions = {'wav', 'mp3', 'flac', 'aiff'}
            if not audio_file.filename.lower().endswith(tuple('.' + ext for ext in allowed_extensions)):
                return jsonify({'error': 'Please upload a WAV, MP3, FLAC, or AIFF file.'}), 400
            
            # Convert audio to text
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_file) as source:
                audio = recognizer.record(source)
                text = recognizer.recognize_google(audio)
        else:
            # Handle text input
            data = request.json
            text = data.get('text', '')
            
            if not text:
                return jsonify({'error': 'No text provided'}), 400
        
        # Get additional context from request
        if 'audio_file' in request.files:
            # For file uploads, get data from form
            message_type = request.form.get('message_type', 'unknown')
            sender_info = request.form.get('sender_info', '')
        else:
            # For JSON requests, get data from JSON
            message_type = data.get('message_type', 'unknown')
            sender_info = data.get('sender_info', '')
        
        # Analyze the text and sender for fraud (enhanced logic)
        prompt = f"""Analyze this {message_type} message for fraud indicators:

def analyze_text():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    if not bedrock_available or not llm:
        return jsonify({'error': 'Bedrock service not available. Please check AWS credentials.'}), 503

    prompt = f"""Analyze this text for fraud indicators:
main

Message Type: {message_type}
Sender: {sender_info}
Content: {text}

Provide:
1. Risk Level (Low/Medium/High)
2. Warning Signs found
3. Sender Analysis (suspicious patterns in sender info)
4. Simple explanation for beginners

Response:"""
libraries
        
        if bedrock_available and llm:
            try:
                analysis = llm.invoke(prompt)
            except Exception as e:
                analysis = analyze_sender_and_content_rule_based(text, message_type, sender_info)
        else:
            analysis = analyze_sender_and_content_rule_based(text, message_type, sender_info)
        
        # Return appropriate response based on input type
        if 'audio_file' in request.files:
            return jsonify({
                'transcribed_text': text,
                'analysis': analysis,
                'message_type': message_type,
                'sender_info': sender_info
            })
        else:
            return jsonify({
                'analysis': analysis,
                'message_type': message_type,
                'sender_info': sender_info
            })
            
    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand the audio. Please try again with clearer speech.'}), 400
    except sr.RequestError:
        return jsonify({'error': 'Speech recognition service unavailable. Please try again later.'}), 500
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

def analyze_sender_and_content_rule_based(text, message_type, sender_info):
    """
    Enhanced rule-based analysis that considers both content and sender information
    """
    text_lower = text.lower()
    sender_lower = sender_info.lower()
    
    # Content-based fraud indicators
    high_risk_words = ['urgent', 'click here', 'verify now', 'suspended', 'expire', 'account locked', 'verify account']
    medium_risk_words = ['limited time', 'act now', 'exclusive offer', 'free money', 'lottery', 'inheritance']
    
    # Sender-based fraud indicators
    suspicious_sender_patterns = [
        r'[0-9]{10,}',  # Long numbers (like 1234567890123)
        r'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}',  # Email addresses
        r'\+[0-9]{10,}',  # International phone numbers
        r'[a-z]+[0-9]+@',  # Alphanumeric emails
        r'[0-9]+@',  # Number-based emails
        r'no-reply@',  # No-reply emails
        r'noreply@',  # No-reply emails
        r'support@',  # Generic support emails
        r'security@',  # Generic security emails
        r'bank@',  # Generic bank emails
        r'paypal@',  # Generic PayPal emails
        r'amazon@',  # Generic Amazon emails
        r'apple@',  # Generic Apple emails
        r'google@',  # Generic Google emails
        r'microsoft@',  # Generic Microsoft emails
    ]
    
    # Check content risk
    content_risk = 'LOW'
    warning_signs = []
    
    if any(word in text_lower for word in high_risk_words):
        content_risk = 'HIGH'
        warning_signs.append('High-risk urgency tactics detected')
    elif any(word in text_lower for word in medium_risk_words):
        content_risk = 'MEDIUM'
        warning_signs.append('Medium-risk pressure tactics detected')
    
    # Check sender risk
    sender_risk = 'LOW'
    sender_warnings = []
    
    if sender_info:
        # Check for suspicious patterns
        for pattern in suspicious_sender_patterns:
            if re.search(pattern, sender_lower):
                sender_risk = 'MEDIUM'
                sender_warnings.append(f'Suspicious sender pattern: {pattern}')
                break
        
        # Check for generic/impersonal senders
        generic_senders = ['no-reply', 'noreply', 'support', 'security', 'info', 'admin', 'service']
        if any(generic in sender_lower for generic in generic_senders):
            sender_risk = 'MEDIUM'
            sender_warnings.append('Generic/impersonal sender address')
        
        # Check for random-looking addresses
        if len(sender_info) > 20 and re.search(r'[0-9]{5,}', sender_info):
            sender_risk = 'HIGH'
            sender_warnings.append('Random-looking sender address with many numbers')
    
    # Determine overall risk
    if content_risk == 'HIGH' or sender_risk == 'HIGH':
        overall_risk = 'HIGH'
    elif content_risk == 'MEDIUM' or sender_risk == 'MEDIUM':
        overall_risk = 'MEDIUM'
    else:
        overall_risk = 'LOW'
    
    # Build analysis response
    analysis = f"""Risk Level: {overall_risk}

Content Analysis:
- Content Risk: {content_risk}
- Warning Signs: {', '.join(warning_signs) if warning_signs else 'No obvious content fraud indicators'}

Sender Analysis:
- Sender Risk: {sender_risk}
- Sender: {sender_info if sender_info else 'No sender information provided'}
- Sender Warnings: {', '.join(sender_warnings) if sender_warnings else 'No obvious sender fraud indicators'}

Message Type: {message_type}

Explanation: """
    
    if overall_risk == 'HIGH':
        analysis += "This message shows multiple high-risk indicators. Be extremely cautious and verify through official channels before taking any action."
    elif overall_risk == 'MEDIUM':
        analysis += "This message shows some concerning patterns. Verify the sender and content through official channels before responding."
    else:
        analysis += "This message appears normal, but always verify requests through official channels and never share personal information."
    
    return analysis


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
main

@app.route('/examples')
def get_examples():
    examples = [
        {
            'type': 'phishing_email',
            'text': 'URGENT: Your account will be suspended! Click here immediately to verify your information.',
            'sender': 'security@bank-verify.com',
            'message_type': 'email',
            'is_fraud': True
        },
        {
            'type': 'fake_news',
libraries
            'text': 'Scientists discover miracle cure that doctors don\'t want you to know about!',
            'sender': 'news@health-miracle.com',
            'message_type': 'email',

            'text': "Scientists discover miracle cure that doctors don't want you to know about!",
main
            'is_fraud': True
        },
        {
            'type': 'legitimate',
            'text': 'Your monthly statement is now available. Log in to your account to view it.',
            'sender': 'statements@yourbank.com',
            'message_type': 'email',
            'is_fraud': False
        },
        {
            'type': 'suspicious_call',
            'text': 'This is the IRS calling. You owe back taxes and must pay immediately or face arrest.',
            'sender': '+1-555-123-4567',
            'message_type': 'call',
            'is_fraud': True
        }
    ]
    return jsonify(examples)

if __name__ == '__main__':
    app.run(debug=True)
