-- ===== AstralisAgencyServer Complete Database Enhancements =====

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cart system
CREATE TABLE IF NOT EXISTS "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- Inventory tracking
CREATE TABLE IF NOT EXISTS "InventoryAdjustment" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "previousQuantity" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "adjustment" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryAdjustment_pkey" PRIMARY KEY ("id")
);

-- Product reviews
CREATE TABLE IF NOT EXISTS "ProductReview" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
    "title" TEXT,
    "comment" TEXT,
    "verified" BOOLEAN DEFAULT FALSE,
    "helpful" INTEGER DEFAULT 0,
    "status" TEXT DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- Wishlist
CREATE TABLE IF NOT EXISTS "Wishlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- Coupons
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "minimumAmount" DECIMAL(10,2),
    "maximumDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usageCount" INTEGER DEFAULT 0,
    "userUsageLimit" INTEGER DEFAULT 1,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- Enhanced Product columns
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sku" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weight" DECIMAL(8,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT FALSE;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT;

-- Enhanced Order columns
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "tax" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shipping" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingAddress" JSONB;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "billingAddress" JSONB;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- Performance indexes
CREATE INDEX IF NOT EXISTS "idx_products_status_featured" ON "Product"("status", "featured");
CREATE INDEX IF NOT EXISTS "idx_products_category_status" ON "Product"("categoryId", "status");
CREATE INDEX IF NOT EXISTS "idx_products_search" ON "Product" USING gin(to_tsvector('english', "name" || ' ' || COALESCE("description", '')));
CREATE INDEX IF NOT EXISTS "idx_orders_status_created" ON "Order"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_cart_user_id" ON "Cart"("userId");
CREATE INDEX IF NOT EXISTS "idx_cartitem_cart_product" ON "CartItem"("cartId", "productId");

-- Foreign keys
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Cart_userId_key" ON "Cart"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductReview_productId_userId_key" ON "ProductReview"("productId", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Wishlist_userId_productId_key" ON "Wishlist"("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");

-- Update existing data
UPDATE "Product" SET "sku" = 'SKU-' || "id" || '-' || UPPER(SUBSTRING(MD5("name"), 1, 6)) WHERE "sku" IS NULL;
UPDATE "Order" SET "orderNumber" = 'ORD-' || EXTRACT(EPOCH FROM "createdAt")::bigint || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 8)) WHERE "orderNumber" IS NULL;

-- Sample coupons
INSERT INTO "Coupon" ("code", "name", "description", "type", "value", "minimumAmount", "usageLimit", "startDate", "endDate", "isActive") VALUES
('WELCOME10', 'Welcome Discount', '10% off your first order', 'PERCENTAGE', 10.00, 50.00, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', TRUE),
('FREESHIP', 'Free Shipping', 'Free shipping on any order', 'FREE_SHIPPING', 0.00, NULL, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days', TRUE)
ON CONFLICT DO NOTHING;
