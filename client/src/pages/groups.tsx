import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Lock, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ['/api/groups', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await fetch(`/api/groups?${params}`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return response.json();
    },
  });

  const { data: myGroups } = useQuery({
    queryKey: ['/api/my-groups'],
    queryFn: async () => {
      const response = await fetch('/api/my-groups');
      if (!response.ok) throw new Error('Failed to fetch my groups');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-muted-foreground mt-2">Connect and collaborate with your community</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground mt-2">Connect and collaborate with your community</p>
        </div>
        <Button data-testid="create-group">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="search-groups"
        />
      </div>

      {/* My Groups */}
      {myGroups && myGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group: any) => (
              <GroupCard key={group.id} group={group} isMember />
            ))}
          </div>
        </div>
      )}

      {/* Discover Groups */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Discover Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups?.map((group: any) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group, isMember = false }: { group: any; isMember?: boolean }) {
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`group-card-${group.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={group.imageUrl} />
              <AvatarFallback>
                <Users className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {group.isPrivate ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {group.membersCount} members
              </CardDescription>
            </div>
          </div>
          {group.type === 'paid' && (
            <Badge variant="secondary">${group.price}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {group.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Created by {group.creator?.firstName} {group.creator?.lastName}
          </div>
          <Button 
            size="sm" 
            variant={isMember ? "outline" : "default"}
            data-testid={`${isMember ? 'view' : 'join'}-group-${group.id}`}
          >
            {isMember ? 'View' : 'Join'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}