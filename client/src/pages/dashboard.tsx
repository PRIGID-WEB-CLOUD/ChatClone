import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import ProgressBar from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Star,
  Award,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
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

  const { data: myCourses, isLoading: myCoursesLoading } = useQuery({
    queryKey: ["/api/my-courses"],
    retry: false,
    enabled: user?.role === "instructor",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const inProgressCourses = enrollments?.filter(e => e.status === 'active' && e.progress < 100) || [];
  const completedCourses = enrollments?.filter(e => e.status === 'completed' || e.progress >= 100) || [];

  const recentActivity = [
    {
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      title: "Completed lesson in React Development",
      time: "2 hours ago",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Star className="w-4 h-4 text-yellow-500" />,
      title: "Received certificate for JavaScript Basics",
      time: "1 day ago",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <Users className="w-4 h-4 text-green-500" />,
      title: "Joined study group discussion",
      time: "2 days ago",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === "instructor" ? "Instructor Dashboard" : "My Learning Dashboard"}
          </h1>
          <p className="text-gray-600">
            {user?.role === "instructor" 
              ? "Manage your courses and track student progress"
              : "Track your progress and continue your learning journey"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "instructor" ? "Total Courses" : "Enrolled Courses"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "instructor" 
                      ? (myCoursesLoading ? "..." : myCourses?.length || 0)
                      : (enrollmentsLoading ? "..." : enrollments?.length || 0)
                    }
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "instructor" ? "Total Students" : "Completed"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "instructor" 
                      ? "0" // Would calculate total students across all courses
                      : (statsLoading ? "..." : userStats?.completedCourses || 0)
                    }
                  </p>
                </div>
                {user?.role === "instructor" ? (
                  <Users className="w-8 h-8 text-green-500" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "instructor" ? "Avg. Rating" : "Hours Learned"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "instructor" 
                      ? "4.8" // Would calculate average rating
                      : (statsLoading ? "..." : userStats?.totalHoursLearned || 0)
                    }
                  </p>
                </div>
                {user?.role === "instructor" ? (
                  <Star className="w-8 h-8 text-yellow-500" />
                ) : (
                  <Clock className="w-8 h-8 text-purple-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "instructor" ? "Monthly Revenue" : "Certificates"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "instructor" 
                      ? "$1,234" // Would calculate actual revenue
                      : (completedCourses.length)
                    }
                  </p>
                </div>
                {user?.role === "instructor" ? (
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                ) : (
                  <Award className="w-8 h-8 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={user?.role === "instructor" ? "my-courses" : "enrolled"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={user?.role === "instructor" ? "my-courses" : "enrolled"}>
              {user?.role === "instructor" ? "My Courses" : "Enrolled Courses"}
            </TabsTrigger>
            <TabsTrigger value={user?.role === "instructor" ? "analytics" : "progress"}>
              {user?.role === "instructor" ? "Analytics" : "Progress"}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Instructor View */}
          {user?.role === "instructor" && (
            <>
              <TabsContent value="my-courses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">My Courses</h3>
                  <Link href="/create-course">
                    <Button className="bg-primary hover:bg-primary/90">
                      Create New Course
                    </Button>
                  </Link>
                </div>

                {myCoursesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : myCourses?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start sharing your knowledge by creating your first course
                      </p>
                      <Link href="/create-course">
                        <Button className="bg-primary hover:bg-primary/90">
                          Create Your First Course
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Analytics data will be available here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Student Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Engagement metrics will be shown here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}

          {/* Student View */}
          {user?.role !== "instructor" && (
            <>
              <TabsContent value="enrolled" className="space-y-6">
                <div className="space-y-8">
                  {/* In Progress Courses */}
                  {inProgressCourses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Continue Learning</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inProgressCourses.map((enrollment) => (
                          <CourseCard 
                            key={enrollment.id} 
                            course={{
                              id: enrollment.courseId,
                              title: enrollment.courseTitle,
                              shortDescription: enrollment.courseDescription,
                              thumbnailUrl: enrollment.courseThumbnail,
                              instructorName: enrollment.courseInstructor,
                            }}
                            enrolled={true}
                            progress={enrollment.progress}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Courses */}
                  {completedCourses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Completed Courses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedCourses.map((enrollment) => (
                          <CourseCard 
                            key={enrollment.id} 
                            course={{
                              id: enrollment.courseId,
                              title: enrollment.courseTitle,
                              shortDescription: enrollment.courseDescription,
                              thumbnailUrl: enrollment.courseThumbnail,
                              instructorName: enrollment.courseInstructor,
                            }}
                            enrolled={true}
                            progress={enrollment.progress}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Enrollments */}
                  {enrollments?.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
                        <p className="text-gray-600 mb-6">
                          Start your learning journey by enrolling in a course
                        </p>
                        <Link href="/courses">
                          <Button className="bg-primary hover:bg-primary/90">
                            Browse Courses
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Courses Completed</span>
                        <span className="text-2xl font-bold text-green-600">
                          {completedCourses.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Hours Learned</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {statsLoading ? "..." : userStats?.totalHoursLearned || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Certificates Earned</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {completedCourses.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Weekly Goal</span>
                            <span className="text-sm text-gray-500">5h / 10h</span>
                          </div>
                          <ProgressBar progress={50} color="blue" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Monthly Goal</span>
                            <span className="text-sm text-gray-500">3 / 4 courses</span>
                          </div>
                          <ProgressBar progress={75} color="green" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}

          {/* Activity Tab (for both roles) */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`flex items-start space-x-3 p-3 ${activity.bgColor} rounded-lg`}>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
