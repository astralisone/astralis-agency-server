import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { MarketplaceItem } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { generateProductStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo';
import { ArrowLeft, ShoppingCart, Star, Check, Package, Users, Heart, Share2, Plus, Minus, ChevronRight, Zap, Shield, Truck, Info, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItemResponse {
  items: MarketplaceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function MarketplaceProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<MarketplaceItem[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch all products and find the one with matching slug
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useApi<MarketplaceItemResponse>('/marketplace/products/search');

  useEffect(() => {
    if (productsData && slug) {
      const foundProduct = productsData.items.find(item => item.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        setError(null);
        
        // Fetch related products in the same category
        const related = productsData.items
          .filter(item => 
            item.category.id === foundProduct.category.id && 
            item.id !== foundProduct.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
        
        // Update document title and meta tags
        document.title = `${foundProduct.title} | Astralis One Marketplace`;
        
        // Add structured data for SEO
        const structuredData = generateProductStructuredData(foundProduct);
        const breadcrumbData = generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: 'Marketplace', url: '/marketplace' },
          { name: foundProduct.category.name, url: `/marketplace?category=${foundProduct.category.slug}` },
          { name: foundProduct.title, url: `/marketplace/${foundProduct.slug}` }
        ]);
        
        // Add or update structured data scripts
        let existingScript = document.querySelector('script[data-product-schema]');
        if (existingScript) {
          existingScript.remove();
        }
        let existingBreadcrumbScript = document.querySelector('script[data-breadcrumb-schema]');
        if (existingBreadcrumbScript) {
          existingBreadcrumbScript.remove();
        }
        
        const productScript = document.createElement('script');
        productScript.type = 'application/ld+json';
        productScript.setAttribute('data-product-schema', 'true');
        productScript.textContent = JSON.stringify(structuredData);
        document.head.appendChild(productScript);
        
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.setAttribute('data-breadcrumb-schema', 'true');
        breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(breadcrumbScript);
      } else {
        setError('Product not found');
      }
      setIsLoading(false);
    }
    if (productsError) {
      setError('Failed to load product');
      setIsLoading(false);
    }
  }, [productsData, productsError, slug]);
  
  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      addItem({
        id: product.id,
        name: product.title,
        price: parseFloat(product.discountPrice ?? product.price),
        image: product.imageUrl,
        quantity: quantity
      });
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.title}${quantity > 1 ? 's' : ''} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Handle wishlist toggle (placeholder functionality)
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product?.title} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };
  
  // Handle share
  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard.",
        });
      }
    } else if (product) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard.",
      });
    }
  };
  
  // Get multiple product images (using variations of the main image for demo)
  const getProductImages = (product: MarketplaceItem) => {
    const images = [product.imageUrl];
    // Add some variations for demo purposes (in real app, these would come from product data)
    if (product.imageUrl) {
      images.push(
        product.imageUrl.replace('600x400', '600x401'), // Slight variation
        product.imageUrl.replace('600x400', '601x400'), // Another variation
        product.imageUrl.replace('600x400', '602x400'), // Third variation
      );
    }
    return images.filter(Boolean);
  };

  if (isLoading || productsLoading) {
    return (
      <div className="container py-8 space-y-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-10 w-32" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div>
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            {error || 'The product you are looking for could not be found.'}
          </p>
          <Button asChild>
            <Link to="/marketplace">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link to="/marketplace">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/marketplace" className="hover:text-foreground">Marketplace</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/marketplace?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <img
                src={getProductImages(product)[selectedImage] || product.imageUrl}
                alt={product.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {product.discountPrice && (
                <Badge className="absolute top-4 right-4 bg-red-500">
                  Save {Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}%
                </Badge>
              )}
            </CardContent>
          </Card>
          
          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {getProductImages(product).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-border'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.svg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Actions */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{product.category.name}</Badge>
                  <Badge variant={product.status === 'AVAILABLE' ? 'default' : product.status === 'SOLD_OUT' ? 'destructive' : 'outline'}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleWishlistToggle}>
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(product.discountPrice ?? product.price)}
              {product.discountPrice && (
                <span className="text-lg text-muted-foreground line-through ml-3">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {product.discountPrice && (
              <div className="text-sm text-green-600 font-medium">
                You save {formatCurrency(parseFloat(product.price) - parseFloat(product.discountPrice))} 
                ({Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}% off)
              </div>
            )}
          </div>

          {/* Stock and Quantity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4" />
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                  Low stock
                </Badge>
              )}
            </div>
            
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0 h-8"
                    min={1}
                    max={product.stock}
                    type="number"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart / Purchase */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full" 
              disabled={product.stock === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </Button>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-xs text-muted-foreground">Free Shipping</div>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-xs text-muted-foreground">Secure Payment</div>
              </div>
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <div className="text-xs text-muted-foreground">Fast Delivery</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <Users className="w-4 h-4" />
              <span>Sold by {product.seller.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Link key={tag.id} to={`/marketplace?tag=${tag.slug}`}>
                        <Badge variant="outline" className="text-xs hover:bg-muted">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications">
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                      <span className="font-medium capitalize">{key.replace(/[_-]/g, ' ')}</span>
                      <span className="text-muted-foreground text-right">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Info className="w-8 h-8 mx-auto mb-2" />
                <p>No specifications available for this product.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <p>Reviews feature coming soon...</p>
              <p className="text-sm mt-2">Be the first to share your thoughts about this product.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Similar Products</CardTitle>
            <CardDescription>
              Other products in the {product.category.name} category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                      {relatedProduct.featured && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm line-clamp-2">{relatedProduct.title}</CardTitle>
                  </CardHeader>
                  <CardFooter className="pt-0 flex-col items-start space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-primary">
                        {formatCurrency(relatedProduct.discountPrice ?? relatedProduct.price)}
                      </span>
                      <Badge variant={relatedProduct.status === 'AVAILABLE' ? 'default' : 'secondary'} className="text-xs">
                        {relatedProduct.status === 'AVAILABLE' ? 'Available' : relatedProduct.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full" 
                      variant="outline"
                    >
                      <Link to={`/marketplace/${relatedProduct.slug}`}>
                        View Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to={`/marketplace?category=${product.category.slug}`}>
                  View All {product.category.name} Products
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}