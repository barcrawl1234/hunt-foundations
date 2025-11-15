-- Add play_order and final_stop_mode to hunts table
DO $$ BEGIN
  CREATE TYPE play_order_type AS ENUM ('FLEXIBLE', 'LINEAR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE final_stop_mode_type AS ENUM ('NO_FINAL_STOP', 'HAS_FINAL_STOP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE hunts 
ADD COLUMN IF NOT EXISTS play_order play_order_type DEFAULT 'FLEXIBLE',
ADD COLUMN IF NOT EXISTS final_stop_mode final_stop_mode_type DEFAULT 'HAS_FINAL_STOP';

-- Add hint_3 to location_story_options if missing
ALTER TABLE location_story_options
ADD COLUMN IF NOT EXISTS hint_3 text;

-- Add blank_key to location_story_options if missing
ALTER TABLE location_story_options
ADD COLUMN IF NOT EXISTS blank_key text;