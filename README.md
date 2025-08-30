# TechLit - Fraud Detection Education App

An educational web application that uses AWS Bedrock and LangChain to help users recognize fraudulent emails, news articles, and other suspicious content.

## 🚀 Features

- **AI-Powered Analysis**: Real-time fraud detection using AWS Bedrock (Meta Llama models)
- **Educational Content**: Learn about common fraud indicators and warning signs
- **Interactive Practice**: Test your knowledge with real-world examples
- **Clean Architecture**: Streamlined Flask application with AWS integration

## 🛠️ Prerequisites

- Python 3.8+
- AWS Account with Bedrock access enabled
- AWS credentials with appropriate permissions

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
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (defaults to us-west-2)
- `BEDROCK_MODEL_ID`: Bedrock model ID (defaults to meta.llama3-8b-instruct-v1:0)

### 5. Test AWS Configuration
```bash
python aws_setup.py
```

### 6. Run the Application
```bash
python app.py
```

Visit http://localhost:5000 to use the application.

## 🔒 Security Notes

- **Never commit AWS credentials** to version control
- **Use environment variables** for sensitive information
- **Rotate access keys** regularly
- **Follow AWS security best practices**

## 🏗️ Architecture

- **Frontend**: HTML templates with modern CSS
- **Backend**: Flask web framework
- **AI**: AWS Bedrock with Meta Llama models
- **Storage**: AWS DynamoDB (optional)
- **Authentication**: Environment-based AWS credentials

## 📁 Project Structure

```
TechLit-Bridging-The-Gap/
├── app.py              # Main Flask application
├── aws_setup.py        # AWS configuration and testing
├── requirements.txt     # Python dependencies
├── config.example      # Configuration template
├── templates/          # HTML templates
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🐛 Troubleshooting

- **Bedrock Access Error**: Ensure Bedrock is enabled in your AWS account
- **Credential Errors**: Check environment variables are set correctly
- **Model Not Found**: Verify the model ID is available in your region

## 📝 License

This project is part of a hackathon submission. Please respect the original authors and contributors.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.