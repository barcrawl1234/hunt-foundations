-- Create enum types
CREATE TYPE app_role AS ENUM ('PLAYER', 'HOST', 'SUPER_ADMIN');
CREATE TYPE hunt_start_mode AS ENUM ('FIXED_START', 'FLEXIBLE_START');
CREATE TYPE hunt_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE clue_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE puzzle_type AS ENUM ('RIDDLE', 'LOGIC', 'SEQUENCE', 'VISUAL', 'MINI_GAME', 'OTHER');
CREATE TYPE session_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');
CREATE TYPE payment_type AS ENUM ('TICKET', 'UPSELL', 'SPONSORSHIP');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'PLAYER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create hunts table
CREATE TABLE public.hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  theme TEXT,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_mode hunt_start_mode NOT NULL DEFAULT 'FLEXIBLE_START',
  base_ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status hunt_status NOT NULL DEFAULT 'DRAFT',
  estimated_duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hunts ENABLE ROW LEVEL SECURITY;

-- Hunts policies
CREATE POLICY "Public hunts are viewable by everyone"
  ON public.hunts FOR SELECT
  USING (is_public = true OR host_id = auth.uid());

CREATE POLICY "Hosts can manage their own hunts"
  ON public.hunts FOR ALL
  USING (host_id = auth.uid());

-- Create location_stops table
CREATE TABLE public.location_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  order_index INTEGER NOT NULL,
  is_final_stop BOOLEAN NOT NULL DEFAULT false,
  qr_code_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.location_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Location stops viewable based on hunt visibility"
  ON public.location_stops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND (h.is_public = true OR h.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage location stops for their hunts"
  ON public.location_stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND h.host_id = auth.uid()
    )
  );

-- Create clues table
CREATE TABLE public.clues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  difficulty clue_difficulty NOT NULL DEFAULT 'MEDIUM',
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clues viewable based on hunt visibility"
  ON public.clues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND (h.is_public = true OR h.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage clues for their hunts"
  ON public.clues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND h.host_id = auth.uid()
    )
  );

-- Create puzzles table
CREATE TABLE public.puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  type puzzle_type NOT NULL DEFAULT 'OTHER',
  prompt TEXT NOT NULL,
  solution_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Puzzles viewable based on hunt visibility"
  ON public.puzzles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND (h.is_public = true OR h.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage puzzles for their hunts"
  ON public.puzzles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND h.host_id = auth.uid()
    )
  );

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory items viewable based on hunt visibility"
  ON public.inventory_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND (h.is_public = true OR h.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage inventory items for their hunts"
  ON public.inventory_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND h.host_id = auth.uid()
    )
  );

-- Create player_hunt_sessions table
CREATE TABLE public.player_hunt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  team_name TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status session_status NOT NULL DEFAULT 'IN_PROGRESS',
  current_location_stop_id UUID REFERENCES public.location_stops(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.player_hunt_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own sessions"
  ON public.player_hunt_sessions FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Players can create their own sessions"
  ON public.player_hunt_sessions FOR INSERT
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update their own sessions"
  ON public.player_hunt_sessions FOR UPDATE
  USING (player_id = auth.uid());

-- Create player_progress table
CREATE TABLE public.player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_hunt_session_id UUID NOT NULL REFERENCES public.player_hunt_sessions(id) ON DELETE CASCADE,
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  clue_id UUID REFERENCES public.clues(id) ON DELETE SET NULL,
  puzzle_id UUID REFERENCES public.puzzles(id) ON DELETE SET NULL,
  is_solved BOOLEAN NOT NULL DEFAULT false,
  solved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own progress"
  ON public.player_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.player_hunt_sessions s
      WHERE s.id = player_hunt_session_id AND s.player_id = auth.uid()
    )
  );

CREATE POLICY "Players can manage their own progress"
  ON public.player_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.player_hunt_sessions s
      WHERE s.id = player_hunt_session_id AND s.player_id = auth.uid()
    )
  );

-- Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors viewable by authenticated users"
  ON public.sponsors FOR SELECT
  TO authenticated
  USING (true);

-- Create offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  location_stop_id UUID NOT NULL REFERENCES public.location_stops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  terms TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offers viewable based on hunt visibility"
  ON public.offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hunts h
      WHERE h.id = hunt_id AND (h.is_public = true OR h.host_id = auth.uid())
    )
  );

-- Create waivers table
CREATE TABLE public.waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID REFERENCES public.hunts(id) ON DELETE SET NULL,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signer_title TEXT,
  signature_data TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  signer_ip_address TEXT,
  signer_user_agent TEXT,
  signed_document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Waivers viewable by authenticated users"
  ON public.waivers FOR SELECT
  TO authenticated
  USING (true);

-- Create payment_records table
CREATE TABLE public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'PENDING',
  transaction_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment records"
  ON public.payment_records FOR SELECT
  USING (user_id = auth.uid());

-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  hunt_id UUID REFERENCES public.hunts(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Analytics events viewable by super admin"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'SUPER_ADMIN'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_hunts_updated_at BEFORE UPDATE ON public.hunts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_location_stops_updated_at BEFORE UPDATE ON public.location_stops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_clues_updated_at BEFORE UPDATE ON public.clues
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_puzzles_updated_at BEFORE UPDATE ON public.puzzles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_player_hunt_sessions_updated_at BEFORE UPDATE ON public.player_hunt_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_player_progress_updated_at BEFORE UPDATE ON public.player_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_waivers_updated_at BEFORE UPDATE ON public.waivers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payment_records_updated_at BEFORE UPDATE ON public.payment_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'PLAYER'::app_role)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();