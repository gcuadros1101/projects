import json
import boto3
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger()
logger.setLevel("INFO")

# Initialize DynamoDB client
dynamo_client = boto3.client('dynamodb')


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
def scan_table():
    items = []
    response = dynamo_client.scan(
        TableName='ShowerInvites',
        FilterExpression='rsvp = :val',
        ExpressionAttributeValues={':val': {'BOOL': True}},
        ProjectionExpression='firstName, lastName'
    )
    items.extend(response.get('Items', []))

    # Continue scanning if there are more pages
    while 'LastEvaluatedKey' in response:
        response = dynamo_client.scan(
            TableName='ShowerInvites',
            FilterExpression='rsvp = :val',
            ExpressionAttributeValues={':val': {'BOOL': True}},
            ProjectionExpression='firstName, lastName',
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response.get('Items', []))

    return items


def lambda_handler(event, context):
    logger.info(event)
    try:
        # Use the retry-enabled helper for the scan call
        items = scan_table()
        logger.info(f"DynamoDB Response Items: {json.dumps(items, indent=2)}")

        # Process items
        attendees = []
        for item in items:
            first_name = item.get('firstName', {}).get('S', '').strip()
            last_name = item.get('lastName', {}).get('S', '').strip()
            if first_name or last_name:
                attendees.append({
                    "fullName": f"{first_name} {last_name}".strip(),
                    "lastName": last_name
                })

        attendees_sorted = sorted(attendees, key=lambda x: x["lastName"].lower())
        sorted_names = [person["fullName"] for person in attendees_sorted]

        logger.info(f"200: Sorted Attendees:\n{json.dumps(sorted_names, indent=2)}")
        return {
            'statusCode': 200,
            'body': json.dumps(sorted_names)
        }
    except Exception as e:
        logger.info(f"Lambda Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"An error occurred: {str(e)}")
        }
