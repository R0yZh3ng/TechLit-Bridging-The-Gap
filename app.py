from flask import Flask, request, jsonify, render_template, session, redirect, url_for
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
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-this')

# Static translations
TRANSLATIONS = {
    'es': {
        'home': 'Inicio',
        'learn': 'Aprender',
        'practice': 'Práctica',
        'about': 'Acerca de',
        'logout': 'Cerrar sesión',
        'fraud_detection_trainer': 'Entrenador de Detección de Fraude',
        'learn_to_identify': 'Aprende a identificar correos fraudulentos y artículos de noticias con análisis impulsado por IA',
        'text_analyzer': 'Analizador de Texto',
        'paste_suspicious': 'Pega texto sospechoso a continuación para análisis instantáneo de fraude:',
        'placeholder': 'Pega correo o texto de noticias aquí...',
        'analyze_button': 'Analizar por Fraude',
        'analyzing': 'Analizando...',
        'practice_examples': 'Ejemplos de Práctica'
    },
    'zh': {
        'home': '首页',
        'learn': '学习',
        'practice': '练习',
        'about': '关于',
        'logout': '登出',
        'fraud_detection_trainer': '欺诈检测训练器',
        'learn_to_identify': '学习使用AI分析识别欺诈邮件和新闻文章',
        'text_analyzer': '文本分析器',
        'paste_suspicious': '在下方粘贴可疑文本进行即时欺诈分析：',
        'placeholder': '在此粘贴邮件或新闻文本...',
        'analyze_button': '分析欺诈',
        'analyzing': '分析中...',
        'practice_examples': '练习示例'
    }
}

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scamsense.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire

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
    bedrock_list_client = session.client('bedrock', region_name=REGION)
    
    # Check available vision models
    try:
        models_response = bedrock_list_client.list_foundation_models()
        available_vision_models = []
        
        for model in models_response['modelSummaries']:
            input_modalities = model.get('inputModalities', [])
            provider = model.get('providerName', '')
            
            # Look for non-Anthropic vision models
            if 'IMAGE' in input_modalities and provider.lower() != 'anthropic':
                available_vision_models.append({
                    'id': model['modelId'],
                    'name': model['modelName'],
                    'provider': provider
                })
                print(f"✅ Found vision model: {model['modelName']} ({model['modelId']})")
        
        vision_available = len(available_vision_models) > 0
        if vision_available:
            print(f"✅ {len(available_vision_models)} non-Anthropic vision models available")
        else:
            print("⚠️ No non-Anthropic vision models found")
            
    except Exception as e:
        print(f"⚠️ Could not check vision models: {e}")
        available_vision_models = []
        vision_available = False
    
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
    vision_available = False
    print("⚠️ Falling back to rule-based analysis")

import re
import json
from datetime import datetime
import base64
from PIL import Image
import io

