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
  Play, 
  Search, 
  Filter,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Upload,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

export default function Videos() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: trendingVideos, isLoading: trendingLoading } = useQuery({
    queryKey: ["/api/videos/trending"],
    retry: false,
  });

  const { data: myVideos, isLoading: myVideosLoading } = useQuery({
    queryKey: ["/api/videos/my-videos"],
    retry: false,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/videos/subscriptions"],
    retry: false,
  });

  // Mock data for demonstration
  const mockTrendingVideos = [
    {
      id: 1,
      title: "Master React Hooks in 2024: Complete Guide",
      description: "Learn all React hooks with practical examples and best practices",
      thumbnail: "/api/placeholder/300/200",
      duration: "24:15",
      views: 125000,
      likes: 4200,
      comments: 312,
      uploadDate: "2024-01-15",
      instructor: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        subscribers: 89000
      },
      category: "Programming",
      difficulty: "Intermediate",
      rating: 4.9
    },
    {
      id: 2,
      title: "UI/UX Design Principles for Developers",
      description: "Bridge the gap between design and development with these essential principles",
      thumbnail: "/api/placeholder/300/200",
      duration: "18:42",
      views: 87000,
      likes: 3100,
      comments: 187,
      uploadDate: "2024-01-20",
      instructor: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        subscribers: 156000
      },
      category: "Design",
      difficulty: "Beginner",
      rating: 4.7
    },
    {
      id: 3,
      title: "Advanced JavaScript Patterns You Should Know",
      description: "Deep dive into advanced JavaScript concepts and design patterns",
      thumbnail: "/api/placeholder/300/200",
      duration: "32:18",
      views: 203000,
      likes: 6800,
      comments: 421,
      uploadDate: "2024-01-10",
      instructor: {
        name: "Alex Rodriguez",
        avatar: "/api/placeholder/40/40",
        subscribers: 234000
      },
      category: "Programming",
      difficulty: "Advanced",
      rating: 4.8
    }
  ];

  const categories = [
    "all", "Programming", "Design", "Data Science", "Marketing", "Business"
  ];

  const formatDuration = (duration: string) => duration;
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>
          <p className="text-muted-foreground mt-2">
            Discover educational content from top instructors
          </p>
        </div>
        <Button data-testid="upload-video">
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-videos"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]" data-testid="select-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
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
          <TabsTrigger value="trending" data-testid="tab-trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" data-testid="tab-recent">
            <Calendar className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular" data-testid="tab-popular">
            <Star className="w-4 h-4 mr-2" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="my-videos" data-testid="tab-my-videos">
            My Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                    <p className="text-2xl font-bold">12.4K</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Watch Time</p>
                    <p className="text-2xl font-bold">1.2M hrs</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Instructors</p>
                    <p className="text-2xl font-bold">2.1K</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">I</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New Today</p>
                    <p className="text-2xl font-bold">127</p>
                  </div>
                  <Upload className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrendingVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-all duration-300 group" data-testid={`video-${video.id}`}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {formatDuration(video.duration)}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-t-lg flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        data-testid={`play-video-${video.id}`}
                      >
                        <Play className="w-6 h-6 mr-2" />
                        Play
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={video.instructor.avatar} />
                        <AvatarFallback>{video.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold line-clamp-2 text-sm leading-5">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {video.instructor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.instructor.subscribers.toLocaleString()} subscribers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViews(video.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {formatViews(video.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {video.rating}
                        </div>
                      </div>
                      <span>{formatDate(video.uploadDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {video.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Recent Videos</h3>
            <p className="text-muted-foreground">Stay up to date with the latest content</p>
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Most Popular</h3>
            <p className="text-muted-foreground">Top rated content from our community</p>
          </div>
        </TabsContent>

        <TabsContent value="my-videos" className="space-y-6">
          <div className="text-center py-12">
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your Video Library</h3>
            <p className="text-muted-foreground mb-4">Upload and manage your educational content</p>
            <Button data-testid="upload-first-video">
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Video
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}