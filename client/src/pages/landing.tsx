import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Play, 
  Star, 
  Clock, 
  User, 
  Check, 
  Search,
  Bell,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const stats = [
    { label: "Active Students", value: "50K+" },
    { label: "Courses Available", value: "2.5K+" },
    { label: "Expert Instructors", value: "500+" },
    { label: "Completion Rate", value: "95%" }
  ];

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      category: "Development",
      rating: 4.8,
      reviews: 240,
      description: "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB in this comprehensive course.",
      duration: "42 hours",
      students: "1,234 students",
      price: 89.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      category: "Design",
      rating: 4.9,
      reviews: 180,
      description: "Learn design thinking, prototyping, and user research to create amazing user experiences.",
      duration: "28 hours",
      students: "987 students",
      price: 79.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      category: "Business",
      rating: 4.7,
      reviews: 320,
      description: "Master social media, SEO, email marketing, and analytics to grow your business online.",
      duration: "35 hours",
      students: "2,156 students",
      price: 69.99,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 4,
      title: "Python for Data Science",
      category: "Data Science",
      rating: 4.8,
      reviews: 290,
      description: "Learn Python, pandas, numpy, and machine learning to analyze data and build models.",
      duration: "45 hours",
      students: "1,567 students",
      price: 99.99,
      originalPrice: 219.99,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 5,
      title: "Professional Photography Course",
      category: "Photography",
      rating: 4.6,
      reviews: 150,
      description: "Master camera settings, composition, lighting, and post-processing to create stunning photos.",
      duration: "25 hours",
      students: "756 students",
      price: 59.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 6,
      title: "Spanish for Beginners",
      category: "Language",
      rating: 4.9,
      reviews: 410,
      description: "Learn Spanish conversation, grammar, and culture through interactive lessons and practice.",
      duration: "30 hours",
      students: "3,245 students",
      price: 49.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Video Learning",
      description: "Engage with high-quality video content with interactive elements, quizzes, and note-taking capabilities.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Certificates & Badges",
      description: "Earn verifiable certificates and digital badges to showcase your achievements and skills.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Community Learning",
      description: "Connect with fellow learners, join study groups, and participate in discussions.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      rating: 5,
      comment: "ChatXo has completely transformed how I learn. The interactive features and community support make complex topics easy to understand.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "Michael Chen",
      role: "Course Creator",
      rating: 5,
      comment: "As an instructor, the course creation tools are fantastic. I've been able to reach students globally and the analytics help me improve.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      rating: 5,
      comment: "The progress tracking and certificates have helped me advance my career. The platform is intuitive and the content is top-quality.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">ChatXo</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Courses</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Community</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Analytics</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button onClick={handleSignIn} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left-5 duration-1000">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Learning Into 
                <span className="text-yellow-300"> Achievement</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of learners and instructors creating amazing educational experiences with our comprehensive learning management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSignIn} size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="animate-in fade-in-50 duration-1000 delay-300">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students collaborating in online learning environment" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Catalog Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Discover courses that thousands of students love
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="bg-primary text-white">All Courses</Button>
            <Button variant="secondary">Development</Button>
            <Button variant="secondary">Design</Button>
            <Button variant="secondary">Business</Button>
            <Button variant="secondary">Marketing</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating} ({course.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    </div>
                    <Button onClick={handleSignIn} className="bg-primary hover:bg-primary/90">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Become an Instructor
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Share your expertise with thousands of students worldwide. Our platform provides everything you need to create, market, and sell your courses online.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Easy-to-use course builder",
                  "Marketing tools and analytics",
                  "Global payment processing",
                  "24/7 instructor support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleSignIn} size="lg" className="bg-primary hover:bg-primary/90">
                Start Teaching Today
              </Button>
            </div>
            <div className="lg:pl-8">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern course creation workspace with multiple monitors and creative setup" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools for learners and instructors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied learners and instructors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center text-yellow-500 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={`${testimonial.name} profile`} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join over 50,000 students and instructors building skills for the future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleSignIn} size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Browse Courses
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">ChatXo</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering learners and educators worldwide with cutting-edge technology and innovative learning experiences.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Courses</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Science</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 ChatXo. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400">🌍 English</span>
              <span className="text-gray-400">💰 USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
