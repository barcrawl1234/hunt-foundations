import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/lib/auth';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Map, Plus, Edit } from 'lucide-react';

export default function HuntList() {
  const { profile, loading } = useRequireAuth('HOST');
  const [hunts, setHunts] = useState<any[]>([]);
  const [loadingHunts, setLoadingHunts] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      loadHunts();
    }
  }, [profile]);

  const loadHunts = async () => {
    try {
      const { data, error } = await supabase
        .from('hunts')
        .select('*')
        .eq('host_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHunts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading hunts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingHunts(false);
    }
  };

  const createNewHunt = async () => {
    try {
      const { data, error } = await supabase
        .from('hunts')
        .insert({
          title: 'New Hunt',
          host_id: profile!.id,
          status: 'DRAFT',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Hunt Created",
        description: "Your new hunt has been created",
      });

      navigate(`/host/hunt/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || loadingHunts) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Hunts</h1>
            <p className="text-muted-foreground">Create and manage your treasure hunts</p>
          </div>
          <Button variant="hero" size="lg" onClick={createNewHunt}>
            <Plus className="mr-2 h-5 w-5" />
            Create New Hunt
          </Button>
        </div>

        {hunts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Hunts Yet</CardTitle>
              <CardDescription>
                Create your first treasure hunt to get started
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hunts.map((hunt) => (
              <Card key={hunt.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{hunt.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    {hunt.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Status: <span className="font-medium text-foreground">{hunt.status}</span>
                    </div>
                    {hunt.city && (
                      <div className="text-sm text-muted-foreground">
                        City: <span className="font-medium text-foreground">{hunt.city}</span>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/host/hunt/${hunt.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Hunt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