class ScamAnalyzer:
    def __init__(self):
        self.suspicious_patterns = {
            'urgency': ['urgent', 'immediately', 'now', 'expire', 'suspended', 'limited time'],
            'requests': ['verify', 'confirm', 'update', 'click here', 'call now'],
            'threats': ['account suspended', 'legal action', 'immediate action required'],
            'financial': ['bank account', 'credit card', 'social security', 'tax refund'],
            'suspicious_urls': ['bit.ly', 'tinyurl', 'goo.gl', 'shortened links']
        }
    
    def analyze_email(self, sender, subject, content):
        risk_score = 0
        warnings = []
        
        # Check sender
        if self._is_suspicious_sender(sender):
            risk_score += 30
            warnings.append("Suspicious sender address")
        
        # Check subject
        if self._has_urgent_subject(subject):
            risk_score += 25
            warnings.append("Urgent or threatening subject line")
        
        # Check content
        content_analysis = self._analyze_content(content)
        risk_score += content_analysis['score']
        warnings.extend(content_analysis['warnings'])
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'warnings': warnings,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(sender),
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_text(self, content, sender_number=None):
        risk_score = 0
        warnings = []
        
        # Check sender number
        if sender_number and self._is_suspicious_number(sender_number):
            risk_score += 20
            warnings.append("Suspicious phone number")
        
        # Check content patterns
        content_analysis = self._analyze_content(content)
        risk_score += content_analysis['score']
        warnings.extend(content_analysis['warnings'])
        
        # Check for urgent requests
        if self._has_urgent_requests(content):
            risk_score += 25
            warnings.append("Urgent action requested")
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'warnings': warnings,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(sender_number),
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_call(self, caller_number, call_type, urgency_level):
        risk_score = 0
        warnings = []
        
        # Check caller number
        if self._is_suspicious_number(caller_number):
            risk_score += 25
            warnings.append("Suspicious caller number")
        
        # Check call patterns
        if self._has_suspicious_call_patterns(call_type, urgency_level):
            risk_score += 30
            warnings.append("Suspicious call characteristics")
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'warnings': warnings,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(caller_number),
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_website(self, url, content):
        risk_score = 0
        warnings = []
        
        # Check URL
        if self._is_suspicious_url(url):
            risk_score += 35
            warnings.append("Suspicious website URL")
        
        # Check content patterns
        if self._has_suspicious_website_patterns(content):
            risk_score += 25
            warnings.append("Suspicious website content")
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'warnings': warnings,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(url),
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_image(self, image_data):
        """Analyze image for fraud indicators"""
        risk_score = 0
        warnings = []
        
        # Rule-based image analysis
        if self._has_suspicious_image_patterns(image_data):
            risk_score += 40
            warnings.append("Suspicious visual elements detected")
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'warnings': warnings,
            'recommendations': self._get_image_recommendations(risk_level),
            'timestamp': datetime.now().isoformat()
        }
    
    def _is_suspicious_sender(self, sender):
        suspicious_domains = ['free-email.com', 'suspicious.net', 'fake-domain.org']
        return any(domain in sender.lower() for domain in suspicious_domains)
    
    def _has_urgent_subject(self, subject):
        urgency_words = ['urgent', 'immediate', 'suspended', 'expire', 'action required']
        return any(word in subject.lower() for word in urgency_words)
    
    def _analyze_content(self, content):
        score = 0
        warnings = []
        
        for category, patterns in self.suspicious_patterns.items():
            for pattern in patterns:
                if pattern in content.lower():
                    score += 10
                    warnings.append(f"Suspicious {category} pattern detected")
        
        return {'score': score, 'warnings': warnings}
    
    def _is_suspicious_number(self, number):
        # Check for common scam number patterns
        suspicious_patterns = ['000', '123', '999']
        return any(pattern in str(number) for pattern in suspicious_patterns)
    
    def _has_suspicious_call_patterns(self, call_type, urgency_level):
        return call_type == 'unknown' and urgency_level == 'high'
    
    def _has_urgent_requests(self, content):
        urgent_words = ['call now', 'respond immediately', 'urgent action']
        return any(word in content.lower() for word in urgent_words)
    
    def _is_suspicious_url(self, url):
        suspicious_domains = ['fake-site.com', 'scam-website.net', 'phishing.org']
        return any(domain in url.lower() for domain in suspicious_domains)
    
    def _has_suspicious_website_patterns(self, content):
        suspicious_indicators = ['free money', 'miracle cure', 'act now', 'limited time']
        return any(indicator in content.lower() for indicator in suspicious_indicators)
    
    def _has_suspicious_image_patterns(self, image_data):
        """Basic image analysis - can be enhanced with ML models"""
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(io.BytesIO(image_bytes))
            
            # Basic checks
            width, height = image.size
            
            # Suspicious if image is very small (common in phishing)
            if width < 100 or height < 100:
                return True
                
            return False
        except:
            return True  # If we can't process the image, consider it suspicious
    
    def _get_image_recommendations(self, risk_level):
        recommendations = {
            'HIGH': [
                'Do not trust this image',
                'Verify information through official sources',
                'Check for image manipulation signs',
                'Report if received via suspicious channels'
            ],
            'MEDIUM': [
                'Verify image authenticity',
                'Check original source',
                'Look for inconsistencies',
                'Be cautious of claims made'
            ],
            'LOW': [
                'Image appears normal',
                'Still verify any claims made',
                'Check source credibility'
            ]
        }
        return recommendations.get(risk_level, [])
    
    def _calculate_risk_level(self, score):
        if score >= 60:
            return 'HIGH'
        elif score >= 30:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _get_recommendations(self, risk_level):
        recommendations = {
            'HIGH': [
                'Do not respond or click any links',
                'Block the sender/number immediately',
                'Report to relevant authorities',
                'Check your accounts for suspicious activity'
            ],
            'MEDIUM': [
                'Verify the source through official channels',
                'Do not provide personal information',
                'Be cautious of urgent requests',
                'Check for spelling/grammar errors'
            ],
            'LOW': [
                'Still verify through official channels',
                'Be cautious of unexpected requests',
                'Trust your instincts'
            ]
        }
        return recommendations.get(risk_level, [])
    
    def _assess_source_credibility(self, source):
        if self._is_legitimate_source(source):
            return 'HIGH'
        elif source and len(str(source)) > 5:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _is_legitimate_source(self, source):
        legitimate_indicators = ['gov', 'edu', 'bank', 'official']
        return any(indicator in str(source).lower() for indicator in legitimate_indicators)


