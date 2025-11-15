import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HuntDetailsEditorProps {
  huntId: string;
  hunt: any;
  onUpdate: () => void;
}

export const HuntDetailsEditor = ({ huntId, hunt, onUpdate }: HuntDetailsEditorProps) => {
  const [title, setTitle] = useState(hunt.title);
  const [description, setDescription] = useState(hunt.description || '');
  const [city, setCity] = useState(hunt.city || '');
  const [playOrder, setPlayOrder] = useState(hunt.play_order || 'FLEXIBLE');
  const [finalStopMode, setFinalStopMode] = useState(hunt.final_stop_mode || 'HAS_FINAL_STOP');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hunts')
        .update({
          title,
          description,
          city,
          play_order: playOrder,
          final_stop_mode: finalStopMode,
        })
        .eq('id', huntId);

      if (error) throw error;

      toast({
        title: "Hunt Updated",
        description: "Your hunt details have been saved",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hunt Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Hunt Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter hunt title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your treasure hunt"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="play-order">Play Order</Label>
          <Select value={playOrder} onValueChange={setPlayOrder}>
            <SelectTrigger id="play-order">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLEXIBLE">Flexible - players choose their own route</SelectItem>
              <SelectItem value="LINEAR">Linear - players must follow a fixed sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="final-stop">Final Stop</Label>
          <Select value={finalStopMode} onValueChange={setFinalStopMode}>
            <SelectTrigger id="final-stop">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HAS_FINAL_STOP">Has final stop - one location is the grand finale</SelectItem>
              <SelectItem value="NO_FINAL_STOP">No final stop - all locations are equal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};
