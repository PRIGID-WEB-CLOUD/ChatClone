import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import CourseCard from "@/components/course-card";
import ProgressBar from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Star, TrendingUp, BookOpen, Users, Play, Calendar, ShoppingBag, Bell, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/my-enrollments"],
    retry: false,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/user"],
    retry: false,
  });

  const { data: featuredCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    retry: false,
  });

  const { data: recentVideos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos", "", "", "3"],
    retry: false,
  });

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events", "", "upcoming"],
    retry: false,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentActivity = [
    {
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      title: "Completed 'React Hooks Deep Dive'",
      time: "2 hours ago",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Star className="w-4 h-4 text-green-500" />,
      title: "Earned 'JavaScript Expert' badge",
      time: "1 day ago",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      title: "Joined 'Frontend Developers' group",
      time: "2 days ago",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  const unreadNotifications = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="welcome-message">
            Welcome back, {user?.firstName || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>
        {unreadNotifications > 0 && (
          <Link href="/notifications">
            <Button variant="outline" size="sm" data-testid="notifications-button">
              <Bell className="w-4 h-4 mr-2" />
              {unreadNotifications} new
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/groups">
          <Card className="hover:shadow-md transition-all hover:scale-105 cursor-pointer" data-testid="quick-groups">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Groups</h3>
              <p className="text-sm text-muted-foreground">Join discussions</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/videos">
          <Card className="hover:shadow-md transition-all hover:scale-105 cursor-pointer" data-testid="quick-videos">
            <CardContent className="p-6 text-center">
              <Play className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Videos</h3>
              <p className="text-sm text-muted-foreground">Watch content</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/events">
          <Card className="hover:shadow-md transition-all hover:scale-105 cursor-pointer" data-testid="quick-events">
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Events</h3>
              <p className="text-sm text-muted-foreground">Join webinars</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/marketplace">
          <Card className="hover:shadow-md transition-all hover:scale-105 cursor-pointer" data-testid="quick-marketplace">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Marketplace</h3>
              <p className="text-sm text-muted-foreground">Buy resources</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours This Week</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : userStats?.totalHoursLearned || "12.5"}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Courses Enrolled</p>
                <p className="text-2xl font-bold">
                  {enrollmentsLoading ? "..." : Array.isArray(enrollments) ? enrollments.length : 0}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : userStats?.completedCourses || 3}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">14 days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <Link href="/my-courses">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {enrollmentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : Array.isArray(enrollments) && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.slice(0, 4).map((enrollment: any) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{enrollment.course?.title || "Course Title"}</h3>
                        <p className="text-sm text-muted-foreground">{enrollment.course?.instructor || "Instructor"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress || 0}%</span>
                      </div>
                      <ProgressBar progress={enrollment.progress || 0} />
                    </div>
                    <Link href={`/course/${enrollment.courseId}`}>
                      <Button className="w-full mt-4">Continue</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                <Link href="/courses">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <Link href="/events">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event: any) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              )}
            </CardContent>
          </Card>

          {/* Latest Videos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Latest Videos</CardTitle>
              <Link href="/videos">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(recentVideos) && recentVideos.length > 0 ? (
                <div className="space-y-4">
                  {recentVideos.slice(0, 3).map((video: any) => (
                    <div key={video.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Play className="w-4 h-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-1">{video.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {video.viewsCount} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No videos available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}