# Initialize analyzer
analyzer = ScamAnalyzer()

@app.route('/')
def home():
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
def analyze_text_main():
    user_id = None
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            user_id = 1  # Default user ID for testing
        except:
            pass
    
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    original_text = text
    text_for_analysis, detected_lang = detect_and_translate(text, 'en')
    
    if bedrock_available and llm:
        try:
            prompt = f"Analyze this text for fraud indicators: {text_for_analysis}"
            response = llm.invoke(prompt)
            if hasattr(response, 'content'):
                response = response.content
            elif isinstance(response, dict) and 'content' in response:
                response = response['content']
        except Exception as e:
            response = rule_based_analysis(text_for_analysis)
    else:
        response = rule_based_analysis(text_for_analysis)
    
    if detected_lang != 'en':
        response = translate_response(response, detected_lang)

    if user_id:
        analysis_record = AnalysisHistory(
            user_id=user_id,
            text=original_text,
            result=response
        )
        db.session.add(analysis_record)
        db.session.commit()
    
    return jsonify({'result': response})

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'ScamGuard API'
    })

@app.route('/api/analyze/email', methods=['POST'])
def analyze_email():
    try:
        data = request.json
        sender = data.get('sender', '')
        subject = data.get('subject', '')
        content = data.get('content', '')
        
        if not all([sender, subject, content]):
            return jsonify({'error': 'Missing required fields: sender, subject, content'}), 400
        
        result = analyzer.analyze_email(sender, subject, content)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text_api():
    try:
        data = request.json
        content = data.get('content', '')
        sender_number = data.get('sender_number', '')
        
        if not content:
            return jsonify({'error': 'Missing required field: content'}), 400
        
        result = analyzer.analyze_text(content, sender_number)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500
@app.route('/api/analyze/call', methods=['POST'])
def analyze_call():
    try:
        data = request.json
        caller_number = data.get('caller_number', '')
        call_type = data.get('call_type', 'unknown')
        urgency_level = data.get('urgency_level', 'normal')
        
        if not caller_number:
            return jsonify({'error': 'Missing required field: caller_number'}), 400
        
        result = analyzer.analyze_call(caller_number, call_type, urgency_level)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/analyze/website', methods=['POST'])
def analyze_website():
    try:
        data = request.json
        url = data.get('url', '')
        content = data.get('content', '')
        
        if not url:
            return jsonify({'error': 'Missing required field: url'}), 400
        
        result = analyzer.analyze_website(url, content)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/analyze/image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        image_data = data.get('image', '')
        
        if not image_data:
            return jsonify({'error': 'Missing required field: image'}), 400
        
        # Use Bedrock vision model if available
        if bedrock_available:
            try:
                result = analyze_image_with_bedrock(image_data)
                return jsonify(result)
            except Exception as e:
                print(f"Bedrock vision analysis failed: {e}")
        
        # Fallback to rule-based analysis
        result = analyzer.analyze_image(image_data)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500


@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    analyses = AnalysisHistory.query.filter_by(user_id=user_id).order_by(AnalysisHistory.created_at.desc()).limit(20).all()
    return jsonify([analysis.to_dict() for analysis in analyses])


