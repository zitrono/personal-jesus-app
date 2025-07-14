#!/bin/bash

# Query Axiom for errors in the personal-jesus-logs dataset
# Gets logs from the last hour

AXIOM_TOKEN="xaat-3651a82f-844d-4145-982c-aa8ea23b1a15"
DATASET="personal-jesus-logs"

# Get current time and 1 hour ago in ISO format
END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME=$(date -u -v-1H +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "1 hour ago" +"%Y-%m-%dT%H:%M:%SZ")

echo "Querying Axiom for errors from $START_TIME to $END_TIME"
echo "Dataset: $DATASET"
echo ""

# Query for all logs with error level or containing error keywords
curl --request POST \
  --url 'https://api.axiom.co/v1/datasets/_apl?format=tabular' \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header 'Content-Type: application/json' \
  --data "{
    \"apl\": \"['$DATASET'] | where level == 'error' or message contains 'error' or message contains 'Error' | project _time, level, message, error, stack | sort by _time desc | limit 50\",
    \"startTime\": \"$START_TIME\",
    \"endTime\": \"$END_TIME\"
  }" | jq '.'

echo ""
echo "If no results, trying broader query..."
echo ""

# Broader query for any logs
curl --request POST \
  --url 'https://api.axiom.co/v1/datasets/_apl?format=tabular' \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header 'Content-Type: application/json' \
  --data "{
    \"apl\": \"['$DATASET'] | sort by _time desc | limit 20\",
    \"startTime\": \"$START_TIME\",
    \"endTime\": \"$END_TIME\"
  }" | jq '.'