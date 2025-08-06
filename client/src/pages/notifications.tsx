import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Play, 
  Calendar, 
  Star,
  ShoppingBag,
  UserPlus,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['/api/notifications', activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('type', activeTab);
      const response = await fetch(`/api/notifications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention': return MessageSquare;
      case 'group_invite': return Users;
      case 'course_update': return BookOpen;
      case 'video_comment': return Play;
      case 'event_alert': return Calendar;
      case 'new_follower': return UserPlus;
      case 'badge_earned': return Star;
      case 'purchase_complete': return ShoppingBag;
      default: return Bell;
    }
  };

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">Stay updated with your activity</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">Stay updated with your activity</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            data-testid="mark-all-read"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" data-testid="notification-settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-notifications">
            All {notifications?.length ? `(${notifications.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="unread" data-testid="tab-unread">
            Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="mentions" data-testid="tab-mentions">Mentions</TabsTrigger>
          <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
          <TabsTrigger value="social" data-testid="tab-social">Social</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications?.map((notification: any) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={() => markAsReadMutation.mutate(notification.id)}
          />
        ))}
      </div>

      {notifications && notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            When you have notifications, they'll appear here
          </p>
        </div>
      )}
    </div>
  );
}

function NotificationCard({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: any; 
  onMarkAsRead: () => void;
}) {
  const IconComponent = getNotificationIcon(notification.type);
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className={`transition-all hover:shadow-sm cursor-pointer ${
        notification.isRead ? 'opacity-60' : 'border-primary/20 bg-primary/5'
      }`}
      onClick={onMarkAsRead}
      data-testid={`notification-${notification.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${notification.isRead ? 'bg-muted' : 'bg-primary/10'}`}>
            <IconComponent className={`w-4 h-4 ${notification.isRead ? 'text-muted-foreground' : 'text-primary'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm" data-testid={`notification-title-${notification.id}`}>
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(notification.createdAt)}
                </span>
                {!notification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead();
                    }}
                    data-testid={`mark-read-${notification.id}`}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {notification.actionUrl && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-2 text-xs text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = notification.actionUrl;
                }}
                data-testid={`notification-action-${notification.id}`}
              >
                View Details →
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'mention': return MessageSquare;
    case 'group_invite': return Users;
    case 'course_update': return BookOpen;
    case 'video_comment': return Play;
    case 'event_alert': return Calendar;
    case 'new_follower': return UserPlus;
    case 'badge_earned': return Star;
    case 'purchase_complete': return ShoppingBag;
    default: return Bell;
  }
}