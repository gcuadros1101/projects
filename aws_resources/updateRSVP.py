import json
import boto3
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger()
logger.setLevel("INFO")

# Initialize DynamoDB client
dynamo_client = boto3.client('dynamodb')


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
def update_item_with_retry(params):
    return dynamo_client.update_item(**params)


def lambda_handler(event, context):
    logger.info(event)

    # Extract data from event
    userId = event.get('userId')
    rsvp = event.get('rsvp')
    dietaryRestrictions = event.get('dietaryRestrictions', None)  # Default to None if not provided

    if not isinstance(rsvp, bool):  # Ensure rsvp is a boolean
        logger.info("400: Invalid RSVP value. Must be a boolean.")

        return {
            'statusCode': 400,
            'body': json.dumps("Invalid RSVP value. Must be a boolean.")
        }

    # Construct the update expression dynamically
    update_expression = "SET rsvp = :rsvp"
    expression_values = {
        ":rsvp": {'BOOL': rsvp}
    }

    # Add dietaryRestrictions only if provided, otherwise set it to NULL
    if dietaryRestrictions is not None and dietaryRestrictions.strip() != "":
        update_expression += ", dietaryRestrictions = :diet"
        expression_values[":diet"] = {'S': dietaryRestrictions}
    else:
        update_expression += ", dietaryRestrictions = :nullVal"
        expression_values[":nullVal"] = {'NULL': True}

    # Define DynamoDB update parameters
    params = {
        'TableName': 'ShowerInvites',
        'Key': {
            'userId': {'S': userId}
        },
        'UpdateExpression': update_expression,
        'ExpressionAttributeValues': expression_values,
        'ReturnValues': 'UPDATED_NEW'
    }

    try:
        # Perform the update operation
        response = update_item_with_retry(params)

        logger.info(f"200: Update successful for params... {params}")

        # Return a success response
        return {
            'statusCode': 200,
            'body': json.dumps('Update successful')
        }
    except Exception as e:
        logger.info(f"500: An error occurred: {str(e)}\nwith params: {params}")

        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps(f"An error occurred: {str(e)}")
        }
