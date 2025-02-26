# Marketplace Data Fields Analysis

## Core Item Fields
- id (UUID): Unique identifier for each item
- title (String): Name/title of the item
- description (Text): Detailed description
- price (Decimal): Price in USD
- imageUrl (String): URL to the main product image
- category (String): Product category
- status (Enum): Available, Sold Out, Coming Soon
- createdAt (DateTime): When the item was created
- updatedAt (DateTime): Last update timestamp

## Optional Fields
- additionalImages (String[]): Array of additional image URLs
- specifications (JSON): Technical specifications
- features (String[]): Key features/bullet points
- tags (String[]): Search and filter tags
- stock (Integer): Available quantity
- discountPrice (Decimal): Sale price if applicable
- weight (Decimal): Product weight for shipping
- dimensions (JSON): Product dimensions (length, width, height)

## Seller Information
- sellerId (UUID): Reference to seller/vendor
- sellerName (String): Display name of seller
- sellerRating (Decimal): Average rating (0-5)
- sellerVerified (Boolean): Verification status

## Reviews & Ratings
- rating (Decimal): Average product rating
- reviewCount (Integer): Number of reviews
- reviews (Relation): One-to-many relation to Reviews table

## SEO & Meta
- slug (String): URL-friendly version of title
- metaTitle (String): SEO title
- metaDescription (String): SEO description
- keywords (String[]): SEO keywords

## System Fields
- featured (Boolean): Whether item is featured
- published (Boolean): Publication status
- sortOrder (Integer): Display order for featured items

## Relationships
- category (Many-to-One): Category relation
- reviews (One-to-Many): Product reviews
- orders (One-to-Many): Order history
- wishlist (Many-to-Many): User wishlists 