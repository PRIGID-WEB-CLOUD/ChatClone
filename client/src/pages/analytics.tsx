import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  BookOpen, 
  Star, 
  Play, 
  Download, 
  Calendar,
  DollarSign,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const isInstructor = (user as any)?.role === "instructor";

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics/user'],
    retry: false,
  });

  const { data: courseAnalytics, isLoading: courseLoading } = useQuery({
    queryKey: ['/api/analytics/courses'],
    enabled: isInstructor,
    retry: false,
  });

  const { data: learningProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/analytics/progress'],
    enabled: !isInstructor,
    retry: false,
  });

  // Mock data for demonstration - replace with real API calls
  const mockStudentStats = {
    totalHoursLearned: 127,
    coursesCompleted: 8,
    coursesInProgress: 3,
    averageScore: 87,
    streakDays: 21,
    badgesEarned: 12,
    weeklyProgress: [
      { day: 'Mon', hours: 2.5, score: 85 },
      { day: 'Tue', hours: 1.8, score: 92 },
      { day: 'Wed', hours: 3.2, score: 78 },
      { day: 'Thu', hours: 2.1, score: 90 },
      { day: 'Fri', hours: 2.8, score: 88 },
      { day: 'Sat', hours: 1.5, score: 85 },
      { day: 'Sun', hours: 2.2, score: 91 }
    ]
  };

  const mockInstructorStats = {
    totalStudents: 1247,
    totalCourses: 12,
    totalRevenue: 28450,
    averageRating: 4.7,
    completionRate: 68,
    monthlyRevenue: [
      { month: 'Jan', revenue: 2400, students: 89 },
      { month: 'Feb', revenue: 1950, students: 74 },
      { month: 'Mar', revenue: 3200, students: 132 },
      { month: 'Apr', revenue: 2800, students: 98 },
      { month: 'May', revenue: 3800, students: 156 },
      { month: 'Jun', revenue: 4100, students: 167 }
    ],
    topCourses: [
      { title: 'React Masterclass', students: 432, revenue: 8640, rating: 4.9 },
      { title: 'JavaScript Fundamentals', students: 387, revenue: 6192, rating: 4.8 },
      { title: 'Node.js Backend', students: 298, revenue: 4770, rating: 4.6 }
    ]
  };

  const renderStudentAnalytics = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours Learned</p>
                <p className="text-2xl font-bold">{mockStudentStats.totalHoursLearned}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{mockStudentStats.coursesCompleted}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{mockStudentStats.averageScore}%</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{mockStudentStats.streakDays} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your learning activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudentStats.weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{day.hours}h</span>
                      <span>{day.score}%</span>
                    </div>
                    <div className="flex gap-2">
                      <Progress value={(day.hours / 4) * 100} className="flex-1" />
                      <Progress value={day.score} className="flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
            <CardDescription>Track your progress towards learning goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Hours Goal</span>
                <span>32/50 hours</span>
              </div>
              <Progress value={64} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Completion</span>
                <span>2/3 courses</span>
              </div>
              <Progress value={67} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Skill Development</span>
                <span>7/10 skills</span>
              </div>
              <Progress value={70} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInstructorAnalytics = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{mockInstructorStats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${(mockInstructorStats.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{mockInstructorStats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{mockInstructorStats.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue and student enrollment trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInstructorStats.monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${month.revenue}</span>
                    <span>{month.students} students</span>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={(month.revenue / 5000) * 100} className="flex-1" />
                    <Progress value={(month.students / 200) * 100} className="flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
          <CardDescription>Your most successful courses by enrollment and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInstructorStats.topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${course.revenue}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            {isInstructor 
              ? "Track your teaching performance and course analytics" 
              : "Monitor your learning progress and achievements"
            }
          </p>
        </div>
        <Button variant="outline" data-testid="export-data">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isInstructor ? renderInstructorAnalytics() : renderStudentAnalytics()}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">12.4K</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Insights</CardTitle>
              <CardDescription>
                AI-powered insights to improve your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Study Pattern</h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You learn best in the morning hours (9-11 AM). Consider scheduling challenging topics during this time.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">Skill Focus</h4>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your JavaScript skills are advancing rapidly. Consider taking an advanced framework course next.
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">Time Management</h4>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  You're spending 40% more time on practical exercises, which is great for skill retention.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
              <CardDescription>
                Generate and download comprehensive reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Progress Report</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive learning analytics</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-8 h-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold">Monthly Summary</h3>
                        <p className="text-sm text-muted-foreground">Month-by-month breakdown</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}