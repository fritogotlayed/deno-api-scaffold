curl --request POST \
  -i \
  --url http://localhost:8000/users \
  --header 'Content-Type: application/json' \
  --data '{
  "id": "frito",
  "name": "Frito Alline",
  "password": "example",
  "email": "frito@email.co"
}'