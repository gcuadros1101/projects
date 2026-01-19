import json
import boto3
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger()
logger.setLevel("INFO")

# Initialize DynamoDB client and the rest of your logic
dynamo_client = boto3.resource('dynamodb')
table = dynamo_client.Table('ShowerInvites')


# Decorate a helper function with retry logic.
# This will retry up to 3 times with exponential backoff (wait between 1-4 seconds).
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
def get_item_with_retry(user_id):
    return table.get_item(Key={'userId': user_id})


def lambda_handler(event, context):
    logger.info(event)

    # Retrieve userId from pathParameters
    try:
        user_id = event.get('userId')
        if not user_id:
            logger.info('No userId provided')

            return {
                'statusCode': 400,
                'body': json.dumps('User ID is missing')
            }

        response = get_item_with_retry(user_id)

        if 'Item' in response:
            logger.info('200: got user eligibility')
            return {
                'statusCode': 200,
                'body': json.dumps({'eligibility': response['Item']['eligibility'], 'status': 200})
            }
        else:
            logger.info('404 code')
            return {
                'statusCode': 404,
                'body': json.dumps('User not found')
            }
    except Exception as e:
        logger.info('500: Exception caught')
        logger.info(e)
        logger.info(event)

        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
