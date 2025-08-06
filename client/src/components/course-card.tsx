import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, User, Play } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  price?: string;
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
  rating?: string;
  studentsCount?: number;
  instructorName?: string;
  instructorProfileImage?: string;
}

interface CourseCardProps {
  course: Course;
  compact?: boolean;
  enrolled?: boolean;
  progress?: number;
}

export default function CourseCard({ course, compact = false, enrolled = false, progress }: CourseCardProps) {
  const categoryColors = {
    "Development": "bg-blue-100 text-blue-800",
    "Design": "bg-purple-100 text-purple-800",
    "Business": "bg-green-100 text-green-800",
    "Marketing": "bg-orange-100 text-orange-800",
    "Data Science": "bg-indigo-100 text-indigo-800",
    "Photography": "bg-red-100 text-red-800",
    "Language": "bg-yellow-100 text-yellow-800",
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice === 0 ? "Free" : `$${numPrice.toFixed(2)}`;
  };

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <Link href={`/course/${course.id}`}>
          <div className="flex">
            <img 
              src={course.thumbnailUrl || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
              alt={course.title}
              className="w-24 h-16 object-cover"
            />
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                {course.category && (
                  <Badge variant="secondary" className={getCategoryColor(course.category)}>
                    {course.category}
                  </Badge>
                )}
                {course.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{course.rating}</span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{course.shortDescription || course.description}</p>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      <div className="relative">
        <img 
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {enrolled && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500 hover:bg-green-600">
              Enrolled
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Play className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {course.category && (
            <Badge variant="secondary" className={getCategoryColor(course.category)}>
              {course.category}
            </Badge>
          )}
          {course.rating && (
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {course.rating} ({course.studentsCount || 0})
              </span>
            </div>
          )}
        </div>

        <Link href={`/course/${course.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {course.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        {course.instructorName && (
          <div className="flex items-center mb-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={course.instructorProfileImage} alt={course.instructorName} />
              <AvatarFallback className="text-xs">
                {course.instructorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{course.instructorName}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          {course.duration && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration} hours</span>
            </div>
          )}
          {course.studentsCount !== undefined && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{course.studentsCount.toLocaleString()} students</span>
            </div>
          )}
          {course.level && (
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          )}
        </div>

        {enrolled && progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-primary">Progress</span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            {course.price !== undefined && (
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
          
          {enrolled ? (
            <Link href={`/course/${course.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Link href={`/course/${course.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                View Course
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
