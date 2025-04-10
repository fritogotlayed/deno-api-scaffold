#!/bin/bash

# Ensure we're in a git repository
if [ ! -d ".git" ]; then
  echo "Error: Not a git repository. Run this from the root of your git project."
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Run the various install scripts
echo "Installing hooks..."
./developer-scripts/install-pre-commit-hook.sh
