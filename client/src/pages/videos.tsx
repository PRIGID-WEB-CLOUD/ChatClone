import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Play, Heart, MessageSquare, Eye, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos', searchQuery, activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeTab !== 'all') params.append('filter', activeTab);
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-2">Watch and share educational content</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-300 rounded-t-lg"></div>
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
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">Watch and share educational content</p>
        </div>
        <Button data-testid="upload-video">
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-videos"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-videos">All</TabsTrigger>
            <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
            <TabsTrigger value="my-videos" data-testid="tab-my-videos">My Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {videos && videos.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Be the first to upload a video!"}
          </p>
          <Button data-testid="upload-first-video">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`video-card-${video.id}`}>
      <div className="relative aspect-video bg-black group cursor-pointer">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
        {video.visibility === 'private' && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            Private
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2" data-testid={`video-title-${video.id}`}>
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={video.uploader?.profileImageUrl} />
            <AvatarFallback className="text-xs">
              {video.uploader?.firstName?.[0]}{video.uploader?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {video.uploader?.firstName} {video.uploader?.lastName}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(video.viewsCount)}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {video.likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {video.commentsCount}
            </div>
          </div>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}