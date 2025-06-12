#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf dist
mkdir -p dist

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build client
echo "🏗️ Building client..."
yarn build:client

# Build server
echo "🏗️ Building server..."
yarn build:server

# Create production structure
echo "📁 Creating production structure..."
mkdir -p dist/public
mkdir -p dist/server

# Copy client build to public directory
echo "📋 Copying client build..."
cp -r client/dist/* dist/public/

# Copy server build and necessary files
echo "📋 Copying server files..."
cp -r server/dist/* dist/server/
cp package.json dist/
cp yarn.lock dist/
cp .env.production dist/.env

# Create production package.json
echo "📝 Creating production package.json..."
node -e "
const pkg = require('./package.json');
const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  private: true,
  scripts: {
    start: 'node server/index.js'
  },
  dependencies: pkg.dependencies
};
delete prodPkg.dependencies['@types/node'];
delete prodPkg.dependencies['@types/bcrypt'];
delete prodPkg.dependencies.prisma;
require('fs').writeFileSync('dist/package.json', JSON.stringify(prodPkg, null, 2));
"

# Create deployment instructions
echo "📝 Creating deployment instructions..."
cat > dist/README.md << EOL
# Deployment Instructions

1. Upload all files via FTP to your hosting server
2. Install dependencies by running: \`yarn install\` or \`npm install\`
3. Make sure your environment variables are properly set in \`.env\`
4. Start the server: \`yarn start\` or \`npm start\`

## Environment Variables Required:
- DATABASE_URL
- JWT_SECRET
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- UPLOAD_DIR
- API_URL
- CLIENT_URL

## File Structure:
- \`public/\` - Static files and client-side application
- \`server/\` - Server-side application
- \`package.json\` - Production dependencies and scripts
- \`.env\` - Environment variables (make sure to configure)
EOL

# Create zip archive
echo "📦 Creating deployment package..."
cd dist
zip -r ../deploy.zip .

echo "✅ Build complete! Deploy.zip is ready for FTP upload."
echo "📁 You can find the deployment package at: ./deploy.zip" 