def analyze_image_with_bedrock(image_data):
    """Analyze image using Amazon Rekognition"""
    try:
        # Handle different base64 formats
        if ',' in image_data:
            image_b64 = image_data.split(',')[1]
        else:
            image_b64 = image_data
            
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes))
        width, height = image.size
        file_size = len(image_bytes)
        
        # Use Amazon Rekognition for image analysis
        rekognition = session.client('rekognition', region_name=REGION)
        
        # Detect text in image
        text_response = rekognition.detect_text(Image={'Bytes': image_bytes})
        detected_texts = [item['DetectedText'] for item in text_response.get('TextDetections', [])]
        
        # Detect labels/objects
        label_response = rekognition.detect_labels(Image={'Bytes': image_bytes}, MaxLabels=20)
        detected_labels = [(item['Name'], item['Confidence']) for item in label_response.get('Labels', [])]
        
        # Analyze for fraud indicators
        fraud_score = 0
        fraud_indicators = []
        detailed_analysis = f"Amazon Rekognition analysis of {width}x{height} image ({file_size} bytes): "
        
        # Check detected text for fraud patterns
        fraud_keywords = ['urgent', 'verify', 'suspended', 'winner', 'congratulations', 'prize', 'click here', 'act now', 'limited time']
        suspicious_texts = []
        
        for text in detected_texts:
            if any(keyword in text.lower() for keyword in fraud_keywords):
                fraud_score += 25
                suspicious_texts.append(text)
        
        if suspicious_texts:
            fraud_indicators.append(f'Suspicious text detected: {", ".join(suspicious_texts[:3])}')
            detailed_analysis += f"Found {len(suspicious_texts)} suspicious text elements including urgency tactics and fraud keywords. "
        
        # Check for document-like content
        document_labels = ['document', 'text', 'paper', 'receipt', 'invoice', 'form', 'id card', 'license']
        found_documents = [label for label, conf in detected_labels if label.lower() in document_labels and conf > 70]
        
        if found_documents:
            fraud_score += 15
            fraud_indicators.append(f'Document detected: {found_documents[0]} - verify authenticity through official channels')
            detailed_analysis += f"Detected document-like content: {', '.join(found_documents)}. This could be a legitimate document or a fraudulent reproduction. "
        
        # Technical analysis for fraud patterns
        if width < 300 or height < 300:
            fraud_score += 20
            fraud_indicators.append(f'Small image size ({width}x{height}) - commonly used in phishing emails to evade detection')
            detailed_analysis += "Small image dimensions are often used in phishing campaigns to bypass email security filters. "
        
        if file_size < 10000:
            fraud_score += 10
            fraud_indicators.append('Small file size indicates heavy compression or low quality - common in fraudulent images')
            detailed_analysis += "Low file size suggests image compression that may hide manipulation artifacts. "
        
        # Check for QR codes or barcodes
        qr_labels = [label for label, conf in detected_labels if 'qr' in label.lower() or 'barcode' in label.lower()]
        if qr_labels:
            fraud_score += 15
            fraud_indicators.append('QR code or barcode detected - verify destination before scanning')
            detailed_analysis += "QR codes can redirect to malicious websites or download harmful content. "
        
        # High confidence labels analysis
        high_conf_labels = [label for label, conf in detected_labels if conf > 90]
        if high_conf_labels:
            detailed_analysis += f"High-confidence visual elements detected: {', '.join(high_conf_labels[:5])}. "
        
        if detected_texts:
            detailed_analysis += f"Text elements found: {', '.join(detected_texts[:3])}{'...' if len(detected_texts) > 3 else ''}. "
        
        risk_level = 'HIGH' if fraud_score >= 50 else 'MEDIUM' if fraud_score >= 25 else 'LOW'
        
        return {
            'risk_level': risk_level,
            'risk_score': min(fraud_score, 100),
            'detailed_analysis': detailed_analysis,
            'fraud_indicators': fraud_indicators if fraud_indicators else ['No specific fraud indicators detected in image analysis'],
            'warnings': fraud_indicators,
            'recommendations': [
                'Verify any text claims through official channels',
                'Check document authenticity if official-looking',
                'Be cautious of urgent language or prize notifications',
                'Do not scan QR codes from untrusted sources',
                'Cross-reference with known legitimate sources'
            ],
            'timestamp': datetime.now().isoformat(),
            'analysis_method': 'Amazon-Rekognition',
            'detected_text_count': len(detected_texts),
            'detected_labels_count': len(detected_labels)
        }
        
        # Enhanced rule-based fallback
        risk_score = 30
        warnings = []
        detailed_analysis = f'Analyzed {width}x{height} pixel image ({file_size} bytes). '
        
        if width < 200 or height < 200:
            risk_score += 25
            warnings.append('Very small image size - commonly used in phishing emails')
            detailed_analysis += 'Small image dimensions suggest this may be a low-quality screenshot or thumbnail, which is often used in fraudulent communications to evade detection. '
        
        if width > 1920 or height > 1080:
            risk_score += 15
            warnings.append('Unusually large image - possible full screenshot')
            detailed_analysis += 'Large image size suggests this may be a full screenshot of a website or application, which could indicate phishing attempts. '
        
        if file_size < 10000:  # Less than 10KB
            risk_score += 20
            warnings.append('Very small file size - possible compressed or low-quality image')
            detailed_analysis += 'Small file size combined with image dimensions suggests heavy compression or poor quality, common in fraudulent documents. '
        
        risk_level = 'HIGH' if risk_score >= 60 else 'MEDIUM' if risk_score >= 35 else 'LOW'
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'detailed_analysis': detailed_analysis,
            'fraud_indicators': warnings if warnings else ['Basic technical analysis completed'],
            'warnings': warnings if warnings else ['Basic image validation completed'],
            'recommendations': [
                'Verify image source and authenticity through official channels',
                'Check for signs of digital manipulation or editing',
                'Be cautious of unsolicited images, especially with urgent requests',
                'Cross-reference any claims made in the image with official sources'
            ],
            'timestamp': datetime.now().isoformat(),
            'analysis_method': 'Enhanced-Rule-Based-Fallback',
            'image_properties': f'{width}x{height}'
        }
        
    except Exception as e:
        print(f"Image analysis error: {e}")
        print(f"Image data length: {len(image_data) if image_data else 0}")
        print(f"Image data starts with: {image_data[:50] if image_data else 'None'}")
        
        return {
            'risk_level': 'MEDIUM',
            'risk_score': 50,
            'warnings': [f'Image processing failed: {str(e)[:100]}'],
            'recommendations': ['Check image format and try again', 'Manually verify image authenticity'],
            'timestamp': datetime.now().isoformat(),
            'analysis_method': 'Error-Fallback',
            'error_details': str(e)
        }

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


