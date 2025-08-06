import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Check, 
  X, 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  Heart,
  Settings,
  Trash2,
  MoreHorizontal,
  Filter,
  BellOff
} from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
  });

  // Mock data for demonstration
  const mockNotifications = [
    {
      id: 1,
      type: "course_update",
      title: "New lesson added to React Masterclass",
      message: "The instructor has added 'Advanced Hooks Patterns' to your enrolled course.",
      timestamp: "2024-01-20T10:30:00Z",
      isRead: false,
      isImportant: true,
      actionUrl: "/course/1",
      avatar: "/api/placeholder/40/40",
      source: "Sarah Johnson"
    },
    {
      id: 2,
      type: "message",
      title: "New message from Alex Rodriguez",
      message: "Hey! I saw your project on GitHub. Would love to collaborate on the API design.",
      timestamp: "2024-01-20T09:15:00Z",
      isRead: false,
      isImportant: false,
      actionUrl: "/messages/alex",
      avatar: "/api/placeholder/40/40",
      source: "Alex Rodriguez"
    },
    {
      id: 3,
      type: "event_reminder",
      title: "Webinar starting in 1 hour",
      message: "Don't forget: 'Building Scalable APIs' webinar starts at 2:00 PM EST.",
      timestamp: "2024-01-20T08:00:00Z",
      isRead: true,
      isImportant: true,
      actionUrl: "/events/3",
      avatar: "/api/placeholder/40/40",
      source: "Learning Platform"
    },
    {
      id: 4,
      type: "achievement",
      title: "Achievement unlocked!",
      message: "Congratulations! You've completed 5 courses and earned the 'Dedicated Learner' badge.",
      timestamp: "2024-01-19T16:45:00Z",
      isRead: true,
      isImportant: false,
      actionUrl: "/profile",
      avatar: "/api/placeholder/40/40",
      source: "Learning Platform"
    },
    {
      id: 5,
      type: "course_completion",
      title: "Course completed!",
      message: "You've successfully completed 'JavaScript Fundamentals'. Don't forget to leave a review!",
      timestamp: "2024-01-19T14:20:00Z",
      isRead: true,
      isImportant: false,
      actionUrl: "/course/2",
      avatar: "/api/placeholder/40/40",
      source: "Learning Platform"
    },
    {
      id: 6,
      type: "group_activity",
      title: "New discussion in React Developers",
      message: "Maria started a discussion about 'React 19 Features' in your study group.",
      timestamp: "2024-01-19T11:30:00Z",
      isRead: true,
      isImportant: false,
      actionUrl: "/groups/1",
      avatar: "/api/placeholder/40/40",
      source: "Maria Garcia"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_update':
      case 'course_completion':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'event_reminder':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'group_activity':
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const importantCount = mockNotifications.filter(n => n.isImportant && !n.isRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your learning activities and messages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="notification-settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" data-testid="mark-all-read">
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockNotifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Important</p>
                <p className="text-2xl font-bold">{importantCount}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({mockNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" data-testid="tab-unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="important" data-testid="tab-important">
            Important ({importantCount})
          </TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''
              }`}
              data-testid={`notification-${notification.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>{notification.source[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                            {notification.title}
                          </h3>
                          {notification.isImportant && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{notification.source}</span>
                          <span>•</span>
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.isRead && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            data-testid={`mark-read-${notification.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          data-testid={`delete-${notification.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button size="sm" variant="outline" data-testid={`action-${notification.id}`}>
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {mockNotifications
            .filter(n => !n.isRead)
            .map((notification) => (
              <Card 
                key={notification.id} 
                className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10 transition-all duration-200 hover:shadow-md"
                data-testid={`unread-notification-${notification.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.source[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                              {notification.title}
                            </h3>
                            {notification.isImportant && (
                              <Badge variant="destructive" className="text-xs">Important</Badge>
                            )}
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span>•</span>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            data-testid={`mark-read-unread-${notification.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            data-testid={`delete-unread-${notification.id}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {mockNotifications.filter(n => !n.isRead).length === 0 && (
            <div className="text-center py-12">
              <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No unread notifications</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="important" className="space-y-4">
          {mockNotifications
            .filter(n => n.isImportant)
            .map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 border-l-red-500 transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                }`}
                data-testid={`important-notification-${notification.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.source[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-red-900 dark:text-red-100' : ''}`}>
                              {notification.title}
                            </h3>
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span>•</span>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {mockNotifications
            .filter(n => n.type === 'message')
            .map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                }`}
                data-testid={`message-notification-${notification.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.source[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-green-900 dark:text-green-100' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span>•</span>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" data-testid={`reply-message-${notification.id}`}>
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {mockNotifications.filter(n => n.type === 'message').length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Messages</h3>
              <p className="text-muted-foreground">You don't have any message notifications</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}