import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Star,
  Download,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  Heart,
  Share2,
  FileText,
  Image,
  Video,
  Code
} from "lucide-react";
import { Link } from "wouter";

export default function Marketplace() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/marketplace/products"],
    retry: false,
  });

  const { data: myProducts, isLoading: myProductsLoading } = useQuery({
    queryKey: ["/api/marketplace/my-products"],
    retry: false,
  });

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/marketplace/purchases"],
    retry: false,
  });

  // Mock data for demonstration
  const mockProducts = [
    {
      id: 1,
      title: "Complete React Components Library",
      description: "Premium collection of 200+ React components with TypeScript support",
      price: 49.99,
      originalPrice: 79.99,
      category: "code",
      type: "Digital Asset",
      thumbnail: "/api/placeholder/300/200",
      downloads: 1247,
      rating: 4.9,
      reviews: 156,
      seller: {
        name: "UI Masters",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      tags: ["React", "TypeScript", "Components", "UI"],
      featured: true,
      onSale: true
    },
    {
      id: 2,
      title: "Modern Dashboard Templates Pack",
      description: "5 responsive dashboard templates built with Tailwind CSS",
      price: 29.99,
      originalPrice: null,
      category: "template",
      type: "Template",
      thumbnail: "/api/placeholder/300/200",
      downloads: 892,
      rating: 4.7,
      reviews: 89,
      seller: {
        name: "Design Pro",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      tags: ["Dashboard", "Tailwind", "Template", "Responsive"],
      featured: false,
      onSale: false
    },
    {
      id: 3,
      title: "Full-Stack Project Starter Kit",
      description: "Complete MERN stack boilerplate with authentication and deployment",
      price: 19.99,
      originalPrice: null,
      category: "code",
      type: "Boilerplate",
      thumbnail: "/api/placeholder/300/200",
      downloads: 2341,
      rating: 4.8,
      reviews: 234,
      seller: {
        name: "CodeCraft Studios",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      tags: ["MERN", "Boilerplate", "Authentication", "Deployment"],
      featured: true,
      onSale: false
    },
    {
      id: 4,
      title: "Icon Pack - 1000+ SVG Icons",
      description: "Professional icon collection for web and mobile applications",
      price: 14.99,
      originalPrice: 24.99,
      category: "design",
      type: "Design Asset",
      thumbnail: "/api/placeholder/300/200",
      downloads: 3567,
      rating: 4.6,
      reviews: 445,
      seller: {
        name: "Icon Factory",
        avatar: "/api/placeholder/40/40",
        verified: false
      },
      tags: ["Icons", "SVG", "Design", "UI"],
      featured: false,
      onSale: true
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "code", label: "Code & Scripts" },
    { value: "template", label: "Templates" },
    { value: "design", label: "Design Assets" },
    { value: "ebook", label: "E-books" },
    { value: "course", label: "Courses" }
  ];

  const priceFilters = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "under20", label: "Under $20" },
    { value: "20to50", label: "$20 - $50" },
    { value: "over50", label: "Over $50" }
  ];

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'design': return <Image className="w-4 h-4" />;
      case 'course': return <Video className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover premium digital products and resources
          </p>
        </div>
        <Button data-testid="sell-product">
          <Plus className="w-4 h-4 mr-2" />
          Sell Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
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
          <SelectTrigger className="w-[180px]" data-testid="select-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-[140px]" data-testid="select-price">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            <Package className="w-4 h-4 mr-2" />
            All Products
          </TabsTrigger>
          <TabsTrigger value="featured" data-testid="tab-featured">
            <Star className="w-4 h-4 mr-2" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" data-testid="tab-trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="my-products" data-testid="tab-my-products">
            My Products
          </TabsTrigger>
          <TabsTrigger value="purchases" data-testid="tab-purchases">
            Purchases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">2.4K</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                    <p className="text-2xl font-bold">125K</p>
                  </div>
                  <Download className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sellers</p>
                    <p className="text-2xl font-bold">432</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">S</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">$89K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300 group overflow-hidden" data-testid={`product-${product.id}`}>
                <div className="relative">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      FEATURED
                    </div>
                  )}
                  {product.onSale && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      SALE
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    {getProductIcon(product.category)}
                    {product.type}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Button 
                      size="lg" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      data-testid={`preview-product-${product.id}`}
                    >
                      Quick Preview
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={product.seller.avatar} />
                      <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">{product.seller.name}</p>
                        {product.seller.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {product.rating} ({product.reviews})
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {product.downloads.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="w-9 h-9 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="w-9 h-9 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full" data-testid={`buy-product-${product.id}`}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-2">Featured Products</h3>
            <p className="text-muted-foreground">Hand-picked premium products by our team</p>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">Trending Products</h3>
            <p className="text-muted-foreground">Most popular products this week</p>
          </div>
        </TabsContent>

        <TabsContent value="my-products" className="space-y-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your Products</h3>
            <p className="text-muted-foreground mb-4">Manage your digital products and sales</p>
            <Button data-testid="create-first-product">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Product
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your Purchases</h3>
            <p className="text-muted-foreground mb-4">Access your downloaded products</p>
            <Button data-testid="browse-marketplace">
              <Search className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}