@app.route('/api/examples')
def get_examples():
    # Get language preference from query parameter
    lang = request.args.get('lang', 'en')
    
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
    
    # Translate examples if requested language is not English
    if lang != 'en':
        for example in examples:
            try:
                translated = translator.translate(example['text'], src='en', dest=lang)
                example['text'] = translated.text
                example['original_text'] = example['text']
            except:
                pass  # Keep original if translation fails
    
    return jsonify(examples)

@app.route('/api/stats')
def get_stats():
    return jsonify({
        'total_analyses': 0,  # Could track this in a database
        'risk_distribution': {
            'high': 0,
            'medium': 0,
            'low': 0
        },
        'api_status': 'operational',
        'last_updated': datetime.now().isoformat()
    })

@app.route('/api/translations/<lang>')
def get_translations(lang):
    """Get translations for the specified language"""
    translations = {
        'home': 'Home',
        'learn': 'Learn',
        'practice': 'Practice',
        'about': 'About',
        'logout': 'Logout',
        'fraud_detection_trainer': 'Fraud Detection Trainer',
        'learn_to_identify': 'Learn to identify fraudulent emails and news articles with AI-powered analysis',
        'text_analyzer': 'Text Analyzer',
        'paste_suspicious': 'Paste suspicious text below for instant fraud analysis:',
        'placeholder': 'Paste email or news text here...',
        'analyze_button': 'Analyze for Fraud',
        'analyzing': 'Analyzing...',
        'practice_examples': 'Practice Examples'
    }
    
    if lang == 'en':
        return jsonify(translations)
    
    try:
        translated = {}
        for key, text in translations.items():
            result = translator.translate(text, src='en', dest=lang)
            translated[key] = result.text
        return jsonify(translated)
    except Exception as e:
        print(f"Translation error: {e}")
        return jsonify(translations)  # Return English if translation fails

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=8000, host='0.0.0.0')

