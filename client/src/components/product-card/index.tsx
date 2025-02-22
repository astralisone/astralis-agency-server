import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          {product.status === "coming_soon" && (
            <Badge
              className="absolute top-4 right-4"
              variant="secondary"
            >
              Coming Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
        <ul className="space-y-2">
          {product.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="w-full flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price}</span>
          <Button
            onClick={() => navigate(`/checkout?product=${product.id}`)}
            disabled={product.status === "coming_soon"}
          >
            {product.status === "coming_soon" ? "Notify Me" : "Buy Now"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 