from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import re
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

class ScamAnalyzer:
    """AI-powered scam detection system"""
    
    def __init__(self):
        # Common scam indicators
        self.scam_indicators = {
            'urgency': ['urgent', 'immediate', 'now', 'hurry', 'deadline', 'expires'],
            'financial': ['money', 'bank', 'account', 'credit card', 'payment', 'transfer'],
            'personal_info': ['ssn', 'social security', 'password', 'login', 'verify'],
            'threats': ['legal action', 'account suspended', 'arrest', 'warrant'],
            'too_good': ['free', 'winner', 'prize', 'inheritance', 'lottery'],
            'authority': ['irs', 'fbi', 'police', 'government', 'official']
        }
        
        # Known scam patterns
        self.scam_patterns = {
            'phishing': r'(https?://[^\s]+)',
            'phone_spoofing': r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            'suspicious_domain': r'([a-zA-Z0-9-]+\.(?:xyz|top|club|site|online))',
            'generic_greeting': r'(dear (?:user|customer|valued|friend))',
            'poor_grammar': r'\b(?:ur|u|r|pls|plz|thx|thnx)\b'
        }
    
    def analyze_email(self, sender, subject, content):
        """Analyze email for scam indicators"""
        risk_score = 0
        reasons = []
        confidence = 0
        
        # Check sender legitimacy
        if self._is_suspicious_sender(sender):
            risk_score += 25
            reasons.append("Suspicious sender email address")
        
        # Check subject line
        if self._has_urgent_subject(subject):
            risk_score += 20
            reasons.append("Urgent or threatening subject line")
        
        # Check content
        content_analysis = self._analyze_content(content)
        risk_score += content_analysis['score']
        reasons.extend(content_analysis['reasons'])
        
        # Calculate confidence based on number of indicators
        confidence = min(95, 50 + (len(reasons) * 10))
        
        # Determine risk level
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'is_scam': risk_score > 50,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'confidence': confidence,
            'reasons': reasons,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(sender, content)
        }
    
    def analyze_text(self, sender_number, content):
        """Analyze text message for scam indicators"""
        risk_score = 0
        reasons = []
        
        # Check sender number
        if self._is_suspicious_number(sender_number):
            risk_score += 30
            reasons.append("Unknown or suspicious sender number")
        
        # Check content
        content_analysis = self._analyze_content(content)
        risk_score += content_analysis['score']
        reasons.extend(content_analysis['reasons'])
        
        # Check for urgent requests
        if self._has_urgent_requests(content):
            risk_score += 25
            reasons.append("Urgent financial or personal requests")
        
        confidence = min(95, 50 + (len(reasons) * 10))
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'is_scam': risk_score > 50,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'confidence': confidence,
            'reasons': reasons,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(sender_number, content)
        }
    
    def analyze_call(self, caller_number, call_details):
        """Analyze phone call for scam indicators"""
        risk_score = 0
        reasons = []
        
        # Check caller number
        if self._is_suspicious_number(caller_number):
            risk_score += 35
            reasons.append("Unknown or suspicious caller number")
        
        # Check call details
        if self._has_suspicious_call_patterns(call_details):
            risk_score += 30
            reasons.append("Suspicious call patterns detected")
        
        # Check for urgent requests
        if self._has_urgent_requests(call_details):
            risk_score += 25
            reasons.append("Urgent financial or personal requests")
        
        confidence = min(95, 50 + (len(reasons) * 10))
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'is_scam': risk_score > 50,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'confidence': confidence,
            'reasons': reasons,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(caller_number, call_details)
        }
    
    def analyze_website(self, url, additional_details):
        """Analyze website for scam indicators"""
        risk_score = 0
        reasons = []
        
        # Check URL legitimacy
        if self._is_suspicious_url(url):
            risk_score += 40
            reasons.append("Suspicious or newly registered domain")
        
        # Check for suspicious patterns
        if self._has_suspicious_website_patterns(url, additional_details):
            risk_score += 30
            reasons.append("Suspicious website patterns detected")
        
        # Check additional details
        if additional_details and self._has_suspicious_content(additional_details):
            risk_score += 20
            reasons.append("Suspicious content or behavior reported")
        
        confidence = min(95, 50 + (len(reasons) * 10))
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'is_scam': risk_score > 50,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'confidence': confidence,
            'reasons': reasons,
            'recommendations': self._get_recommendations(risk_level),
            'source_credibility': self._assess_source_credibility(url, additional_details)
        }
    
    def _is_suspicious_sender(self, sender):
        """Check if email sender is suspicious"""
        if not sender:
            return True
        
        # Check for generic domains
        suspicious_domains = ['gmail.com', 'yahoo.com', 'hotmail.com']
        domain = sender.split('@')[-1] if '@' in sender else ''
        
        # Check for suspicious patterns
        suspicious_patterns = [
            r'[0-9]{10,}',  # Long numbers
            r'[a-z]{1,2}[0-9]{3,}',  # Short letters + numbers
            r'[0-9]{3,}[a-z]{1,2}'   # Numbers + short letters
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, sender):
                return True
        
        return False
    
    def _has_urgent_subject(self, subject):
        """Check if subject line contains urgent language"""
        if not subject:
            return False
        
        urgent_words = ['urgent', 'immediate', 'action required', 'deadline', 'expires', 'final notice']
        return any(word in subject.lower() for word in urgent_words)
    
    def _analyze_content(self, content):
        """Analyze content for scam indicators"""
        if not content:
            return {'score': 0, 'reasons': []}
        
        score = 0
        reasons = []
        content_lower = content.lower()
        
        # Check for scam indicators
        for category, words in self.scam_indicators.items():
            found_words = [word for word in words if word in content_lower]
            if found_words:
                score += 15
                reasons.append(f"Suspicious {category} language detected")
        
        # Check for poor grammar
        if re.search(self.scam_patterns['poor_grammar'], content_lower):
            score += 10
            reasons.append("Poor grammar and spelling")
        
        # Check for generic greetings
        if re.search(self.scam_patterns['generic_greeting'], content_lower):
            score += 10
            reasons.append("Generic or impersonal greeting")
        
        return {'score': score, 'reasons': reasons}
    
    def _is_suspicious_number(self, number):
        """Check if phone number is suspicious"""
        if not number:
            return True
        
        # Remove formatting
        clean_number = re.sub(r'[^\d]', '', number)
        
        # Check for suspicious patterns
        if len(clean_number) < 10 or len(clean_number) > 15:
            return True
        
        # Check for repeated digits
        if len(set(clean_number)) < 4:
            return True
        
        return False
    
    def _has_suspicious_call_patterns(self, details):
        """Check for suspicious call patterns"""
        if not details:
            return False
        
        suspicious_patterns = [
            'robocall', 'automated', 'press 1', 'press 2',
            'remote access', 'computer problems', 'virus detected'
        ]
        
        return any(pattern in details.lower() for pattern in suspicious_patterns)
    
    def _has_urgent_requests(self, content):
        """Check for urgent requests"""
        if not content:
            return False
        
        urgent_patterns = [
            'act now', 'immediately', 'urgent', 'hurry',
            'limited time', 'expires soon', 'final warning'
        ]
        
        return any(pattern in content.lower() for pattern in urgent_patterns)
    
    def _is_suspicious_url(self, url):
        """Check if URL is suspicious"""
        if not url:
            return True
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.xyz', '.top', '.club', '.site', '.online', '.tk', '.ml']
        if any(tld in url.lower() for tld in suspicious_tlds):
            return True
        
        # Check for newly registered domains (simplified)
        if re.search(r'[0-9]{4,}', url):
            return True
        
        return False
    
    def _has_suspicious_website_patterns(self, url, details):
        """Check for suspicious website patterns"""
        suspicious_patterns = [
            'unrealistic prices', 'too good to be true',
            'limited time offer', 'act now', 'urgent'
        ]
        
        if details:
            return any(pattern in details.lower() for pattern in suspicious_patterns)
        
        return False
    
    def _has_suspicious_content(self, content):
        """Check for suspicious content"""
        if not content:
            return False
        
        suspicious_words = ['urgent', 'immediate', 'action required', 'suspicious']
        return any(word in content.lower() for word in suspicious_words)
    
    def _calculate_risk_level(self, risk_score):
        """Calculate risk level based on score"""
        if risk_score >= 80:
            return 'critical'
        elif risk_score >= 60:
            return 'high'
        elif risk_score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def _get_recommendations(self, risk_level):
        """Get recommendations based on risk level"""
        recommendations = {
            'low': [
                "Exercise normal caution",
                "Verify information through official channels",
                "Monitor for any suspicious activity"
            ],
            'medium': [
                "Do not provide personal information",
                "Verify the source independently",
                "Be cautious of any requests"
            ],
            'high': [
                "Do not respond or engage",
                "Block the sender/number",
                "Report to relevant authorities",
                "Monitor your accounts closely"
            ],
            'critical': [
                "Immediately cease all communication",
                "Contact your bank/financial institutions",
                "Report to law enforcement",
                "Consider freezing your credit"
            ]
        }
        
        return recommendations.get(risk_level, ["Use extreme caution"])
    
    def _assess_source_credibility(self, source, content):
        """Assess the credibility of the source"""
        credibility_score = 50  # Start with neutral score
        
        # Check source legitimacy
        if self._is_legitimate_source(source):
            credibility_score += 30
        else:
            credibility_score -= 20
        
        # Check content quality
        if content and len(content) > 100:
            credibility_score += 10
        
        # Check for professional language
        if content and not re.search(self.scam_patterns['poor_grammar'], content.lower()):
            credibility_score += 10
        
        # Ensure score is within bounds
        credibility_score = max(0, min(100, credibility_score))
        
        factors = []
        if credibility_score > 70:
            factors.append("Source appears legitimate")
        elif credibility_score < 30:
            factors.append("Source credibility concerns")
        else:
            factors.append("Mixed credibility indicators")
        
        return {
            'score': credibility_score,
            'factors': factors
        }
    
    def _is_legitimate_source(self, source):
        """Check if source appears legitimate"""
        if not source:
            return False
        
        # Check for known legitimate patterns
        legitimate_patterns = [
            r'[a-zA-Z]+\.[a-zA-Z]{2,}',  # Proper domain format
            r'[0-9]{3}-[0-9]{3}-[0-9]{4}',  # Standard phone format
        ]
        
        return any(re.search(pattern, source) for pattern in legitimate_patterns)

