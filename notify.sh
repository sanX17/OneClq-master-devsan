#!/bin/bash

WEBHOOK_URL="${WEBHOOK_URL:-}"

STATUS=$1
MESSAGE=$2

curl -X POST -H "Content-Type: application/json" \
    -d "{\"content\": \"**[$STATUS]** $MESSAGE\"}" \
    $WEBHOOK_URL
