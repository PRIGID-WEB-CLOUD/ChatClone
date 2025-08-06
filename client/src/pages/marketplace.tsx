import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShoppingBag, Download, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/marketplace', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('type', selectedCategory);
      const response = await fetch(`/api/marketplace?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "digital", label: "Digital Resources" },
    { value: "template", label: "Templates" },
    { value: "ebook", label: "E-books" },
    { value: "software", label: "Software" },
    { value: "design", label: "Design Assets" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Discover and sell digital resources</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-300 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">Discover and sell digital resources</p>
        </div>
        <Button data-testid="create-product">
          <Plus className="w-4 h-4 mr-2" />
          Sell Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-products"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48" data-testid="category-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products && products.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Be the first to list a product!"}
          </p>
          <Button data-testid="sell-first-product">
            <Plus className="w-4 h-4 mr-2" />
            Sell Product
          </Button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`product-card-${product.id}`}>
      <div className="relative aspect-square bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant="secondary">
          {product.type.replace('_', ' ')}
        </Badge>
        {product.status === 'sold_out' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Sold Out</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold line-clamp-2 flex-1" data-testid={`product-title-${product.id}`}>
            {product.title}
          </h3>
          <div className="text-lg font-bold text-primary ml-2">
            {formatPrice(product.price)}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={product.seller?.profileImageUrl} />
            <AvatarFallback className="text-xs">
              {product.seller?.firstName?.[0]}{product.seller?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {product.seller?.firstName} {product.seller?.lastName}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.reviewsCount})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Download className="w-3 h-3" />
            {product.downloadCount}
          </div>
        </div>

        <Button 
          className="w-full" 
          disabled={product.status === 'sold_out'}
          data-testid={`buy-product-${product.id}`}
        >
          {product.status === 'sold_out' ? 'Sold Out' : `Buy for ${formatPrice(product.price)}`}
        </Button>
      </CardContent>
    </Card>
  );
}