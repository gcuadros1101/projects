import json
import boto3
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger()
logger.setLevel("INFO")

dynamo_client = boto3.resource('dynamodb')
table = dynamo_client.Table('ShowerInvites')


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
def update_item_with_retry(user_id, eligibility):
    return table.update_item(
        Key={'userId': user_id},
        UpdateExpression='SET eligibility = :val',
        ExpressionAttributeValues={':val': eligibility},
        ReturnValues='UPDATED_NEW'
    )


def lambda_handler(event, context):
    logger.info(event)

    user_id = event['userId']
    eligibility = event['eligibility']

    try:
        response = update_item_with_retry(user_id, eligibility)
        logger.info('200: update successful')

        return {
            'statusCode': 200,
            'body': json.dumps('Update successful')
        }
    except Exception as e:
        logger.info('500: exception caught')
        logger.info(e)
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
