import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageCircle, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Calendar,
  BookOpen,
  Star,
  ChevronRight,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function Groups() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-groups");

  const { data: myGroups, isLoading: myGroupsLoading } = useQuery({
    queryKey: ["/api/groups/my-groups"],
    retry: false,
  });

  const { data: allGroups, isLoading: allGroupsLoading } = useQuery({
    queryKey: ["/api/groups/all"],
    retry: false,
  });

  const { data: featuredGroups, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/groups/featured"],
    retry: false,
  });

  // Mock data for demonstration
  const mockMyGroups = [
    {
      id: 1,
      name: "React Developers",
      description: "A community for React enthusiasts and developers",
      memberCount: 1247,
      lastActivity: "2 hours ago",
      image: "/api/placeholder/80/80",
      role: "admin",
      unreadMessages: 5
    },
    {
      id: 2,
      name: "JavaScript Study Group",
      description: "Weekly discussions about JavaScript concepts",
      memberCount: 89,
      lastActivity: "1 day ago",
      image: "/api/placeholder/80/80",
      role: "member",
      unreadMessages: 2
    },
    {
      id: 3,
      name: "Full Stack Warriors",
      description: "End-to-end development discussions",
      memberCount: 432,
      lastActivity: "3 hours ago",
      image: "/api/placeholder/80/80",
      role: "moderator",
      unreadMessages: 0
    }
  ];

  const mockAllGroups = [
    {
      id: 4,
      name: "Python Masters",
      description: "Advanced Python programming and best practices",
      memberCount: 2156,
      category: "Programming",
      isPublic: true,
      tags: ["Python", "Advanced", "Best Practices"]
    },
    {
      id: 5,
      name: "UI/UX Design Hub",
      description: "Design principles, tools, and portfolio reviews",
      memberCount: 967,
      category: "Design",
      isPublic: true,
      tags: ["UI", "UX", "Design", "Figma"]
    },
    {
      id: 6,
      name: "Data Science Collective",
      description: "Machine learning, statistics, and data analysis",
      memberCount: 1834,
      category: "Data Science",
      isPublic: false,
      tags: ["ML", "Statistics", "Analytics"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <p className="text-muted-foreground mt-2">
            Connect with fellow learners and join study communities
          </p>
        </div>
        <Button data-testid="create-group">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-groups"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-groups" data-testid="tab-my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover" data-testid="tab-discover">Discover</TabsTrigger>
          <TabsTrigger value="featured" data-testid="tab-featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Groups Joined</p>
                    <p className="text-2xl font-bold">{mockMyGroups.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                    <p className="text-2xl font-bold">
                      {mockMyGroups.reduce((sum, group) => sum + group.unreadMessages, 0)}
                    </p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admin/Mod</p>
                    <p className="text-2xl font-bold">
                      {mockMyGroups.filter(g => g.role === 'admin' || g.role === 'moderator').length}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Groups List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Groups</h2>
            {mockMyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow" data-testid={`group-${group.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={group.image} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant={group.role === 'admin' ? 'default' : group.role === 'moderator' ? 'secondary' : 'outline'}>
                            {group.role}
                          </Badge>
                          {group.unreadMessages > 0 && (
                            <Badge variant="destructive">{group.unreadMessages}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {group.memberCount} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active {group.lastActivity}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/groups/${group.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Discover Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAllGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow" data-testid={`discover-group-${group.id}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{group.category}</Badge>
                        {!group.isPublic && <Badge variant="outline">Private</Badge>}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{group.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {group.memberCount.toLocaleString()} members
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" data-testid={`join-group-${group.id}`}>
                        {group.isPublic ? "Join Group" : "Request to Join"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Featured Groups</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">AI & Machine Learning</h3>
                        <p className="text-sm text-muted-foreground">3.2K members</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      Explore the latest in artificial intelligence, discuss ML algorithms, and share your AI projects.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        4.9 rating
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Very active
                      </div>
                    </div>
                    <Button className="w-full">Join Featured Group</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-500 text-white">WD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Web Development Masters</h3>
                        <p className="text-sm text-muted-foreground">2.8K members</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      From HTML/CSS basics to advanced React, join developers at all levels sharing knowledge and projects.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        4.8 rating
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Daily challenges
                      </div>
                    </div>
                    <Button className="w-full">Join Featured Group</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}