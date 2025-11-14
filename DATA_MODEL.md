# Data Model Documentation

## Entity Relationship Overview

This document describes the complete database schema for HuntQuest.

## Core Entities

### 1. Profiles (User Extension)
Extends `auth.users` with application-specific data.

```sql
- id: UUID (references auth.users)
- name: TEXT
- role: app_role (PLAYER, HOST, SUPER_ADMIN)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 2. Hunts
Story-driven bar crawl experiences.

```sql
- id: UUID
- title: TEXT
- description: TEXT
- city: TEXT
- is_public: BOOLEAN
- theme: TEXT
- host_id: UUID → profiles(id)
- start_mode: hunt_start_mode (FIXED_START, FLEXIBLE_START)
- base_ticket_price: DECIMAL
- status: hunt_status (DRAFT, PUBLISHED, ARCHIVED)
- estimated_duration_minutes: INTEGER
- created_at, updated_at: TIMESTAMPTZ
```

### 3. Location Stops
Individual bar/location stops within a hunt.

```sql
- id: UUID
- hunt_id: UUID → hunts(id)
- name: TEXT
- address: TEXT
- order_index: INTEGER
- is_final_stop: BOOLEAN
- qr_code_id: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

### 4. Clues
Story clues at each location.

```sql
- id: UUID
- hunt_id: UUID → hunts(id)
- location_stop_id: UUID → location_stops(id)
- text: TEXT
- difficulty: clue_difficulty (EASY, MEDIUM, HARD)
- is_mandatory: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

### 5. Puzzles
Interactive challenges at locations.

```sql
- id: UUID
- hunt_id: UUID → hunts(id)
- location_stop_id: UUID → location_stops(id)
- type: puzzle_type (RIDDLE, LOGIC, SEQUENCE, VISUAL, MINI_GAME, OTHER)
- prompt: TEXT
- solution_data: JSONB
- created_at, updated_at: TIMESTAMPTZ
```

### 6. Inventory Items
Collectible items within hunts.

```sql
- id: UUID
- hunt_id: UUID → hunts(id)
- name: TEXT
- description: TEXT
- icon_key: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

### 7. Player Hunt Sessions
Active or completed player game sessions.

```sql
- id: UUID
- player_id: UUID → profiles(id)
- hunt_id: UUID → hunts(id)
- team_name: TEXT (nullable)
- started_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ (nullable)
- status: session_status (IN_PROGRESS, COMPLETED, ABANDONED)
- current_location_stop_id: UUID → location_stops(id)
- created_at, updated_at: TIMESTAMPTZ
```

### 8. Player Progress
Tracks puzzle/clue completion.

```sql
- id: UUID
- player_hunt_session_id: UUID → player_hunt_sessions(id)
- location_stop_id: UUID → location_stops(id)
- clue_id: UUID → clues(id) (nullable)
- puzzle_id: UUID → puzzles(id) (nullable)
- is_solved: BOOLEAN
- solved_at: TIMESTAMPTZ (nullable)
- created_at, updated_at: TIMESTAMPTZ
```

### 9. Sponsors
Bar/venue sponsors.

```sql
- id: UUID
- business_name: TEXT
- contact_name: TEXT
- contact_email: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

### 10. Offers
Drink/food deals at locations.

```sql
- id: UUID
- sponsor_id: UUID → sponsors(id)
- hunt_id: UUID → hunts(id)
- location_stop_id: UUID → location_stops(id)
- title: TEXT
- description: TEXT
- terms: TEXT
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

### 11. Waivers
Legal waivers for liability.

```sql
- id: UUID
- hunt_id: UUID → hunts(id) (nullable)
- sponsor_id: UUID → sponsors(id)
- business_name: TEXT
- signer_name: TEXT
- signer_title: TEXT
- signature_data: TEXT
- signed_at: TIMESTAMPTZ
- signer_ip_address: TEXT
- signer_user_agent: TEXT
- signed_document_url: TEXT (nullable)
- created_at, updated_at: TIMESTAMPTZ
```

### 12. Payment Records
Transaction tracking.

```sql
- id: UUID
- user_id: UUID → profiles(id)
- hunt_id: UUID → hunts(id)
- amount: DECIMAL
- currency: TEXT
- type: payment_type (TICKET, UPSELL, SPONSORSHIP)
- status: payment_status (PENDING, COMPLETED, FAILED, REFUNDED)
- transaction_reference: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

### 13. Analytics Events
Platform event tracking.

```sql
- id: UUID
- user_id: UUID → profiles(id) (nullable)
- hunt_id: UUID → hunts(id) (nullable)
- event_type: TEXT
- metadata: JSONB
- created_at: TIMESTAMPTZ
```

## Relationships

- **Hunt → Location Stops** (1:many)
- **Location Stop → Clues** (1:many)
- **Location Stop → Puzzles** (1:many)
- **Hunt → Inventory Items** (1:many)
- **Player → Hunt Sessions** (1:many)
- **Hunt Session → Progress Entries** (1:many)
- **Sponsor → Offers** (1:many)
- **Location Stop → Offers** (1:many)
