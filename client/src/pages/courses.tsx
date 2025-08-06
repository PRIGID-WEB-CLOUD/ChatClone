import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid3X3, List } from "lucide-react";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
    retry: false,
  });

  const categories = [
    "All Categories",
    "Development", 
    "Design",
    "Business", 
    "Marketing",
    "Data Science",
    "Photography",
    "Language"
  ];

  const filteredAndSortedCourses = courses ? [...courses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
        return (b.studentsCount || 0) - (a.studentsCount || 0);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "price-low":
        return parseFloat(a.price || "0") - parseFloat(b.price || "0");
      case "price-high":
        return parseFloat(b.price || "0") - parseFloat(a.price || "0");
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
          <p className="text-gray-600">Discover your next skill with our comprehensive course catalog</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "All Categories" || searchQuery) && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== "All Categories" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory("All Categories")}
                      className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchQuery("");
                  }}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? "Loading..." : `${filteredAndSortedCourses.length} courses found`}
          </p>
        </div>

        {/* Course Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse our featured categories
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredAndSortedCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                compact={viewMode === "list"}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredAndSortedCourses.length > 0 && filteredAndSortedCourses.length % 20 === 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
