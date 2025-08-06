import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isInstructor ? "My Courses" : "My Enrolled Courses"}
            </h1>
            <p className="text-gray-600">
              {isInstructor 
                ? "Manage and track your course creations"
                : "Continue your learning journey"
              }
            </p>
          </div>
          
          {isInstructor && (
            <Link href="/create-course">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          )}
        </div>

        {isInstructor ? (
          // Instructor view
          <div>
            {myCoursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48"></div>
                  </div>
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
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Start creating your first course to share your knowledge</p>
                  <Link href="/create-course">
                    <Button>
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
          <div>
            {enrollmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48"></div>
                  </div>
                ))}
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment: any) => (
                  <CourseCard 
                    key={enrollment.id} 
                    course={enrollment.course} 
                    enrolled={true}
                    progress={enrollment.progress}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrollments yet</h3>
                  <p className="text-gray-600 mb-4">Explore our course catalog to start learning</p>
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}