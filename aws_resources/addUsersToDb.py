import json
import boto3
import csv
import uuid
import re  # Import regex module

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamo_client = boto3.resource('dynamodb')
table = dynamo_client.Table('ShowerInvites')

# S3 Bucket and File Details
BUCKET_NAME = "app-invites"
FILE_NAME = "baby_shower_guest_list-20250329.csv"


def lambda_handler(event, context):
    try:
        # Read and clean CSV data
        csv_data = read_csv_from_s3(BUCKET_NAME, FILE_NAME)

        if not csv_data:
            return {"statusCode": 400, "body": "CSV file is empty or missing required fields."}

        # Process each row in the CSV and add to DynamoDB
        for row in csv_data:
            add_guest_to_dynamodb(row)

        return {"statusCode": 200, "body": f"Successfully added {len(csv_data)} guests."}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def read_csv_from_s3(bucket_name, file_name):
    """Reads a CSV file from S3, cleans phone numbers, and returns a list of dictionaries."""
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        content = response["Body"].read().decode("utf-8").splitlines()
        csv_reader = csv.DictReader(content)

        guests = []
        for row in csv_reader:
            if "firstName" in row and "lastName" in row and "phone" in row:
                guests.append({
                    "firstName": row["firstName"].strip(),
                    "lastName": row["lastName"].strip(),
                    "phone": clean_phone_number(row["phone"])
                })

        return guests

    except Exception as e:
        print(f"Error reading CSV from S3: {e}")
        return []


def clean_phone_number(phone):
    """Removes spaces, parentheses, and dashes from phone numbers."""
    return re.sub(r"[^\d]", "", phone)


def add_guest_to_dynamodb(guest):
    """Adds a single guest entry to DynamoDB."""
    user_id = str(uuid.uuid4())  # Generate unique ID

    try:
        table.put_item(
            Item={
                "userId": user_id,
                "firstName": guest["firstName"],
                "lastName": guest["lastName"],
                "phone": guest["phone"],
                "eligibility": False,  # Default eligibility
                "numAttempts": 0,  # Default attempts
                "genderRevealOnly": False
            }
        )
        print(f"Added: {guest['firstName']} {guest['lastName']} ({guest['phone']})")

    except Exception as e:
        print(f"Error adding guest {guest['phone']}: {e}")
