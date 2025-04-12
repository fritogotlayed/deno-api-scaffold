#!/bin/bash

# Run the Deno script to revert the last migration
deno run -A ./developer-scripts/scripts/revert-generated-migration.ts

# Check if the script executed successfully
if [ $? -eq 0 ]; then
  echo "Migration reverted successfully!"
else
  echo "Failed to revert migration."
  exit 1
fi