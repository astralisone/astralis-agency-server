#!/bin/bash
echo "🏥 Enhanced Health Check"
echo "======================="

# Check if server is responding
if curl -s http://localhost:4000/api/health >/dev/null 2>&1; then
    echo "✅ Server is running"
else
    echo "❌ Server not responding"
fi

# Check database
if npx prisma db pull >/dev/null 2>&1; then
    echo "✅ Database connected"
else
    echo "❌ Database connection issue"
fi

# Check enhanced marketplace API
if curl -s "http://localhost:4000/api/marketplace/enhanced/products/search" >/dev/null 2>&1; then
    echo "✅ Enhanced Marketplace API working"
else
    echo "❌ Enhanced Marketplace API not responding"
fi

# Check SEO routes
if curl -s http://localhost:4000/sitemap.xml >/dev/null 2>&1; then
    echo "✅ SEO routes working"
else
    echo "❌ SEO routes not responding"
fi

echo ""
echo "Run 'npm run dev:enhanced' to start the server if not running"
