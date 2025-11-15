import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface LocationManagerProps {
  huntId: string;
}

export const LocationManager = ({ huntId }: LocationManagerProps) => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, [huntId]);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('location_stops')
        .select('*')
        .eq('hunt_id', huntId)
        .order('order_index');

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading locations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async () => {
    try {
      const maxOrder = locations.length > 0 
        ? Math.max(...locations.map(l => l.order_index)) 
        : 0;

      const { error } = await supabase
        .from('location_stops')
        .insert({
          hunt_id: huntId,
          name: `Location ${locations.length + 1}`,
          order_index: maxOrder + 1,
        });

      if (error) throw error;

      toast({
        title: "Location Added",
        description: "New location has been added to your hunt",
      });

      loadLocations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateLocation = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('location_stops')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('location_stops')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Location Deleted",
        description: "Location has been removed from your hunt",
      });

      loadLocations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading locations...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Location Stops</CardTitle>
        <Button onClick={addLocation} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No locations added yet. Add your first location to get started.
          </p>
        ) : (
          locations.map((location, index) => (
            <Card key={location.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 mt-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label>Location Name</Label>
                      <Input
                        value={location.name}
                        onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                        placeholder="e.g., Murphy's Pub, The Red Lion"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address (optional)</Label>
                      <Input
                        value={location.address || ''}
                        onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLocation(location.id)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
