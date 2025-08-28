# ScamGuard - Full-Stack Scam Prevention Application

A comprehensive, AI-powered scam detection system built with **Flask backend** and **React frontend**.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   React Frontend │ ←──────────────→ │  Flask Backend  │
│   (Port 3000)   │                 │   (Port 5000)   │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  AI Analysis    │
                                    │   Engine        │
                                    └─────────────────┘
```

## 🚀 **Features**

### **Backend (Flask API)**
- **RESTful API endpoints** for scam analysis
- **AI-powered detection** using pattern recognition and machine learning
- **Multi-channel analysis**: Email, Text, Phone Calls, Websites
- **Risk scoring** with confidence levels
- **Source credibility assessment**
- **Comprehensive recommendations**

### **Frontend (React)**
- **Modern, responsive UI** built with React 18 + TypeScript
- **Real-time analysis** with live API integration
- **Interactive forms** for different communication types
- **Visual risk indicators** and progress bars
- **Educational content** and prevention tips

## 🛠️ **Technology Stack**

### **Backend**
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Python-dotenv** - Environment variable management
- **Regex patterns** - Advanced scam detection algorithms

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icons

## 📁 **Project Structure**

```
ScamGuard/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Tailwind CSS styles
│   ├── package.json      # Node.js dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
└── README.md             # This file
```

## 🚀 **Quick Start**

### **1. Backend Setup (Flask)**

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

The backend will start on `http://localhost:5000`

### **2. Frontend Setup (React)**

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔌 **API Endpoints**

### **Base URL**: `http://localhost:5000/api`

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/health` | GET | Health check | None |
| `/analyze/email` | POST | Analyze email for scams | `{sender, subject, content}` |
| `/analyze/text` | POST | Analyze text messages | `{sender_number, content}` |
| `/analyze/call` | POST | Analyze phone calls | `{caller_number, call_details}` |
| `/analyze/website` | POST | Analyze websites | `{url, additional_details}` |
| `/stats` | GET | Get scam statistics | None |

### **Example API Request**

```bash
curl -X POST http://localhost:5000/api/analyze/email \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "suspicious@fake.com",
    "subject": "URGENT: Account Suspended",
    "content": "Your account will be suspended unless you verify immediately!"
  }'
```

## 🧠 **AI Analysis Features**

### **Email Analysis**
- Sender legitimacy checking
- Subject line urgency detection
- Content pattern recognition
- Phishing link detection
- Grammar and spelling analysis

### **Text Message Analysis**
- Sender number verification
- Urgent request detection
- Suspicious link identification
- Pressure tactic recognition

### **Phone Call Analysis**
- Caller number validation
- Robocall detection
- Spoofing identification
- Urgent request analysis

### **Website Analysis**
- Domain legitimacy checking
- Suspicious TLD detection
- Content pattern analysis
- Security indicator assessment

## 🎯 **Risk Assessment System**

### **Risk Levels**
- **Low (0-39)**: Minimal risk, exercise normal caution
- **Medium (40-59)**: Moderate risk, be cautious
- **High (60-79)**: High risk, do not engage
- **Critical (80-100)**: Critical risk, immediate action required

### **Confidence Scoring**
- Based on number of detected indicators
- Pattern strength assessment
- Source credibility factors
- Content quality analysis

## 🔒 **Security Features**

- **Input validation** and sanitization
- **CORS enabled** for frontend integration
- **Error handling** with graceful fallbacks
- **No data storage** - analysis performed in real-time
- **Privacy-first** approach

## 🧪 **Testing the Application**

### **1. Start Both Servers**
```bash
# Terminal 1 - Backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **2. Test Scam Detection**
1. Open `http://localhost:3000` in your browser
2. Navigate to any analysis tab (Email, Text, Call, Website)
3. Enter suspicious content for testing
4. Submit and view AI analysis results

### **3. Sample Test Data**

**High-Risk Email:**
- Sender: `urgent@verify-now.com`
- Subject: `URGENT: Your account will be suspended!`
- Content: `Click here immediately to verify your information or your account will be permanently deleted!`

**Suspicious Text:**
- Number: `+1234567890`
- Content: `You've won $1000! Click here to claim your prize now!`

## 🚨 **Emergency Information**

### **If You Detect a Scam:**
1. **Stop all communication** immediately
2. **Document everything** that happened
3. **Contact financial institutions** if money was involved
4. **Report to authorities** (FTC, FBI, local police)

### **Emergency Contacts:**
- **Emergency**: 911
- **FTC Hotline**: 1-877-FTC-HELP
- **Identity Theft**: 1-877-ID-THEFT
- **Internet Crime**: IC3.gov

## 🔧 **Development & Customization**

### **Adding New Scam Patterns**
Edit `app.py` and add new patterns to the `ScamAnalyzer` class:

```python
def _add_new_pattern(self, pattern_type, patterns):
    self.scam_patterns[pattern_type] = patterns
```

### **Customizing Risk Scoring**
Modify the scoring logic in the analysis methods:

```python
def _calculate_risk_score(self, indicators):
    # Custom scoring algorithm
    base_score = len(indicators) * 10
    return min(100, base_score)
```

### **Frontend Customization**
- Modify `frontend/src/App.tsx` for UI changes
- Update `frontend/src/index.css` for styling
- Add new components in the `frontend/src/` directory

## 📊 **Performance & Scalability**

### **Current Implementation**
- **Real-time analysis** with sub-second response times
- **Lightweight pattern matching** for fast detection
- **Stateless API design** for horizontal scaling

### **Future Enhancements**
- **Database integration** for historical analysis
- **Machine learning models** for improved accuracy
- **Real-time threat intelligence** feeds
- **Multi-language support**

## 🤝 **Contributing**

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## ⚠️ **Disclaimer**

ScamGuard is designed to assist in scam detection but should not be considered a replacement for professional security advice. Always exercise caution and verify information through official channels.

---

**Stay Safe, Stay Informed, Stay Protected with ScamGuard** 🛡️

*Built with ❤️ for a safer digital world*