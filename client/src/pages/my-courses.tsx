import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import CourseCard from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users, TrendingUp, Clock, Star, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import ProgressBar from "@/components/progress-bar";

export default function MyCourses() {
  const { user } = useAuth();
  const isInstructor = user?.role === "instructor";

  const { data: myCourses, isLoading: myCoursesLoading } = useQuery({
    queryKey: ["/api/my-courses"],
    enabled: isInstructor,
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/my-enrollments"],
    enabled: !isInstructor,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isInstructor ? "My Courses" : "My Learning"}
          </h1>
          <p className="text-muted-foreground">
            {isInstructor 
              ? "Manage and track your course creations"
              : "Continue your learning journey"
            }
          </p>
        </div>
        
        {isInstructor && (
          <Link href="/create-course">
            <Button data-testid="create-new-course">
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isInstructor ? "Total Courses" : "Enrolled Courses"}
                </p>
                <p className="text-2xl font-bold">
                  {isInstructor 
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
                <p className="text-sm font-medium text-muted-foreground">
                  {isInstructor ? "Total Students" : "Completed"}
                </p>
                <p className="text-2xl font-bold">
                  {isInstructor ? "247" : "3"}
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
                <p className="text-sm font-medium text-muted-foreground">
                  {isInstructor ? "Avg Rating" : "Hours Studied"}
                </p>
                <p className="text-2xl font-bold">
                  {isInstructor ? "4.8" : "42"}
                </p>
              </div>
              {isInstructor ? 
                <Star className="w-8 h-8 text-yellow-500" /> : 
                <Clock className="w-8 h-8 text-purple-500" />
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isInstructor ? "Revenue" : "Progress"}
                </p>
                <p className="text-2xl font-bold">
                  {isInstructor ? "$12.5K" : "78%"}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isInstructor ? (
        // Instructor view
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Courses</h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
          
          {myCoursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myCourses && myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Start creating your first course to share your knowledge</p>
                <Link href="/create-course">
                  <Button data-testid="create-first-course">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Student view
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <Link href="/courses">
              <Button variant="outline" size="sm" data-testid="browse-more-courses">
                <Plus className="w-4 h-4 mr-2" />
                Browse More
              </Button>
            </Link>
          </div>
          
          {enrollmentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment: any) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow" data-testid={`enrollment-${enrollment.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{enrollment.course?.title || "Course Title"}</h3>
                        <p className="text-sm text-muted-foreground">{enrollment.course?.instructor || "Instructor"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{enrollment.progress || 0}%</span>
                      </div>
                      <ProgressBar progress={enrollment.progress || 0} />
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {enrollment.course?.duration || "8 hours"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {enrollment.course?.rating || 4.5}
                        </div>
                      </div>
                    </div>
                    <Link href={`/course/${enrollment.courseId}`}>
                      <Button className="w-full mt-4" data-testid={`continue-course-${enrollment.id}`}>
                        Continue Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                <Link href="/courses">
                  <Button data-testid="get-started-learning">
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}