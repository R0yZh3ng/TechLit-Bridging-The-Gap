import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def create_dynamodb_table():
    dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
    
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
    print("DynamoDB table 'fraud_analyses' created successfully")

if __name__ == '__main__':
    create_dynamodb_table()