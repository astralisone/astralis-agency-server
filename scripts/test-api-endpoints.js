#!/usr/bin/env node

/**
 * API Endpoint Test Script
 * 
 * This script tests all API endpoints to ensure they are working correctly.
 * It makes requests to each endpoint and checks the response status and structure.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:4000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@astralis.one';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '45tr4l15';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test function
async function testEndpoints() {
  console.log(chalk.blue('=== API Endpoints Test ==='));
  console.log(chalk.gray(`Base URL: ${API_BASE_URL}`));
  console.log('');

  let authToken = null;
  let userId = null;

  // Test health endpoint
  try {
    console.log(chalk.yellow('Testing Health Endpoint...'));
    const healthResponse = await makeRequest('/api/health');
    
    if (healthResponse.status === 200 && healthResponse.data.message === 'OK') {
      console.log(chalk.green('✓ Health endpoint is working'));
      console.log(chalk.gray(`  - Uptime: ${healthResponse.data.uptime}`));
      console.log(chalk.gray(`  - Database connected: ${healthResponse.data.database?.connected}`));
      console.log(chalk.gray(`  - Environment: ${healthResponse.data.env}`));
    } else {
      console.log(chalk.red('✗ Health endpoint failed'));
      console.log(chalk.red(`  - Status: ${healthResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(healthResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Health endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test authentication
  try {
    console.log(chalk.yellow('Testing Authentication...'));
    
    // Login
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log(chalk.green('✓ Login successful'));
      authToken = loginResponse.data.token;
      userId = loginResponse.data.user.id;
      console.log(chalk.gray(`  - User: ${loginResponse.data.user.name} (${loginResponse.data.user.email})`));
      console.log(chalk.gray(`  - Role: ${loginResponse.data.user.role}`));
    } else {
      console.log(chalk.red('✗ Login failed'));
      console.log(chalk.red(`  - Status: ${loginResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(loginResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Authentication test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // If authentication failed, we can't test protected endpoints
  if (!authToken) {
    console.log(chalk.red('Authentication failed. Cannot test protected endpoints.'));
    return;
  }

  // Test products endpoint
  try {
    console.log(chalk.yellow('Testing Products Endpoint...'));
    const productsResponse = await makeRequest('/api/products');
    
    if (productsResponse.status === 200) {
      console.log(chalk.green('✓ Products endpoint is working'));
      console.log(chalk.gray(`  - Products count: ${productsResponse.data.length || 'N/A'}`));
    } else {
      console.log(chalk.red('✗ Products endpoint failed'));
      console.log(chalk.red(`  - Status: ${productsResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(productsResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Products endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test testimonials endpoint
  try {
    console.log(chalk.yellow('Testing Testimonials Endpoint...'));
    const testimonialsResponse = await makeRequest('/api/testimonials');
    
    if (testimonialsResponse.status === 200) {
      console.log(chalk.green('✓ Testimonials endpoint is working'));
      console.log(chalk.gray(`  - Testimonials count: ${testimonialsResponse.data.length || 'N/A'}`));
    } else {
      console.log(chalk.red('✗ Testimonials endpoint failed'));
      console.log(chalk.red(`  - Status: ${testimonialsResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(testimonialsResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Testimonials endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test blog endpoint
  try {
    console.log(chalk.yellow('Testing Blog Endpoint...'));
    const blogResponse = await makeRequest('/api/blog');
    
    if (blogResponse.status === 200) {
      console.log(chalk.green('✓ Blog endpoint is working'));
      const postsCount = blogResponse.data.data?.posts?.length || 'N/A';
      console.log(chalk.gray(`  - Posts count: ${postsCount}`));
    } else {
      console.log(chalk.red('✗ Blog endpoint failed'));
      console.log(chalk.red(`  - Status: ${blogResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(blogResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Blog endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test marketplace endpoint
  try {
    console.log(chalk.yellow('Testing Marketplace Endpoint...'));
    const marketplaceResponse = await makeRequest('/api/marketplace');
    
    if (marketplaceResponse.status === 200) {
      console.log(chalk.green('✓ Marketplace endpoint is working'));
      const itemsCount = marketplaceResponse.data.data?.items?.length || 'N/A';
      console.log(chalk.gray(`  - Items count: ${itemsCount}`));
    } else {
      console.log(chalk.red('✗ Marketplace endpoint failed'));
      console.log(chalk.red(`  - Status: ${marketplaceResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(marketplaceResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Marketplace endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test admin endpoint (protected)
  try {
    console.log(chalk.yellow('Testing Admin Dashboard Endpoint...'));
    const adminResponse = await makeRequest('/api/admin/dashboard', 'GET', null, authToken);
    
    if (adminResponse.status === 200) {
      console.log(chalk.green('✓ Admin dashboard endpoint is working'));
      console.log(chalk.gray(`  - Users count: ${adminResponse.data.data?.counts?.users || 'N/A'}`));
      console.log(chalk.gray(`  - Products count: ${adminResponse.data.data?.counts?.products || 'N/A'}`));
      console.log(chalk.gray(`  - Blog posts count: ${adminResponse.data.data?.counts?.blogPosts || 'N/A'}`));
    } else {
      console.log(chalk.red('✗ Admin dashboard endpoint failed'));
      console.log(chalk.red(`  - Status: ${adminResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(adminResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Admin dashboard endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  // Test contact endpoint
  try {
    console.log(chalk.yellow('Testing Contact Endpoint...'));
    const contactResponse = await makeRequest('/api/contact', 'POST', {
      name: 'API Test',
      email: 'test@example.com',
      subject: 'API Test Message',
      message: 'This is a test message from the API test script.',
    });
    
    if (contactResponse.status === 201 || contactResponse.status === 200) {
      console.log(chalk.green('✓ Contact endpoint is working'));
    } else {
      console.log(chalk.red('✗ Contact endpoint failed'));
      console.log(chalk.red(`  - Status: ${contactResponse.status}`));
      console.log(chalk.red(`  - Error: ${JSON.stringify(contactResponse.data)}`));
    }
  } catch (error) {
    console.log(chalk.red('✗ Contact endpoint test failed with error'));
    console.log(chalk.red(`  - ${error.message}`));
  }
  console.log('');

  console.log(chalk.blue('=== Test Summary ==='));
  console.log(chalk.green('All endpoints tested.'));
  console.log(chalk.yellow('Note: Some endpoints may have failed if the corresponding database tables are empty or if the API implementation is incomplete.'));
}

// Run the tests
testEndpoints().catch(error => {
  console.error('Test script error:', error);
  process.exit(1);
}); 