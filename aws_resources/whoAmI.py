import json
import boto3
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger()
logger.setLevel("INFO")

dynamo_client = boto3.resource('dynamodb')
table = dynamo_client.Table('ShowerInvites')

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
def query_by_phone(phone):
    return table.query(
        IndexName='PhoneIndex',
        KeyConditionExpression='phone = :phone',
        ExpressionAttributeValues={':phone': phone}
    )

def lambda_handler(event, context):
    logger.info(event)

    phone = event.get('phone')  # Use .get() to prevent KeyError
    if not phone:
        logger.info('400: missing phone number on whoAmI call')
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Phone number is required'})
        }

    try:
        response = query_by_phone(phone)
        items = response.get('Items', [])
        if items:
            # Assuming the query returns a single user per phone
            user = items[0]
            logger.info(f"200: for user {user.get('userId')} with genderReveal setting = {user.get('genderRevealOnly', True)}")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'userId': user.get('userId'),
                    'genderRevealOnly': user.get('genderRevealOnly', True),  # Default to True if missing
                    'status': 200
                })
            }
        else:
            logger.info('404: User not found')
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'User not found'})
            }
    except Exception as e:
        logger.info(f"500: exception thrown {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
