import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Play, 
  Calendar, 
  ShoppingBag, 
  User, 
  Settings, 
  Bell,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
      active: location === "/",
    },
    {
      title: "My Learning",
      icon: GraduationCap,
      href: "/my-courses",
      active: location === "/my-courses",
    },
    {
      title: "Course Page",
      icon: BookOpen,
      href: "/courses",
      active: location === "/courses" || location.startsWith("/course/"),
    },
    {
      title: "Community",
      icon: MessageSquare,
      href: "/community",
      active: location === "/community",
    },
    {
      title: "Groups",
      icon: Users,
      href: "/groups",
      active: location === "/groups" || location.startsWith("/group/"),
    },
    {
      title: "Video Page",
      icon: Play,
      href: "/videos",
      active: location === "/videos" || location.startsWith("/video/"),
    },
    {
      title: "Events & Webinars",
      icon: Calendar,
      href: "/events",
      active: location === "/events" || location.startsWith("/event/"),
    },
    {
      title: "Marketplace",
      icon: ShoppingBag,
      href: "/marketplace",
      active: location === "/marketplace" || location.startsWith("/product/"),
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: location === "/analytics",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
      active: location === "/profile",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
      active: location === "/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      active: location === "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>LearnHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9", collapsed ? "mx-auto" : "ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
          data-testid="sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
              data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}