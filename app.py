from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

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
    return jsonify({
        'message': 'ScamGuard API is running!',
        'endpoints': {
            'health': '/api/health',
            'analyze_email': '/api/analyze/email',
            'analyze_text': '/api/analyze/text',
            'analyze_call': '/api/analyze/call',
            'analyze_website': '/api/analyze/website',
            'stats': '/api/stats'
        }
    })

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
def analyze_text():
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)