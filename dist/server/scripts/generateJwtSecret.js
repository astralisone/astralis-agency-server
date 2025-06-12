import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
/**
 * Generates a secure random string to use as JWT secret
 */
function generateJwtSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Updates the .env file with the new JWT secret
 */
function updateEnvFile(secret) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        // Check if JWT_SECRET already exists
        if (envContent.includes('JWT_SECRET=')) {
            // Replace existing JWT_SECRET
            envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${secret}`);
        }
        else {
            // Add JWT_SECRET if it doesn't exist
            envContent += `\n# JWT Authentication\nJWT_SECRET=${secret}\nJWT_EXPIRES_IN=7d\n`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log('✅ JWT secret has been generated and added to .env file');
        console.log('⚠️  Keep this secret secure and do not share it!');
    }
    catch (error) {
        console.error('Error updating .env file:', error);
        process.exit(1);
    }
}
// Main function
function main() {
    console.log('Generating secure JWT secret...');
    const secret = generateJwtSecret();
    updateEnvFile(secret);
}
// Run the script
main();
