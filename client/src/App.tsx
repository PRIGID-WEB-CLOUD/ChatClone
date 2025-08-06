import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Dashboard from "@/pages/dashboard";
import CreateCourse from "@/pages/create-course";
import Checkout from "@/pages/checkout";
import MyCourses from "@/pages/my-courses";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Community from "@/pages/community";
import Groups from "@/pages/groups";
import Videos from "@/pages/videos";
import Events from "@/pages/events";
import Marketplace from "@/pages/marketplace";
import Notifications from "@/pages/notifications";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Layout>
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/courses" component={Courses} />
            <Route path="/course/:id" component={CourseDetail} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/create-course" component={CreateCourse} />
            <Route path="/checkout/:courseId" component={Checkout} />
            <Route path="/my-courses" component={MyCourses} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={Profile} />
            <Route path="/community" component={Community} />
            <Route path="/groups" component={Groups} />
            <Route path="/videos" component={Videos} />
            <Route path="/events" component={Events} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/notifications" component={Notifications} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
