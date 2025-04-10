#!/bin/bash

# Ensure we're in a git repository
if [ ! -d ".git" ]; then
  echo "Error: Not a git repository. Run this from the root of your git project."
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create/replace the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

deno task tool:checks
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "Pre-commit hook installed successfully!"
