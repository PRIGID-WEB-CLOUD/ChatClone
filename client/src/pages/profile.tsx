import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Award,
  BookOpen,
  Star,
  Clock,
  Users,
  Edit3
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const isInstructor = user?.role === "instructor";

  const { data: userStats } = useQuery({
    queryKey: ["/api/analytics/user"],
  });

  const { data: myCourses } = useQuery({
    queryKey: ["/api/my-courses"],
    enabled: isInstructor,
  });

  const { data: enrollments } = useQuery({
    queryKey: ["/api/my-enrollments"],
    enabled: !isInstructor,
  });

  const getUserInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : "Recently";

  const achievements = [
    { 
      icon: <BookOpen className="w-6 h-6" />, 
      title: "Course Completer", 
      description: "Completed your first course",
      earned: (userStats?.completedCourses || 0) > 0
    },
    { 
      icon: <Star className="w-6 h-6" />, 
      title: "Top Rated", 
      description: "Received 5-star ratings",
      earned: isInstructor && myCourses?.some((course: any) => parseFloat(course.rating || "0") >= 4.5)
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "Community Builder", 
      description: "Active in discussions",
      earned: false
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: "Dedicated Learner", 
      description: "100+ hours of learning",
      earned: (userStats?.totalWatchTime || 0) >= 100
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <Badge variant={isInstructor ? "default" : "secondary"}>
                    {isInstructor ? "Instructor" : "Student"}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user?.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {memberSince}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {isInstructor 
                    ? "Passionate educator sharing knowledge and helping students grow."
                    : "Continuous learner exploring new skills and knowledge."
                  }
                </p>

                <Link href="/settings">
                  <Button variant="outline">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {isInstructor ? (myCourses?.length || 0) : (enrollments?.length || 0)}
              </p>
              <p className="text-sm text-gray-600">
                {isInstructor ? "Courses Created" : "Courses Enrolled"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {isInstructor 
                  ? (myCourses?.reduce((sum: number, course: any) => sum + (course.studentsCount || 0), 0) || 0)
                  : (userStats?.completedCourses || 0)
                }
              </p>
              <p className="text-sm text-gray-600">
                {isInstructor ? "Students Taught" : "Courses Completed"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {isInstructor 
                  ? (myCourses?.length > 0 
                      ? (myCourses.reduce((sum: number, course: any) => sum + parseFloat(course.rating || "0"), 0) / myCourses.length).toFixed(1)
                      : "0.0"
                    )
                  : "4.8"
                }
              </p>
              <p className="text-sm text-gray-600">
                {isInstructor ? "Average Rating" : "Learning Score"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {userStats?.totalWatchTime || 0}
              </p>
              <p className="text-sm text-gray-600">Hours Learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">
              {isInstructor ? "My Courses" : "Enrolled Courses"}
            </TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isInstructor ? (
                myCourses && myCourses.length > 0 ? (
                  myCourses.map((course: any) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No courses created yet</p>
                  </div>
                )
              ) : (
                enrollments && enrollments.length > 0 ? (
                  enrollments.map((enrollment: any) => (
                    <CourseCard 
                      key={enrollment.id} 
                      course={enrollment.course} 
                      enrolled={true}
                      progress={enrollment.progress}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No enrollments yet</p>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.earned ? "bg-green-50 border-green-200" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.earned 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge variant="default" className="mt-2">Earned</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Completed a lesson</p>
                      <p className="text-sm text-gray-600">React Development Course • 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Earned achievement</p>
                      <p className="text-sm text-gray-600">Course Completer • 1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Star className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Left a review</p>
                      <p className="text-sm text-gray-600">JavaScript Fundamentals • 3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}