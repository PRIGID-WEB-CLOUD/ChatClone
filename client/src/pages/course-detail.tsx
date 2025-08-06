import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award, 
  Globe,
  CheckCircle,
  Lock,
  Download,
  Share2
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: [`/api/courses/${id}`],
    retry: false,
    enabled: !!id,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: [`/api/courses/${id}/modules`],
    retry: false,
    enabled: !!id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/courses/${id}/reviews`],
    retry: false,
    enabled: !!id,
  });

  const { data: enrollments } = useQuery({
    queryKey: ["/api/my-enrollments"],
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/courses/${id}/enroll`);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully enrolled in this course.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
              <p className="text-gray-600 mb-4">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/courses">
                <Button>Browse All Courses</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isEnrolled = enrollments?.some((enrollment: any) => enrollment.courseId === course?.id);
  const enrollment = enrollments?.find((enrollment: any) => enrollment.courseId === course?.id);
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice === 0 ? "Free" : `$${numPrice.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Development": "bg-blue-100 text-blue-800",
      "Design": "bg-purple-100 text-purple-800",
      "Business": "bg-green-100 text-green-800",
      "Marketing": "bg-orange-100 text-orange-800",
      "Data Science": "bg-indigo-100 text-indigo-800",
      "Photography": "bg-red-100 text-red-800",
      "Language": "bg-yellow-100 text-yellow-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/courses" className="hover:text-primary">Courses</Link>
              <span>/</span>
              <span>{course?.category}</span>
              <span>/</span>
              <span className="text-gray-900">{course?.title}</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              {course?.category && (
                <Badge className={getCategoryColor(course.category)}>
                  {course.category}
                </Badge>
              )}
              <Badge variant="outline">{course?.level || "All Levels"}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {course?.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {showFullDescription ? course?.description : course?.shortDescription}
              {course?.description && course.description !== course.shortDescription && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-2 text-primary hover:text-primary/80 font-medium"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            {/* Instructor Info */}
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={course?.instructorProfileImage} alt={course?.instructorName} />
                <AvatarFallback>
                  {course?.instructorName?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">Instructor</p>
                <p className="text-gray-600">{course?.instructorName}</p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {course?.rating && (
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-500 mr-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold ml-1">{course.rating}</span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({course?.studentsCount || 0} students)
                  </span>
                </div>
              )}
              
              {course?.duration && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.duration} hours</span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{course?.studentsCount?.toLocaleString() || 0} enrolled</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <span>English</span>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="aspect-video relative mb-4 rounded-t-lg overflow-hidden">
                <img
                  src={course?.thumbnailUrl || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                  alt={course?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="bg-white/90 text-gray-900 hover:bg-white">
                    <Play className="w-5 h-5 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(course?.price || "0")}
                  </div>
                  {course?.price !== "0" && (
                    <p className="text-sm text-gray-500">One-time payment</p>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">You're enrolled!</span>
                      </div>
                    </div>
                    
                    {enrollment && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Your Progress</span>
                          <span className="text-gray-500">{enrollment.progress}%</span>
                        </div>
                        <ProgressBar progress={enrollment.progress} />
                      </div>
                    )}

                    <Button className="w-full" size="lg">
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => enrollMutation.mutate()}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                    
                    {course?.price !== "0" && (
                      <Link href={`/checkout/${course?.id}`}>
                        <Button className="w-full" variant="outline" size="lg">
                          Buy Now
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

                {/* What you'll learn */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Play className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{course?.duration || 0} hours of video content</span>
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Card>
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Course Content</h3>
                  <div className="text-sm text-gray-600">
                    {modules?.length || 0} modules • {course?.duration || 0} total hours
                  </div>
                </div>

                {modulesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : modules?.length ? (
                  <Accordion type="multiple" className="space-y-2">
                    {modules.map((module, index) => (
                      <AccordionItem 
                        key={module.id} 
                        value={module.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium">{module.title}</h4>
                                {module.description && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {module.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 pb-4">
                            <p className="text-gray-600 text-sm">
                              Module content will be loaded here when lessons are implemented.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No curriculum available yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Student Reviews</h3>
                  {course.rating && (
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-500 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= Math.round(parseFloat(course.rating)) 
                                ? 'fill-current' 
                                : ''
                            }`} 
                          />
                        ))}
                        <span className="font-semibold ml-2">{course.rating}</span>
                      </div>
                      <span className="text-gray-600">
                        ({reviews?.length || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : reviews?.length ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.userProfileImage} alt={review.userName} />
                            <AvatarFallback>
                              {review.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{review.userName}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 text-yellow-500 ${
                                    star <= review.rating ? 'fill-current' : ''
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="instructor" className="p-6">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={course.instructorProfileImage} alt={course.instructorName} />
                    <AvatarFallback className="text-2xl">
                      {course.instructorName?.split(' ').map(n => n[0]).join('') || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{course.instructorName}</h3>
                    <p className="text-gray-600">Instructor</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    Instructor bio and information would be displayed here when available.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
