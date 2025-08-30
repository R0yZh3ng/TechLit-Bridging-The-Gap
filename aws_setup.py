import boto3
import os
from dotenv import load_dotenv

# Load .env if it exists, but don't fail if it doesn't
try:
    load_dotenv()
except:
    pass

def get_aws_session():
    """Get AWS session using environment variables"""
    try:
        # Check if credentials are in environment
        if not (os.getenv('AWS_ACCESS_KEY_ID') and os.getenv('AWS_SECRET_ACCESS_KEY')):
            print("❌ AWS credentials not found in environment variables")
            print("   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")
            return None
        
        # Create session with environment credentials
        session = boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-west-2')
        )
        
        # Test credentials
        sts = session.client('sts')
        identity = sts.get_caller_identity()
        print(f"✅ AWS credentials configured successfully")
        print(f"   Account: {identity['Account']}")
        print(f"   User/ARN: {identity['Arn']}")
        print(f"   Region: {session.region_name}")
        
        return session
    except Exception as e:
        print(f"❌ AWS credentials not configured: {e}")
        return None

def create_dynamodb_table():
    """Create DynamoDB table"""
    session = get_aws_session()
    if not session:
        return False
    
    try:
        dynamodb = session.resource('dynamodb')
        
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
        print(f"✅ DynamoDB table 'fraud_analyses' created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create DynamoDB table: {e}")
        return False

def test_bedrock_access():
    """Test Bedrock access"""
    session = get_aws_session()
    if not session:
        return False
    
    try:
        bedrock = session.client('bedrock-runtime')
        bedrock_list = session.client('bedrock')
        
        # Test listing models
        models = bedrock_list.list_foundation_models()
        model_count = len(models['modelSummaries'])
        print(f"✅ Bedrock access confirmed - {model_count} models available")
        
        # Check for Llama models specifically
        llama_models = [m for m in models['modelSummaries'] if 'llama' in m['modelId'].lower()]
        if llama_models:
            print(f"   Found {len(llama_models)} Llama models")
        
        return True
    except Exception as e:
        print(f"❌ Bedrock access failed: {e}")
        return False

def test_rekognition_access():
    """Test Amazon Rekognition access"""
    session = get_aws_session()
    if not session:
        return False
    
    try:
        rekognition = session.client('rekognition')
        
        # Test with a simple 1x1 pixel image
        import base64
        from PIL import Image
        import io
        
        # Create minimal test image
        test_img = Image.new('RGB', (1, 1), color='white')
        img_buffer = io.BytesIO()
        test_img.save(img_buffer, format='JPEG')
        img_bytes = img_buffer.getvalue()
        
        # Test text detection
        rekognition.detect_text(Image={'Bytes': img_bytes})
        print(f"✅ Amazon Rekognition access confirmed")
        print("   Text detection and label detection available")
        return True
    except Exception as e:
        print(f"❌ Amazon Rekognition access failed: {e}")
        return False

if __name__ == '__main__':
    print("🔧 AWS Configuration Test")
    print("=" * 40)
    
    session = get_aws_session()
    
    if session:
        print("\n🧪 Testing AWS Services...")
        bedrock_ok = test_bedrock_access()
        rekognition_ok = test_rekognition_access()
        
        if bedrock_ok and rekognition_ok:
            print("\n✅ All required AWS services are accessible")
        else:
            print("\n⚠️ Some AWS services may not be available")
        
        print("\n🗄️ Creating DynamoDB table...")
        create_dynamodb_table()
    else:
        print("\n❌ Cannot proceed without valid AWS credentials")