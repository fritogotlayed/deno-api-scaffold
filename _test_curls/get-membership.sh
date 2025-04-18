export TEAM_ID=ebcf7d0d-3230-4381-8303-7c0fa9956bab
export USER_ID=8d093a47-7b71-4d49-99a3-743e86390e91

curl --request GET \
  -i \
  --url http://localhost:8000/teams/$TEAM_ID/users/$USER_ID

echo ''

curl --request GET \
  -i \
  --url http://localhost:8000/users/$USER_ID/teams/$TEAM_ID
