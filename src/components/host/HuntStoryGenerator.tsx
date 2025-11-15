import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HuntStoryGeneratorProps {
  huntId: string;
  onGenerated: () => void;
}

export const HuntStoryGenerator = ({ huntId, onGenerated }: HuntStoryGeneratorProps) => {
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState("");
  const [ageRating, setAgeRating] = useState("PG-13");
  const [customNotes, setCustomNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme || !tone) {
      toast({
        title: "Missing Information",
        description: "Please provide both theme and tone",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch hunt settings
      const { data: hunt, error: huntError } = await supabase
        .from('hunts')
        .select('play_order, final_stop_mode')
        .eq('id', huntId)
        .single();

      if (huntError) throw huntError;

      // Fetch location stops for this hunt
      const { data: locations, error: locError } = await supabase
        .from('location_stops')
        .select('id, name, order_index')
        .eq('hunt_id', huntId)
        .order('order_index');

      if (locError) throw locError;

      if (!locations || locations.length === 0) {
        toast({
          title: "No Locations",
          description: "Please add location stops to your hunt first",
          variant: "destructive",
        });
        return;
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('generate-hunt-story', {
        body: {
          huntId,
          theme,
          tone,
          ageRating,
          customNotes,
          locations,
          playOrder: hunt.play_order,
          finalStopMode: hunt.final_stop_mode,
        },
      });

      if (error) throw error;

      toast({
        title: "Story Generated!",
        description: "Your hunt story and puzzles have been created",
      });

      onGenerated();
    } catch (error: any) {
      console.error('Error generating story:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">AI Story Generator</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Let AI create an immersive, story-driven treasure hunt with custom riddles and puzzles for your locations.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              placeholder="e.g., Christmas Heist, Haunted Bar Crawl, Detective Mystery"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark_humor">Dark Humor</SelectItem>
                <SelectItem value="wholesome">Wholesome</SelectItem>
                <SelectItem value="scary">Scary</SelectItem>
                <SelectItem value="detective_noir">Detective Noir</SelectItem>
                <SelectItem value="party_chaos">Party/Drunk Chaos</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="festive">Festive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageRating">Age Rating</Label>
            <Select value={ageRating} onValueChange={setAgeRating}>
              <SelectTrigger id="ageRating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PG-13">PG-13</SelectItem>
                <SelectItem value="R">R</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customNotes">Custom Storyline Notes (Optional)</Label>
            <Textarea
              id="customNotes"
              placeholder="e.g., Make it about a stolen Christmas bell hidden around the city..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !theme || !tone}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Story...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Story & Puzzles With AI
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};