import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { huntId, theme, tone, ageRating, customNotes, locations } = await req.json();

    console.log('Generating hunt story for:', { huntId, theme, tone, ageRating });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the AI prompt
    const systemPrompt = `You are a creative storytelling AI that generates immersive treasure hunt narratives for bar crawls. Create engaging, themed stories with riddles that incorporate real location names.

Your output must be valid JSON matching this exact structure:
{
  "intro_scenes": ["scene 1", "scene 2", "scene 3"],
  "final_madlib_template": "Template with ____ blanks",
  "locations": [
    {
      "location_id": "uuid",
      "options": [
        {
          "story_text": "Scene at this location",
          "riddle_text": "A riddle about the location",
          "riddle_answer": "answer",
          "hint_1": "first hint",
          "hint_2": "second hint",
          "madlib_word": "word for blank"
        }
      ]
    }
  ]
}`;

    const userPrompt = `Create a ${theme} themed treasure hunt story with a ${tone} tone (${ageRating} rating).

${customNotes ? `Custom requirements: ${customNotes}` : ''}

Locations (in order):
${locations.map((loc: any, i: number) => `${i + 1}. ${loc.name} (ID: ${loc.id})`).join('\n')}

Generate:
1. THREE different intro scenes that set the mood and story
2. A mad-lib style final template with ${locations.length} blanks (use ____ for each blank)
3. For EACH location, create THREE distinct options, each with:
   - A story moment specific to that location
   - A riddle tied to the theme and location name
   - The riddle answer
   - Two helpful hints
   - A single word that will fill one blank in the final mad-lib

Make each option unique and creative. Return ONLY valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI generation failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log('AI response:', content);

    // Parse the JSON response
    let storyData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      storyData = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid AI response format');
    }

    // Save to database - upsert on hunt_id to update existing stories
    const { data: huntStory, error: storyError } = await supabase
      .from('hunt_stories')
      .upsert({
        hunt_id: huntId,
        intro_scene_1: storyData.intro_scenes[0],
        intro_scene_2: storyData.intro_scenes[1],
        intro_scene_3: storyData.intro_scenes[2],
        final_madlib_template: storyData.final_madlib_template,
        tone: tone,
        theme: theme,
      }, {
        onConflict: 'hunt_id'
      })
      .select()
      .single();

    if (storyError) {
      console.error('Error saving hunt story:', storyError);
      throw storyError;
    }

    // Delete existing location story options for this hunt's locations before inserting new ones
    const locationIds = storyData.locations.map((loc: any) => loc.location_id);
    const { error: deleteError } = await supabase
      .from('location_story_options')
      .delete()
      .in('location_stop_id', locationIds);

    if (deleteError) {
      console.error('Error deleting old location story options:', deleteError);
      throw deleteError;
    }

    // Save new location story options
    for (const locationData of storyData.locations) {
      for (let i = 0; i < locationData.options.length; i++) {
        const option = locationData.options[i];
        const { error: optionError } = await supabase
          .from('location_story_options')
          .insert({
            location_stop_id: locationData.location_id,
            option_number: i + 1,
            story_text: option.story_text,
            riddle_text: option.riddle_text,
            riddle_answer: option.riddle_answer,
            hint_1: option.hint_1,
            hint_2: option.hint_2,
            madlib_word: option.madlib_word,
            is_selected: false,
          });

        if (optionError) {
          console.error('Error saving location story option:', optionError);
          throw optionError;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, storyData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-hunt-story:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});