-- Create hunt_stories table
CREATE TABLE public.hunt_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  intro_scene_1 TEXT,
  intro_scene_2 TEXT,
  intro_scene_3 TEXT,
  final_madlib_template TEXT,
  final_passphrase TEXT,
  tone TEXT,
  theme TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hunt_id)
);

-- Create location_story_options table
CREATE TABLE public.location_story_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  option_number INTEGER NOT NULL CHECK (option_number IN (1, 2, 3)),
  story_text TEXT NOT NULL,
  riddle_text TEXT NOT NULL,
  riddle_answer TEXT NOT NULL,
  hint_1 TEXT,
  hint_2 TEXT,
  madlib_word TEXT NOT NULL,
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(location_stop_id, option_number)
);

-- Create madlib_blank_fills table
CREATE TABLE public.madlib_blank_fills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hunt_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_story_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.madlib_blank_fills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hunt_stories
CREATE POLICY "Hosts can manage their hunt stories"
ON public.hunt_stories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.hunts h
    WHERE h.id = hunt_stories.hunt_id
    AND h.host_id = auth.uid()
  )
);

CREATE POLICY "Hunt stories viewable based on hunt visibility"
ON public.hunt_stories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hunts h
    WHERE h.id = hunt_stories.hunt_id
    AND (h.is_public = true OR h.host_id = auth.uid())
  )
);

-- RLS Policies for location_story_options
CREATE POLICY "Hosts can manage location story options"
ON public.location_story_options
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.location_stops ls
    JOIN public.hunts h ON h.id = ls.hunt_id
    WHERE ls.id = location_story_options.location_stop_id
    AND h.host_id = auth.uid()
  )
);

CREATE POLICY "Location story options viewable based on hunt visibility"
ON public.location_story_options
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.location_stops ls
    JOIN public.hunts h ON h.id = ls.hunt_id
    WHERE ls.id = location_story_options.location_stop_id
    AND (h.is_public = true OR h.host_id = auth.uid())
  )
);

-- RLS Policies for madlib_blank_fills
CREATE POLICY "Players can view madlib fills for their sessions"
ON public.madlib_blank_fills
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.player_hunt_sessions s
    WHERE s.hunt_id = madlib_blank_fills.hunt_id
    AND s.player_id = auth.uid()
  )
);

CREATE POLICY "Hosts can manage madlib fills for their hunts"
ON public.madlib_blank_fills
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.hunts h
    WHERE h.id = madlib_blank_fills.hunt_id
    AND h.host_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_hunt_stories_updated_at
BEFORE UPDATE ON public.hunt_stories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_location_story_options_updated_at
BEFORE UPDATE ON public.location_story_options
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_madlib_blank_fills_updated_at
BEFORE UPDATE ON public.madlib_blank_fills
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();