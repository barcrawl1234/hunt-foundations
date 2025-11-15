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
    const systemPrompt = `You are a master storyteller creating immersive bar crawl mystery narratives. Your stories must be coherent, adult-appropriate, and work like interactive mad-lib mysteries.

CORE RULES:
1. Each hunt has ONE unified story/mystery arc
2. The final story is a mad-lib with blanks like {{BLANK_1}}, {{BLANK_2}}, etc.
3. Each bar corresponds to exactly ONE blank in the final story
4. The riddle answer IS the word that fills the blank (NOT the bar name, NOT a random word)
5. Riddle answers must be story-relevant objects, clues, phrases, or concepts
6. Story beats, riddles, and answers must form a logical chain

Your output must be valid JSON matching this exact structure:
{
  "intro_scenes": ["scene 1", "scene 2", "scene 3"],
  "final_template": "A narrative with {{BLANK_1}}, {{BLANK_2}}, etc. placeholders",
  "blank_definitions": [
    {
      "key": "BLANK_1",
      "description": "What type of thing fills this blank"
    }
  ],
  "locations": [
    {
      "location_id": "uuid",
      "location_name": "Bar Name",
      "options": [
        {
          "story_text": "2-4 sentences of immersive narrative at this specific bar",
          "riddle_text": "A riddle that grows from the story beat",
          "riddle_answer": "The exact word/phrase that fills the blank AND answers the riddle",
          "blank_key": "BLANK_1",
          "hint_1": "Weak hint",
          "hint_2": "Medium hint",
          "hint_3": "Strong hint"
        }
      ]
    }
  ]
}`;

    const userPrompt = `Create a ${theme} themed mystery for a bar crawl with ${tone} tone (${ageRating} rating).

${customNotes ? `Story requirements: ${customNotes}` : ''}

Locations (in order):
${locations.map((loc: any, i: number) => `${i + 1}. ${loc.name} (ID: ${loc.id})`).join('\n')}

GENERATE:

1. THREE intro scenes (each 2-3 sentences) that establish the mystery's atmosphere and hook

2. A FINAL STORY TEMPLATE (2-4 paragraphs):
   - Must contain exactly ${locations.length} blanks: {{BLANK_1}}, {{BLANK_2}}, etc.
   - Write it as a complete narrative that reveals the mystery's conclusion
   - The blanks should be key story elements (objects, places, actions, names)

3. BLANK DEFINITIONS for each blank:
   - Describe what type of answer belongs in each blank
   - Example: "BLANK_1: A stolen object from the first bar"

4. For EACH of the ${locations.length} locations, create THREE distinct options:
   
   For each option:
   - story_text: 2-4 immersive sentences at "${locations[0]?.name}" (use actual bar name)
     - Advance the core mystery at this location
     - Reference specific details about the scene
   - riddle_text: A puzzle that emerges from the story_text
     - Should reference objects/characters/details from the scene
     - NOT just asking for the bar's name
   - riddle_answer: A single word or short phrase that:
     - Solves the riddle
     - Fits one of your blank definitions
     - Will be inserted into the final story as {{BLANK_X}}
     - Is NOT the bar name (unless absolutely necessary)
     - Is a meaningful story element (object, clue, phrase, concept)
   - blank_key: Which blank this answer fills (e.g., "BLANK_1")
   - hint_1, hint_2, hint_3: Three progressive hints based on the story and riddle

CRITICAL:
- The riddle_answer IS the madlib word (do not generate separate words)
- Each location's options must map to a different blank
- Riddle answers should feel important to the mystery, not random
- Story beats must reference the actual bar names
- All three options per location should offer different riddle answers for variety

Return ONLY valid JSON.`;

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
        final_madlib_template: storyData.final_template || storyData.final_madlib_template,
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
            hint_2: option.hint_2 || option.hint_2,
            madlib_word: option.riddle_answer, // The riddle answer IS the madlib word
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