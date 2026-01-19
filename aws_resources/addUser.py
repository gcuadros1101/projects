import json
import boto3
import uuid


def lambda_handler(event, context):
    dynamo_client = boto3.resource('dynamodb')
    table = dynamo_client.Table('ShowerInvites')

    # Generate a new UUID
    user_id = str(uuid.uuid4())
    phone = event['phone']

    try:
        table.put_item(
            Item={
                'userId': user_id,
                'phone': phone,
                'eligibility': False,  # Default eligibility
                'numAttempts': 0  # Default number of attempts
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'userId': user_id, 'status': 200})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
