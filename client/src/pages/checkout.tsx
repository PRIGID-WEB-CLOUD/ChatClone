import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  Award
} from "lucide-react";

const CheckoutForm = ({ course }: { course: any }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayWithPaystack = async () => {
    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/initialize-payment", {
        amount: parseFloat(course.price),
        courseId: course.id,
      });
      const data = await response.json();

      if (data.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your payment is secured by Paystack. We never store your card details.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Accepts all major credit cards, bank transfers, and mobile money</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Shield className="w-4 h-4" />
        <span>Secured by 256-bit SSL encryption</span>
      </div>

      <Button
        onClick={handlePayWithPaystack}
        className="w-full"
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Redirecting to Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay with Paystack
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By completing your purchase, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default function Checkout() {
  const { courseId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to sign in to purchase a course.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    retry: false,
    enabled: !!courseId,
  });

  // Handle payment success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const reference = urlParams.get('reference');

    if (paymentStatus === 'success' && reference) {
      const verifyPayment = async () => {
        try {
          const response = await apiRequest("POST", "/api/verify-payment", {
            reference,
          });
          const data = await response.json();

          if (data.success) {
            toast({
              title: "Payment Successful!",
              description: "You have been enrolled in the course.",
            });
            setLocation(`/course/${courseId}`);
          } else {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if you were charged.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Verification Error",
            description: "Please contact support if you were charged.",
            variant: "destructive",
          });
        }
      };

      verifyPayment();
    }
  }, [courseId, setLocation, toast]);

  if (isLoading || courseLoading) {
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
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
              <p className="text-gray-600 mb-4">
                The course you're trying to purchase doesn't exist or has been removed.
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

  // If course is free, redirect to course page
  if (course.price === "0" || !course.price) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🆓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">This Course is Free!</h3>
              <p className="text-gray-600 mb-4">
                You can enroll in this course without any payment.
              </p>
              <Link href={`/course/${courseId}`}>
                <Button>Go to Course Page</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(2)}`;
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/course/${courseId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Course Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={course.thumbnailUrl || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div className="flex items-center gap-2">
                  {course.category && (
                    <Badge className={getCategoryColor(course.category)}>
                      {course.category}
                    </Badge>
                  )}
                  <Badge variant="outline">{course.level || "All Levels"}</Badge>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                
                <p className="text-gray-600">
                  {course.shortDescription || course.description}
                </p>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">By {course.instructorName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{course.duration || 0} hours</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{course.studentsCount || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Certificate</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm course={course} />

              {/* What's included */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                <div className="space-y-2">
                  {[
                    "Lifetime access to course content",
                    "Downloadable resources and materials", 
                    "Certificate of completion",
                    "Access to course community",
                    "30-day money-back guarantee"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              <span>
                Your payment information is secured by Paystack with bank-level encryption. 
                We never store your payment details on our servers.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