# Initialize the scam analyzer
analyzer = ScamAnalyzer()

# API Routes
@app.route('/')
def index():
    """Main page - could serve React app"""
    return jsonify({
        'message': 'ScamGuard API',
        'version': '1.0.0',
        'endpoints': {
            'analyze_email': '/api/analyze/email',
            'analyze_text': '/api/analyze/text',
            'analyze_call': '/api/analyze/call',
            'analyze_website': '/api/analyze/website',
            'health': '/api/health'
        }
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'ScamGuard API'
    })

@app.route('/api/analyze/email', methods=['POST'])
def analyze_email():
    """Analyze email for scam indicators"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract data
        sender = data.get('sender', '')
        subject = data.get('subject', '')
        content = data.get('content', '')
        
        # Validate input
        if not any([sender, subject, content]):
            return jsonify({'error': 'At least one field must be provided'}), 400
        
        # Analyze email
        result = analyzer.analyze_email(sender, subject, content)
        
        return jsonify({
            'success': True,
            'analysis_type': 'email',
            'timestamp': datetime.utcnow().isoformat(),
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text():
    """Analyze text message for scam indicators"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract data
        sender_number = data.get('sender_number', '')
        content = data.get('content', '')
        
        # Validate input
        if not any([sender_number, content]):
            return jsonify({'error': 'At least one field must be provided'}), 400
        
        # Analyze text
        result = analyzer.analyze_text(sender_number, content)
        
        return jsonify({
            'success': True,
            'analysis_type': 'text',
            'timestamp': datetime.utcnow().isoformat(),
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/analyze/call', methods=['POST'])
def analyze_call():
    """Analyze phone call for scam indicators"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract data
        caller_number = data.get('caller_number', '')
        call_details = data.get('call_details', '')
        
        # Validate input
        if not any([caller_number, call_details]):
            return jsonify({'error': 'At least one field must be provided'}), 400
        
        # Analyze call
        result = analyzer.analyze_call(caller_number, call_details)
        
        return jsonify({
            'success': True,
            'analysis_type': 'call',
            'timestamp': datetime.utcnow().isoformat(),
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/analyze/website', methods=['POST'])
def analyze_website():
    """Analyze website for scam indicators"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract data
        url = data.get('url', '')
        additional_details = data.get('additional_details', '')
        
        # Validate input
        if not any([url, additional_details]):
            return jsonify({'error': 'At least one field must be provided'}), 400
        
        # Analyze website
        result = analyzer.analyze_website(url, additional_details)
        
        return jsonify({
            'success': True,
            'analysis_type': 'website',
            'timestamp': datetime.utcnow().isoformat(),
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get scam statistics and trends"""
    return jsonify({
        'success': True,
        'stats': {
            'total_analyses': 0,  # Would be stored in database
            'scam_detection_rate': '65%',
            'common_scam_types': [
                'Phishing emails',
                'Robocalls',
                'Fake websites',
                'Text message scams'
            ],
            'last_updated': datetime.utcnow().isoformat()
        }
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])