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
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Filter,
  Video,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  Play
} from "lucide-react";
import { Link } from "wouter";

export default function Events() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ["/api/events/upcoming"],
    retry: false,
  });

  const { data: myEvents, isLoading: myEventsLoading } = useQuery({
    queryKey: ["/api/events/my-events"],
    retry: false,
  });

  const { data: pastEvents, isLoading: pastEventsLoading } = useQuery({
    queryKey: ["/api/events/past"],
    retry: false,
  });

  // Mock data for demonstration
  const mockUpcomingEvents = [
    {
      id: 1,
      title: "React 19 New Features Deep Dive",
      description: "Explore the latest features in React 19 with hands-on examples and best practices",
      date: "2024-02-15",
      time: "10:00 AM PST",
      duration: "2 hours",
      type: "webinar",
      isLive: false,
      instructor: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        title: "Senior React Developer"
      },
      attendees: 234,
      maxAttendees: 500,
      price: 0,
      tags: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "AI/ML for Beginners: Workshop",
      description: "Introduction to machine learning concepts with practical Python examples",
      date: "2024-02-18",
      time: "2:00 PM EST",
      duration: "3 hours",
      type: "workshop",
      isLive: false,
      instructor: {
        name: "Dr. Michael Chen",
        avatar: "/api/placeholder/40/40",
        title: "AI Research Scientist"
      },
      attendees: 156,
      maxAttendees: 200,
      price: 29.99,
      tags: ["AI", "Machine Learning", "Python"],
      rating: 4.9,
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Live: Building Scalable APIs",
      description: "Real-time coding session on building production-ready APIs with Node.js",
      date: "2024-02-12",
      time: "6:00 PM UTC",
      duration: "1.5 hours",
      type: "live-coding",
      isLive: true,
      instructor: {
        name: "Alex Rodriguez",
        avatar: "/api/placeholder/40/40",
        title: "Backend Engineer"
      },
      attendees: 89,
      maxAttendees: 150,
      price: 0,
      tags: ["Node.js", "API", "Backend"],
      rating: 4.7,
      thumbnail: "/api/placeholder/300/200"
    }
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'workshop': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'live-coding': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events & Webinars</h1>
          <p className="text-muted-foreground mt-2">
            Join live learning sessions and workshops with industry experts
          </p>
        </div>
        <Button data-testid="create-event">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-events"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="live" data-testid="tab-live">
            <Video className="w-4 h-4 mr-2" />
            Live Now
          </TabsTrigger>
          <TabsTrigger value="my-events" data-testid="tab-my-events">
            My Events
          </TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">
            Past Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                    <p className="text-2xl font-bold">{mockUpcomingEvents.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Live Events</p>
                    <p className="text-2xl font-bold">
                      {mockUpcomingEvents.filter(e => e.isLive).length}
                    </p>
                  </div>
                  <Video className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                    <p className="text-2xl font-bold">
                      {mockUpcomingEvents.reduce((sum, event) => sum + event.attendees, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUpcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300 group overflow-hidden" data-testid={`event-${event.id}`}>
                <div className="relative">
                  <img 
                    src={event.thumbnail} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {event.isLive && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type.replace('-', ' ').toUpperCase()}
                  </div>
                  {event.price > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      ${event.price}
                    </div>
                  )}
                  {event.price === 0 && (
                    <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                      FREE
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={event.instructor.avatar} />
                      <AvatarFallback>{event.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{event.instructor.name}</p>
                      <p className="text-xs text-muted-foreground">{event.instructor.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs">{event.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.time} • {event.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {event.attendees}/{event.maxAttendees} attendees
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" data-testid={`register-event-${event.id}`}>
                      {event.isLive ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Join Live
                        </>
                      ) : (
                        'Register'
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <div className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Live Events</h3>
            <p className="text-muted-foreground mb-4">Join events happening right now</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">1 event live now</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your Events</h3>
            <p className="text-muted-foreground mb-4">Events you've registered for or created</p>
            <Button data-testid="browse-events">
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse Events
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Past Events</h3>
            <p className="text-muted-foreground">Access recordings and materials from previous events</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}