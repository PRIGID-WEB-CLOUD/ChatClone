import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import ProgressBar from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Star, TrendingUp, BookOpen, Users } from "lucide-react";

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

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/my-enrollments"],
    retry: false,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/user"],
    retry: false,
  });

  const { data: featuredCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
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
      bgColor: "bg-blue-50"
    },
    {
      icon: <Star className="w-4 h-4 text-green-500" />,
      title: "Submitted assignment 'Design System'",
      time: "1 day ago",
      bgColor: "bg-green-50"
    }
  ];

  const upcomingClasses = [
    {
      title: "Advanced JavaScript",
      time: "Today, 2:00 PM",
      color: "border-l-primary"
    },
    {
      title: "Design Workshop",
      time: "Tomorrow, 10:00 AM",
      color: "border-l-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
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
                  <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollmentsLoading ? "..." : enrollments?.length || "0"}
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : userStats?.completedCourses || "3"}
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
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">7 days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Continue Learning
                  <Button variant="ghost" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollmentsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                      ))}
                    </div>
                  ) : enrollments?.slice(0, 2).map((enrollment) => (
                    <Card key={enrollment.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={enrollment.courseThumbnail || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                          alt={enrollment.courseTitle}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{enrollment.courseTitle}</h4>
                          <p className="text-sm text-gray-600 mb-3">{enrollment.courseDescription}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">Progress</span>
                            <span className="text-sm text-gray-500">{enrollment.progress}%</span>
                          </div>
                          <ProgressBar progress={enrollment.progress} className="mt-2" />
                        </div>
                      </div>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No courses enrolled yet. Start learning today!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 ${activity.bgColor} rounded-lg`}>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coursesLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
                      ))}
                    </div>
                  ) : featuredCourses?.slice(0, 2).map((course) => (
                    <CourseCard key={course.id} course={course} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* This Week Stats */}
            <Card className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">This Week</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-100 text-sm">Hours Learned</p>
                    <p className="text-2xl font-bold">12.5</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Courses Completed</p>
                    <p className="text-2xl font-bold">{userStats?.completedCourses || 0}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Certificates Earned</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((classItem, index) => (
                    <div key={index} className={`border-l-4 ${classItem.color} pl-3`}>
                      <p className="text-sm font-medium text-gray-900">{classItem.title}</p>
                      <p className="text-xs text-gray-500">{classItem.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="ghost">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
