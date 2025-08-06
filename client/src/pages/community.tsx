import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Search, 
  Plus,
  TrendingUp,
  Calendar,
  Heart,
  Reply,
  Share,
  Bookmark
} from "lucide-react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  const discussionTopics = [
    {
      id: 1,
      title: "Best practices for React hooks",
      author: "Sarah Chen",
      authorAvatar: "",
      category: "Development",
      replies: 24,
      likes: 45,
      lastActivity: "2 hours ago",
      tags: ["React", "JavaScript", "Frontend"],
      excerpt: "I've been working with React hooks for a while now and wanted to share some patterns I've found useful..."
    },
    {
      id: 2,
      title: "Career transition to UX Design",
      author: "Mike Johnson",
      authorAvatar: "",
      category: "Career",
      replies: 18,
      likes: 32,
      lastActivity: "4 hours ago",
      tags: ["UXDesign", "Career", "Transition"],
      excerpt: "Looking for advice on transitioning from web development to UX design. What resources helped you the most?"
    },
    {
      id: 3,
      title: "Machine Learning study group",
      author: "Dr. Emily Rodriguez",
      authorAvatar: "",
      category: "Study Groups",
      replies: 67,
      likes: 128,
      lastActivity: "1 day ago",
      tags: ["MachineLearning", "StudyGroup", "Python"],
      excerpt: "Starting a weekly ML study group. We'll be working through Andrew Ng's course together..."
    }
  ];

  const trendingTopics = [
    { name: "React 18", posts: 45 },
    { name: "Career Advice", posts: 32 },
    { name: "JavaScript", posts: 78 },
    { name: "Python", posts: 56 },
    { name: "UX Design", posts: 23 },
    { name: "Data Science", posts: 41 },
  ];

  const studyGroups = [
    {
      id: 1,
      name: "Web Development Bootcamp",
      members: 245,
      category: "Development",
      description: "Learning full-stack web development together",
      nextMeeting: "Tomorrow at 7 PM",
      isJoined: true
    },
    {
      id: 2,
      name: "Data Science Study Circle",
      members: 189,
      category: "Data Science",
      description: "Weekly discussions on DS concepts and projects",
      nextMeeting: "Sunday at 3 PM",
      isJoined: false
    },
    {
      id: 3,
      name: "UX/UI Design Workshop",
      members: 156,
      category: "Design",
      description: "Collaborative design challenges and critiques",
      nextMeeting: "Friday at 6 PM",
      isJoined: true
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow learners, share knowledge, and grow together</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">2,543</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-600">Discussions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Study Groups</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Events This Week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>
                
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <TabsContent value="discussions" className="space-y-6">
                {discussionTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(topic.author)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                              {topic.title}
                            </h3>
                            <Badge variant="outline">{topic.category}</Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{topic.excerpt}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {topic.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>by {topic.author}</span>
                              <span>•</span>
                              <span>{topic.lastActivity}</span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{topic.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Reply className="w-4 h-4" />
                                <span className="text-sm">{topic.replies}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="study-groups" className="space-y-6">
                {studyGroups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                          <p className="text-gray-600 mb-2">{group.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {group.members} members
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {group.nextMeeting}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{group.category}</Badge>
                          <Button 
                            variant={group.isJoined ? "outline" : "default"}
                            size="sm"
                          >
                            {group.isJoined ? "Joined" : "Join Group"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600 mb-4">Check back later for community events and workshops</p>
                    <Button>Create Event</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">#{topic.name}</span>
                      <span className="text-xs text-gray-500">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Be respectful and constructive</p>
                <p>• Share knowledge freely</p>
                <p>• Help others learn and grow</p>
                <p>• Keep discussions on-topic</p>
                <p>• No spam or self-promotion</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create Study Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}