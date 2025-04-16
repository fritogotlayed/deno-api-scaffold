curl --request POST \
  -i \
  --url http://localhost:8000/teams \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Frito Team With Address",
  "address": {
    "street1": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}'