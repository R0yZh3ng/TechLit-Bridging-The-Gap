#!/usr/bin/env python3
"""
TechLit - Fraud Detection Education App
Startup script with enhanced error handling
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📋 Please set these variables in your .env file")
        print("   Copy config.example to .env and fill in your AWS credentials")
        return False
    
    print("✅ Environment variables configured")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting TechLit - Fraud Detection Education App")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Virtual environment not detected")
        print("   Consider activating your virtual environment first")
    
    print("\n🔧 Starting Flask application...")
    
    try:
        # Import and run the Flask app
        from app import app
        print("✅ Flask application loaded successfully")
        print("🌐 Server will start at http://localhost:5000")
        print("📱 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"❌ Failed to import Flask application: {e}")
        print("   Make sure all dependencies are installed: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
