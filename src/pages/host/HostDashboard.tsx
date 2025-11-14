import { useRequireAuth } from '@/lib/auth';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Users, DollarSign, BarChart } from 'lucide-react';
import { HuntStoryGenerator } from '@/components/host/HuntStoryGenerator';
import { StoryOptionsViewer } from '@/components/host/StoryOptionsViewer';
import { useState } from 'react';

export default function HostDashboard() {
  const { profile, loading } = useRequireAuth('HOST');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Placeholder hunt ID - in real implementation, this would come from hunt selection
  const mockHuntId = "mock-hunt-id";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your treasure hunts</p>
          </div>
          <Button variant="hero" size="lg" disabled>
            Create New Hunt
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hunts</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Created hunts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Currently playing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-muted-foreground">Average completion</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="narrative">Narrative & Puzzles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Features being developed for hosts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Map className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Hunt Builder</h3>
                    <p className="text-sm text-muted-foreground">Create story-driven experiences with locations, clues, and puzzles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Player Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track engagement, completion rates, and player feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h3 className="font-medium">Revenue Management</h3>
                    <p className="text-sm text-muted-foreground">Set pricing, manage tickets, and track earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="narrative" className="mt-6 space-y-6">
            <HuntStoryGenerator 
              huntId={mockHuntId} 
              onGenerated={() => setRefreshKey(prev => prev + 1)}
            />
            <StoryOptionsViewer key={refreshKey} huntId={mockHuntId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
