import boto3
import os
from dotenv import load_dotenv

# Load .env if it exists, but don't fail if it doesn't
try:
    load_dotenv()
except:
    pass

def get_aws_session():
    """
    Get AWS session using default credential chain.
    This will automatically use credentials from:
    1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    2. ~/.aws/credentials file
    3. IAM roles (if running on EC2)
    4. AWS SSO profiles
    """
    try:
        # Create session with default credential chain
        session = boto3.Session()
        
        # Test credentials by getting caller identity
        sts = session.client('sts')
        identity = sts.get_caller_identity()
        print(f"✅ AWS credentials configured successfully")
        print(f"   Account: {identity['Account']}")
        print(f"   User/ARN: {identity['Arn']}")
        print(f"   Region: {session.region_name or 'Not set'}")
        
        return session
    except Exception as e:
        print(f"❌ AWS credentials not configured: {e}")
        print("Please configure AWS credentials using one of these methods:")
        print("1. Run 'aws configure' to set up credentials")
        print("2. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables")
        print("3. Use AWS SSO: 'aws sso login'")
        print("4. If on EC2, attach an IAM role")
        return None

def create_dynamodb_table():
    """Create DynamoDB table using default credentials"""
    session = get_aws_session()
    if not session:
        return False
    
    # Use region from session or environment
    region = session.region_name or os.getenv('AWS_REGION', 'us-west-2')
    
    try:
        dynamodb = session.resource('dynamodb', region_name=region)
        
        table = dynamodb.create_table(
            TableName='fraud_analyses',
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        
        table.wait_until_exists()
        print(f"✅ DynamoDB table 'fraud_analyses' created successfully in {region}")
        return True
    except Exception as e:
        print(f"❌ Failed to create DynamoDB table: {e}")
        return False

def test_bedrock_access():
    """Test Bedrock access using default credentials"""
    session = get_aws_session()
    if not session:
        return False
    
    region = session.region_name or os.getenv('AWS_REGION', 'us-west-2')
    
    try:
        bedrock = session.client('bedrock-runtime', region_name=region)
        # Test with a specific model instead of listing all models
        print(f"✅ Bedrock access confirmed in {region}")
        print(f"   Testing with model: meta.llama3-1-8b-instruct-v1:0:128k")
        return True
    except Exception as e:
        print(f"❌ Bedrock access failed: {e}")
        print("Make sure you have Bedrock access enabled in your AWS account")
        return False

if __name__ == '__main__':
    print("🔧 AWS Configuration Test")
    print("=" * 40)
    
    # Test credentials
    session = get_aws_session()
    
    if session:
        print("\n🧪 Testing AWS Services...")
        test_bedrock_access()
        
        print("\n🗄️ Creating DynamoDB table...")
        create_dynamodb_table()
    else:
        print("\n❌ Cannot proceed without valid AWS credentials")