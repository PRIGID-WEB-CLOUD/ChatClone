import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Clock, Users, MapPin, Video, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events', searchQuery, activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeTab !== 'all') params.append('status', activeTab);
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Events & Webinars</h1>
            <p className="text-muted-foreground mt-2">Join live sessions and interactive learning experiences</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold">Events & Webinars</h1>
          <p className="text-muted-foreground mt-2">Join live sessions and interactive learning experiences</p>
        </div>
        <Button data-testid="create-event">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-events"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live" data-testid="tab-live">Live</TabsTrigger>
            <TabsTrigger value="ended" data-testid="tab-ended">Past</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {events && events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first event to get started!"}
          </p>
          <Button data-testid="create-first-event">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'upcoming': return 'bg-green-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`event-card-${event.id}`}>
      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white" />
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${getStatusColor(event.status)} text-white`}
          data-testid={`event-status-${event.id}`}
        >
          {event.status.toUpperCase()}
        </Badge>
        {event.price > 0 && (
          <Badge className="absolute top-3 left-3 bg-white text-black" variant="secondary">
            ${event.price}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2" data-testid={`event-title-${event.id}`}>
          {event.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.organizer?.profileImageUrl} />
            <AvatarFallback className="text-xs">
              {event.organizer?.firstName?.[0]}{event.organizer?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">
            by {event.organizer?.firstName} {event.organizer?.lastName}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatDateTime(event.startTime)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            {event.attendeesCount} attending
            {event.maxAttendees && ` / ${event.maxAttendees} max`}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {event.type.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {event.status === 'live' && (
            <Button className="flex-1" data-testid={`join-event-${event.id}`}>
              <Video className="w-4 h-4 mr-2" />
              Join Live
            </Button>
          )}
          {event.status === 'upcoming' && (
            <Button className="flex-1" variant="outline" data-testid={`register-event-${event.id}`}>
              Register
            </Button>
          )}
          {event.status === 'ended' && event.recordingUrl && (
            <Button className="flex-1" variant="outline" data-testid={`watch-recording-${event.id}`}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}