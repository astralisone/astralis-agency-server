# Blog Data Fields Analysis

## Core Post Fields
- id (UUID): Unique identifier for each post
- title (String): Post title
- content (Text): Main post content in Markdown/HTML
- excerpt (Text): Short description/preview
- author (Relation): Reference to author
- publishedAt (DateTime): Publication date and time
- status (Enum): Draft, Published, Archived
- featuredImage (String): Main image URL
- createdAt (DateTime): Creation timestamp
- updatedAt (DateTime): Last update timestamp

## Author Fields
- id (UUID): Author identifier
- name (String): Author's full name
- email (String): Author's email
- bio (Text): Author biography
- avatar (String): Profile image URL
- role (Enum): Author, Editor, Admin
- social (JSON): Social media links

## Categorization
- category (String): Primary category
- tags (String[]): Array of tags
- series (String): Optional series/collection name

## SEO & Meta
- slug (String): URL-friendly title
- metaTitle (String): SEO title
- metaDescription (String): SEO description
- keywords (String[]): SEO keywords
- canonicalUrl (String): Canonical URL if needed

## Engagement
- viewCount (Integer): Number of views
- likeCount (Integer): Number of likes
- commentCount (Integer): Number of comments
- shareCount (Integer): Number of shares

## Comments
- comments (Relation): One-to-many relation to Comments table
- commentingEnabled (Boolean): Whether comments are allowed

## Media
- images (String[]): Additional image URLs
- attachments (JSON): Other media attachments
- coverImage (String): Optional cover image different from featured

## System Fields
- featured (Boolean): Whether post is featured
- pinned (Boolean): Whether post is pinned to top
- sortOrder (Integer): Display order for featured posts
- locale (String): Content language

## Relationships
- author (Many-to-One): Author relation
- category (Many-to-One): Category relation
- comments (One-to-Many): Post comments
- likes (Many-to-Many): User likes
- relatedPosts (Many-to-Many): Related articles 