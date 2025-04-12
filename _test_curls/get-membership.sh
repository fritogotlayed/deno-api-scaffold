export TEAM_ID=18d364cc-9064-4ae3-ac4b-00b42b472d3f
export USER_ID=fcfe4773-6edb-453d-98ee-3527fa88f157

curl --request GET \
  -i \
  --url http://localhost:8000/teams/$TEAM_ID/users/$USER_ID

echo ''

curl --request GET \
  -i \
  --url http://localhost:8000/users/$USER_ID/teams/$TEAM_ID
