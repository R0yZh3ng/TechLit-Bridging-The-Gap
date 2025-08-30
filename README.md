# TechLit - Fraud Detection Education App

An educational web application that uses AWS Bedrock and Amazon Rekognition to help users recognize fraudulent emails, news articles, images, and other suspicious content.

## 🚀 Features

- **AI-Powered Text Analysis**: Real-time fraud detection using AWS Bedrock (Meta Llama models)
- **Image Fraud Detection**: Advanced image analysis using Amazon Rekognition
- **Multi-Language Support**: Analyze content in multiple languages
- **Educational Content**: Learn about common fraud indicators and warning signs
- **Interactive Practice**: Test your knowledge with real-world examples
- **Clean Architecture**: Streamlined Flask application with AWS integration

## 🛠️ Prerequisites

- Python 3.8+
- AWS Account with the following services enabled:
  - AWS Bedrock (for text analysis)
  - Amazon Rekognition (for image analysis)
- AWS credentials with appropriate permissions for both services

## 📋 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/TechLit-Bridging-The-Gap.git
cd TechLit-Bridging-The-Gap
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure AWS Credentials
Copy the example configuration and fill in your AWS details:
```bash
cp config.example .env
# Edit .env with your AWS credentials
```

**Required Environment Variables:**
- `AWS_ACCESS_KEY_ID`: Your AWS access key (needs Bedrock + Rekognition permissions)
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (defaults to us-west-2)
- `BEDROCK_MODEL_ID`: Bedrock model ID (defaults to meta.llama3-8b-instruct-v1:0)
- `SECRET_KEY`: Flask secret key for sessions
- `JWT_SECRET_KEY`: JWT token signing key

### 5. Test AWS Configuration
```bash
python aws_setup.py
```

### 6. Run the Application
```bash
python app.py
```

Visit http://localhost:8000 to use the application.

## 🔒 Security Notes

- **Never commit AWS credentials** to version control
- **Use environment variables** for sensitive information
- **Rotate access keys** regularly
- **Follow AWS security best practices**

## 🏗️ Architecture

- **Frontend**: React.js with modern CSS and multi-language support
- **Backend**: Flask web framework with JWT authentication
- **Text AI**: AWS Bedrock with Meta Llama models
- **Image AI**: Amazon Rekognition for OCR and object detection
- **Database**: SQLite for user data and analysis history
- **Authentication**: JWT tokens with secure session management

## 📁 Project Structure

```
TechLit-Bridging-The-Gap/
├── app.py              # Main Flask application with Bedrock & Rekognition
├── models.py           # Database models for users and analysis history
├── aws_setup.py        # AWS configuration and testing
├── requirements.txt    # Python dependencies
├── config.example      # Configuration template
├── frontend/           # React.js frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Language context
│   │   └── pages/          # Main pages
│   └── package.json    # Frontend dependencies
├── templates/          # Flask HTML templates (legacy)
├── instance/           # SQLite database
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🐛 Troubleshooting

- **Bedrock Access Error**: Ensure Bedrock is enabled in your AWS account and region
- **Rekognition Access Error**: Ensure Amazon Rekognition is available in your region
- **Credential Errors**: Check environment variables are set correctly
- **Model Not Found**: Verify the Bedrock model ID is available in your region
- **Image Analysis Fails**: Ensure your AWS credentials have Rekognition permissions
- **Translation Issues**: Check if you have access to translation services in your region

## 📝 License

This project is part of a hackathon submission. Please respect the original authors and contributors.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.