import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Lightbulb } from "lucide-react";

interface StoryOptionsViewerProps {
  huntId: string;
}

export const StoryOptionsViewer = ({ huntId }: StoryOptionsViewerProps) => {
  const [huntStory, setHuntStory] = useState<any>(null);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadStoryData();
  }, [huntId]);

  const loadStoryData = async () => {
    // Load hunt story
    const { data: story } = await supabase
      .from('hunt_stories')
      .select('*')
      .eq('hunt_id', huntId)
      .single();

    if (story) setHuntStory(story);

    // Load locations
    const { data: locs } = await supabase
      .from('location_stops')
      .select('*')
      .eq('hunt_id', huntId)
      .order('order_index');

    if (locs) setLocations(locs);

    // Load story options
    const { data: options } = await supabase
      .from('location_story_options')
      .select('*')
      .in('location_stop_id', locs?.map(l => l.id) || [])
      .order('option_number');

    if (options) {
      setLocationOptions(options);
      
      // Set initial selections
      const selections: Record<string, number> = {};
      options.forEach(opt => {
        if (opt.is_selected) {
          selections[opt.location_stop_id] = opt.option_number;
        }
      });
      setSelectedOptions(selections);
    }
  };

  const handleSelectOption = async (locationId: string, optionNumber: number) => {
    try {
      // Update all options for this location
      const { error } = await supabase
        .from('location_story_options')
        .update({ is_selected: false })
        .eq('location_stop_id', locationId);

      if (error) throw error;

      // Set selected option
      const { error: selectError } = await supabase
        .from('location_story_options')
        .update({ is_selected: true })
        .eq('location_stop_id', locationId)
        .eq('option_number', optionNumber);

      if (selectError) throw selectError;

      setSelectedOptions(prev => ({ ...prev, [locationId]: optionNumber }));

      toast({
        title: "Option Selected",
        description: `Option ${optionNumber} selected for this location`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getFilledMadlib = () => {
    if (!huntStory?.final_madlib_template) return "";
    
    let template = huntStory.final_madlib_template;
    const words: string[] = [];

    locations.forEach(loc => {
      const selectedOption = selectedOptions[loc.id];
      if (selectedOption) {
        const option = locationOptions.find(
          opt => opt.location_stop_id === loc.id && opt.option_number === selectedOption
        );
        if (option) words.push(option.madlib_word);
      }
    });

    words.forEach(word => {
      template = template.replace('____', `**${word}**`);
    });

    return template;
  };

  if (!huntStory) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          No story generated yet. Use the AI Story Generator above to create one.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro Scenes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Story Introduction</h3>
        <Tabs defaultValue="scene1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scene1">Scene 1</TabsTrigger>
            <TabsTrigger value="scene2">Scene 2</TabsTrigger>
            <TabsTrigger value="scene3">Scene 3</TabsTrigger>
          </TabsList>
          <TabsContent value="scene1" className="mt-4">
            <p className="text-foreground">{huntStory.intro_scene_1}</p>
          </TabsContent>
          <TabsContent value="scene2" className="mt-4">
            <p className="text-foreground">{huntStory.intro_scene_2}</p>
          </TabsContent>
          <TabsContent value="scene3" className="mt-4">
            <p className="text-foreground">{huntStory.intro_scene_3}</p>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Location Options */}
      {locations.map((location) => {
        const options = locationOptions.filter(opt => opt.location_stop_id === location.id);
        const selected = selectedOptions[location.id];

        return (
          <Card key={location.id} className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Stop {location.order_index + 1}: {location.name}
            </h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              {options.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selected === option.option_number
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => handleSelectOption(location.id, option.option_number)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">Option {option.option_number}</Badge>
                    {selected === option.option_number && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Story:</p>
                      <p className="text-sm text-muted-foreground">{option.story_text}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Riddle:</p>
                      <p className="text-sm text-foreground italic">"{option.riddle_text}"</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Answer:</p>
                      <p className="text-sm text-foreground font-mono">{option.riddle_answer}</p>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-1 mb-1">
                        <Lightbulb className="h-3 w-3" />
                        <p className="text-xs font-medium">Hints:</p>
                      </div>
                      <p className="text-xs text-muted-foreground">1. {option.hint_1}</p>
                      <p className="text-xs text-muted-foreground">2. {option.hint_2}</p>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium">Mad-lib word:</p>
                      <Badge variant="secondary" className="mt-1">{option.madlib_word}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Final Mad-lib Preview */}
      <Card className="p-6 bg-accent">
        <h3 className="text-lg font-semibold mb-4">Final Reveal Preview</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Template:</p>
            <p className="text-foreground">{huntStory.final_madlib_template}</p>
          </div>
          
          {Object.keys(selectedOptions).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Filled version (based on your selections):</p>
              <p className="text-foreground font-medium">{getFilledMadlib()}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};