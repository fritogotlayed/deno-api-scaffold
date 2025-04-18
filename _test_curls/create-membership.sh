curl --request POST \
  -i \
  --url http://localhost:8000/teams/18d364cc-9064-4ae3-ac4b-00b42b472d3f/memberships \
  --header 'Content-Type: application/json' \
  --data '{
  "userId": "fcfe4773-6edb-453d-98ee-3527fa88f157"
}'