curl --request POST \
  -i \
  --url http://localhost:8000/teams \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Frito Team"
}'