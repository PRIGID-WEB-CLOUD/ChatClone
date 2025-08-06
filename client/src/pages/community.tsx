import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Search, 
  Plus, 
  Heart, 
  Share, 
  BookOpen,
  Play,
  Calendar,
  Star,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";

export default function Community() {
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const { data: communityFeed, isLoading: feedLoading } = useQuery({
    queryKey: ['/api/community/feed'],
    queryFn: async () => {
      // Mock data for demonstration - replace with real API call
      return [
        {
          id: 1,
          type: 'discussion',
          author: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            profileImageUrl: null
          },
          title: 'Best practices for React Hooks',
          content: 'I\'ve been working with React Hooks for a while now, and I wanted to share some best practices I\'ve learned...',
          createdAt: '2024-01-20T10:30:00Z',
          likesCount: 24,
          commentsCount: 8,
          tags: ['react', 'javascript', 'frontend']
        },
        {
          id: 2,
          type: 'question',
          author: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            profileImageUrl: null
          },
          title: 'How to optimize database queries?',
          content: 'I\'m working on a Node.js application and my database queries are getting slow. Any suggestions for optimization?',
          createdAt: '2024-01-20T09:15:00Z',
          likesCount: 12,
          commentsCount: 15,
          tags: ['nodejs', 'database', 'performance']
        },
        {
          id: 3,
          type: 'achievement',
          author: {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            profileImageUrl: null
          },
          title: 'Just completed the Full Stack Developer course!',
          content: '🎉 Finally finished the comprehensive Full Stack course. The project-based learning really helped me understand the concepts better.',
          createdAt: '2024-01-19T16:45:00Z',
          likesCount: 45,
          commentsCount: 12,
          tags: ['achievement', 'fullstack', 'milestone']
        }
      ];
    },
    retry: false,
  });

  const { data: popularGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/groups', '', '6'],
    retry: false,
  });

  const { data: featuredDiscussions, isLoading: discussionsLoading } = useQuery({
    queryKey: ['/api/community/featured'],
    queryFn: async () => {
      // Mock data - replace with real API
      return [
        {
          id: 1,
          title: 'Weekly Web Dev Challenge',
          excerpt: 'Join our weekly coding challenge and improve your skills',
          participants: 156,
          category: 'challenge'
        },
        {
          id: 2,
          title: 'Career Guidance for Developers',
          excerpt: 'Get advice from industry professionals',
          participants: 89,
          category: 'career'
        },
        {
          id: 3,
          title: 'Open Source Project Collaboration',
          excerpt: 'Find collaborators for your open source projects',
          participants: 234,
          category: 'collaboration'
        }
      ];
    },
    retry: false,
  });

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />;
      case 'question':
        return <MessageCircle className="w-4 h-4" />;
      case 'achievement':
        return <Star className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'discussion':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'question':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'achievement':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-2">Connect, share, and learn together</p>
        </div>
        <Button data-testid="create-post">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search discussions, questions, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="search-community"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-lg font-semibold">2,845</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discussions</p>
                <p className="text-lg font-semibold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-lg font-semibold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Heart className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Helpful Posts</p>
                <p className="text-lg font-semibold">892</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="feed" data-testid="tab-feed">Feed</TabsTrigger>
          <TabsTrigger value="discussions" data-testid="tab-discussions">Discussions</TabsTrigger>
          <TabsTrigger value="groups" data-testid="tab-groups">Groups</TabsTrigger>
          <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your thoughts, ask questions, or start a discussion..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[100px] resize-none"
                        data-testid="new-post-content"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            📷 Photo
                          </Button>
                          <Button variant="ghost" size="sm">
                            📊 Poll
                          </Button>
                          <Button variant="ghost" size="sm">
                            🔗 Link
                          </Button>
                        </div>
                        <Button 
                          disabled={!newPostContent.trim()}
                          data-testid="publish-post"
                        >
                          Publish
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Feed */}
              {feedLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {communityFeed?.map((post: any) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow" data-testid={`post-${post.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={post.author.profileImageUrl} />
                            <AvatarFallback>
                              {post.author.firstName[0]}{post.author.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {post.author.firstName} {post.author.lastName}
                              </h3>
                              <div className={`p-1 rounded-full ${getPostTypeColor(post.type)}`}>
                                {getPostTypeIcon(post.type)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">{post.title}</h4>
                              <p className="text-muted-foreground">{post.content}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-6">
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                  {post.likesCount}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  {post.commentsCount}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  <Share className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Groups</CardTitle>
                  <CardDescription>Join active communities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {popularGroups?.slice(0, 3).map((group: any) => (
                        <Link key={group.id} href={`/group/${group.id}`}>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={group.imageUrl} />
                              <AvatarFallback>
                                <Users className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{group.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {group.membersCount} members
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link href="/groups">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Groups
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Featured Discussions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Featured Discussions</CardTitle>
                  <CardDescription>Hot topics this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {discussionsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {featuredDiscussions?.map((discussion: any) => (
                        <div key={discussion.id} className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-1">{discussion.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{discussion.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {discussion.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {discussion.participants} participants
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Discussions</h3>
              <p className="text-muted-foreground mb-4">
                Browse and participate in community discussions
              </p>
              <Button>Browse Discussions</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGroups?.map((group: any) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={group.imageUrl} />
                      <AvatarFallback>
                        <Users className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.membersCount} members</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                  <Link href={`/group/${group.id}`}>
                    <Button size="sm" className="w-full">Join Group</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Trending Topics</h3>
              <p className="text-muted-foreground mb-4">
                Discover what's popular in the community right now
              </p>
              <Button>View Trending</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}