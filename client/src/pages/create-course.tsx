import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertCourseSchema } from "@shared/schema";
import type { InsertCourse } from "@shared/schema";
import Navbar from "@/components/navbar";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Upload, 
  Eye, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Users,
  Target
} from "lucide-react";
import { z } from "zod";

const createCourseSchema = insertCourseSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().transform(val => val === "" ? "0" : val),
  level: z.string().min(1, "Please select a level"),
});

type CreateCourseForm = z.infer<typeof createCourseSchema>;

export default function CreateCourse() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Redirect if not authenticated or not instructor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "instructor")) {
      toast({
        title: "Unauthorized",
        description: "You need to be an instructor to create courses.",
        variant: "destructive",
      });
      setTimeout(() => {
        if (!isAuthenticated) {
          window.location.href = "/api/login";
        } else {
          setLocation("/");
        }
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast, setLocation]);

  const form = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      category: "",
      price: "0",
      level: "",
      duration: 0,
      status: "draft",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CreateCourseForm) => {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add thumbnail file if selected
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const response = await apiRequest("POST", "/api/courses", formData);
      return await response.json();
    },
    onSuccess: (course) => {
      toast({
        title: "Course Created!",
        description: "Your course has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-courses"] });
      setLocation(`/course/${course.id}`);
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
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: CreateCourseForm) => {
      const formData = new FormData();
      
      Object.entries({ ...data, status: "draft" }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const response = await apiRequest("POST", "/api/courses", formData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Draft Saved!",
        description: "Your course draft has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCourseForm) => {
    createCourseMutation.mutate({ ...data, status: "published" });
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    saveDraftMutation.mutate(data);
  };

  const categories = [
    "Development",
    "Design", 
    "Business",
    "Marketing",
    "Data Science",
    "Photography",
    "Language",
    "Music",
    "Health & Fitness",
    "Personal Development"
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formData = form.watch();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Share your knowledge with students worldwide</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              disabled={!formData.title}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={saveDraftMutation.isPending || !formData.title}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </div>

        {previewMode ? (
          /* Course Preview */
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Preview</CardTitle>
                <Button onClick={() => setPreviewMode(false)}>
                  Exit Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    {formData.category && (
                      <Badge variant="secondary">{formData.category}</Badge>
                    )}
                    {formData.level && (
                      <Badge variant="outline">{formData.level}</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {formData.title || "Course Title"}
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {formData.shortDescription || "Short description will appear here"}
                  </p>
                  <p className="text-gray-700">
                    {formData.description || "Full description will appear here"}
                  </p>
                </div>

                <div className="lg:col-span-1">
                  <Card>
                    <div className="aspect-video relative mb-4 rounded-t-lg overflow-hidden bg-gray-200">
                      {thumbnailFile ? (
                        <img
                          src={URL.createObjectURL(thumbnailFile)}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {formData.price === "0" || !formData.price ? "Free" : `$${formData.price}`}
                        </div>
                      </div>
                      
                      <Button className="w-full mb-4" size="lg">
                        Enroll Now
                      </Button>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{formData.duration || 0} hours of content</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Lifetime access</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{formData.level || "All Levels"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Course Creation Form */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Complete Web Development Bootcamp" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description that will appear in course listings (20-120 characters)"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of what students will learn, course objectives, and outcomes"
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Course Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload an eye-catching thumbnail that represents your course (recommended: 1280x720px)
                    </p>
                    <FileUpload
                      onFileSelect={setThumbnailFile}
                      onFileRemove={() => setThumbnailFile(null)}
                      currentFile={thumbnailFile}
                      accept="image/*"
                      placeholder="Drag and drop a course thumbnail, or click to browse"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Duration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing & Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-8"
                                step="0.01"
                                min="0"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <p className="text-sm text-gray-500">Set to $0 for free courses</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration (hours)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="10" 
                              min="0"
                              step="0.5"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500">Total course duration in hours</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                >
                  Cancel
                </Button>
                
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    {saveDraftMutation.isPending ? "Saving..." : "Save as Draft"}
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? "Publishing..." : "Publish Course"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
