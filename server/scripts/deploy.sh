#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting deployment process...${NC}"

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}doctl is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if authenticated with DigitalOcean
if ! doctl account get &> /dev/null; then
    echo -e "${RED}Not authenticated with DigitalOcean.${NC}"
    echo "Please run: doctl auth init"
    exit 1
fi

# Build the client
echo -e "${BLUE}Building client...${NC}"
cd ../../client
if ! npm install; then
    echo -e "${RED}Client npm install failed${NC}"
    exit 1
fi

if ! npm run build; then
    echo -e "${RED}Client build failed${NC}"
    exit 1
fi

# Return to server directory
cd ../server

# Build the server
echo -e "${BLUE}Building server...${NC}"
if ! npm install; then
    echo -e "${RED}Server npm install failed${NC}"
    exit 1
fi

if ! npm run build; then
    echo -e "${RED}Server build failed${NC}"
    exit 1
fi

# Get the app ID (you'll need to set this up first time)
APP_ID=$(doctl apps list --format ID --no-header | head -n 1)

if [ -z "$APP_ID" ]; then
    echo -e "${RED}No app found. Creating new app...${NC}"
    
    # Create new app from spec
    doctl apps create --spec .do/app.spec.yaml
    
    # Get the new app ID
    APP_ID=$(doctl apps list --format ID --no-header | head -n 1)
    
    if [ -z "$APP_ID" ]; then
        echo -e "${RED}Failed to create app${NC}"
        exit 1
    fi
fi

# Deploy the app
echo -e "${BLUE}Deploying to DigitalOcean App Platform...${NC}"
if doctl apps update $APP_ID --spec .do/app.spec.yaml; then
    echo -e "${GREEN}Deployment initiated successfully!${NC}"
    
    # Get the app URL
    APP_URL=$(doctl apps get $APP_ID --format DefaultIngress --no-header)
    echo -e "${GREEN}App is being deployed to: ${APP_URL}${NC}"
    echo -e "${BLUE}You can monitor the deployment status at: https://cloud.digitalocean.com/apps${NC}"
else
    echo -e "${RED}Deployment failed${NC}"
    exit 1
fi

# Create a deployment
echo -e "${BLUE}Creating new deployment...${NC}"
if doctl apps create-deployment $APP_ID; then
    echo -e "${GREEN}Deployment created successfully!${NC}"
else
    echo -e "${RED}Failed to create deployment${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "${BLUE}Note: It may take a few minutes for the changes to be fully deployed.${NC}" 