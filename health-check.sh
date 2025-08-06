#!/bin/bash
echo "🏥 Quick Health Check"
echo "===================="

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

# Check marketplace API
if curl -s http://localhost:4000/api/marketplace/products/search >/dev/null 2>&1; then
    echo "✅ Marketplace API working"
else
    echo "❌ Marketplace API not responding"
fi

echo ""
echo "Run 'npm run dev:enhanced' to start the server if not running"
