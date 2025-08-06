import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Edit, 
  Award, 
  BookOpen, 
  Play, 
  Users, 
  Calendar, 
  Settings, 
  Mail,
  MapPin,
  Link as LinkIcon,
  Star,
  TrendingUp,
  Trophy,
  Target,
  Clock,
  GraduationCap
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/analytics/user'],
    retry: false,
  });

  const { data: userEnrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/my-enrollments'],
    retry: false,
  });

  const { data: userGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/my-groups'],
    retry: false,
  });

  const { data: userVideos, isLoading: videosLoading } = useQuery({
    queryKey: ['/api/videos', '', 'my-videos'],
    retry: false,
  });

  const { data: userEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/events', '', 'registered'],
    retry: false,
  });

  // Mock data for demonstration - replace with real API calls
  const achievements = [
    {
      id: 1,
      title: "JavaScript Expert",
      description: "Completed 10 JavaScript courses",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      earned: true,
      earnedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Community Leader",
      description: "Active in 5+ groups",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      earned: true,
      earnedDate: "2024-01-10"
    },
    {
      id: 3,
      title: "Video Creator",
      description: "Uploaded 5+ educational videos",
      icon: <Play className="w-6 h-6 text-purple-500" />,
      earned: false,
      progress: 60
    },
    {
      id: 4,
      title: "Learning Streak",
      description: "30 days continuous learning",
      icon: <Target className="w-6 h-6 text-green-500" />,
      earned: false,
      progress: 47
    }
  ];

  const skillLevels = [
    { name: "JavaScript", level: 85, color: "bg-yellow-500" },
    { name: "React", level: 78, color: "bg-blue-500" },
    { name: "Node.js", level: 72, color: "bg-green-500" },
    { name: "TypeScript", level: 68, color: "bg-purple-500" },
    { name: "Python", level: 55, color: "bg-red-500" }
  ];

  const recentActivity = [
    {
      type: "course_completed",
      title: "Completed 'Advanced React Patterns'",
      date: "2 hours ago",
      icon: <GraduationCap className="w-4 h-4 text-green-500" />
    },
    {
      type: "group_joined",
      title: "Joined 'Frontend Developers' group",
      date: "1 day ago",
      icon: <Users className="w-4 h-4 text-blue-500" />
    },
    {
      type: "video_uploaded",
      title: "Uploaded 'React Hooks Explained'",
      date: "3 days ago",
      icon: <Play className="w-4 h-4 text-purple-500" />
    },
    {
      type: "event_attended",
      title: "Attended 'Web Development Trends' webinar",
      date: "1 week ago",
      icon: <Calendar className="w-4 h-4 text-orange-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
                <p className="text-muted-foreground">Learning Enthusiast</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" data-testid="edit-profile">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Array.isArray(userEnrollments) ? userEnrollments.length : 0}
              </div>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {userStats?.completedCourses || 0}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Array.isArray(userGroups) ? userGroups.length : 0}
              </div>
              <p className="text-sm text-muted-foreground">Groups</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">14</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Course Completion</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Weekly Goal</span>
                      <span className="text-sm font-medium">8/10 hours</span>
                    </div>
                    <Progress value={80} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Assignments</span>
                      <span className="text-sm font-medium">12/15</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Current Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(userEnrollments) && userEnrollments.length > 0 ? (
                  <div className="space-y-4">
                    {userEnrollments.slice(0, 3).map((enrollment: any) => (
                      <div key={enrollment.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">
                            {enrollment.course?.title || "Course Title"}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                        <Progress value={enrollment.progress || 0} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active courses
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achievement.earnedDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? "border-primary/50" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Levels</CardTitle>
              <CardDescription>
                Your proficiency in different technologies based on completed courses and assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillLevels.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${skill.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent learning activities and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-background rounded-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}