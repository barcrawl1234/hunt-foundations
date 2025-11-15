import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRequireAuth } from '@/lib/auth';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HuntStoryGenerator } from '@/components/host/HuntStoryGenerator';
import { StoryOptionsViewer } from '@/components/host/StoryOptionsViewer';
import { LocationManager } from '@/components/host/LocationManager';
import { HuntDetailsEditor } from '@/components/host/HuntDetailsEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function HuntEditor() {
  const { huntId } = useParams<{ huntId: string }>();
  const { profile, loading } = useRequireAuth('HOST');
  const [hunt, setHunt] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (huntId && profile) {
      loadHunt();
    }
  }, [huntId, profile]);

  const loadHunt = async () => {
    try {
      const { data, error } = await supabase
        .from('hunts')
        .select('*')
        .eq('id', huntId)
        .eq('host_id', profile!.id)
        .single();

      if (error) throw error;
      setHunt(data);
    } catch (error: any) {
      toast({
        title: "Error loading hunt",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || !hunt) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{hunt.title}</h1>
          <p className="text-muted-foreground">Configure your hunt details, locations, and story</p>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Hunt Details</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="narrative">Narrative & Puzzles</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <HuntDetailsEditor huntId={huntId!} hunt={hunt} onUpdate={loadHunt} />
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <LocationManager huntId={huntId!} />
          </TabsContent>

          <TabsContent value="narrative" className="mt-6">
            <div className="space-y-6">
              <HuntStoryGenerator 
                huntId={huntId!} 
                onGenerated={() => setRefreshKey(prev => prev + 1)} 
              />
              <StoryOptionsViewer 
                key={refreshKey} 
                huntId={huntId!} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
