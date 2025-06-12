# Deployment Instructions

1. Upload all files via FTP to your hosting server
2. Install dependencies by running: `yarn install` or `npm install`
3. Make sure your environment variables are properly set in `.env`
4. Start the server: `yarn start` or `npm start`

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
- `public/` - Static files and client-side application
- `server/` - Server-side application
- `package.json` - Production dependencies and scripts
- `.env` - Environment variables (make sure to configure)
