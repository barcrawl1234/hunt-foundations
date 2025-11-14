export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          hunt_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          hunt_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          hunt_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clues: {
        Row: {
          created_at: string
          difficulty: Database["public"]["Enums"]["clue_difficulty"]
          hunt_id: string
          id: string
          is_mandatory: boolean
          location_stop_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["clue_difficulty"]
          hunt_id: string
          id?: string
          is_mandatory?: boolean
          location_stop_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["clue_difficulty"]
          hunt_id?: string
          id?: string
          is_mandatory?: boolean
          location_stop_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clues_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clues_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      hunt_stories: {
        Row: {
          created_at: string
          final_madlib_template: string | null
          final_passphrase: string | null
          hunt_id: string
          id: string
          intro_scene_1: string | null
          intro_scene_2: string | null
          intro_scene_3: string | null
          theme: string | null
          tone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          final_madlib_template?: string | null
          final_passphrase?: string | null
          hunt_id: string
          id?: string
          intro_scene_1?: string | null
          intro_scene_2?: string | null
          intro_scene_3?: string | null
          theme?: string | null
          tone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          final_madlib_template?: string | null
          final_passphrase?: string | null
          hunt_id?: string
          id?: string
          intro_scene_1?: string | null
          intro_scene_2?: string | null
          intro_scene_3?: string | null
          theme?: string | null
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hunt_stories_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: true
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      hunts: {
        Row: {
          base_ticket_price: number
          city: string | null
          created_at: string
          description: string | null
          estimated_duration_minutes: number | null
          host_id: string
          id: string
          is_public: boolean
          start_mode: Database["public"]["Enums"]["hunt_start_mode"]
          status: Database["public"]["Enums"]["hunt_status"]
          theme: string | null
          title: string
          updated_at: string
        }
        Insert: {
          base_ticket_price?: number
          city?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          host_id: string
          id?: string
          is_public?: boolean
          start_mode?: Database["public"]["Enums"]["hunt_start_mode"]
          status?: Database["public"]["Enums"]["hunt_status"]
          theme?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          base_ticket_price?: number
          city?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          host_id?: string
          id?: string
          is_public?: boolean
          start_mode?: Database["public"]["Enums"]["hunt_start_mode"]
          status?: Database["public"]["Enums"]["hunt_status"]
          theme?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hunts_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          created_at: string
          description: string | null
          hunt_id: string
          icon_key: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hunt_id: string
          icon_key?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hunt_id?: string
          icon_key?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      location_stops: {
        Row: {
          address: string | null
          created_at: string
          hunt_id: string
          id: string
          is_final_stop: boolean
          name: string
          order_index: number
          qr_code_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          hunt_id: string
          id?: string
          is_final_stop?: boolean
          name: string
          order_index: number
          qr_code_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          hunt_id?: string
          id?: string
          is_final_stop?: boolean
          name?: string
          order_index?: number
          qr_code_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_stops_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      location_story_options: {
        Row: {
          created_at: string
          hint_1: string | null
          hint_2: string | null
          id: string
          is_selected: boolean | null
          location_stop_id: string
          madlib_word: string
          option_number: number
          riddle_answer: string
          riddle_text: string
          story_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hint_1?: string | null
          hint_2?: string | null
          id?: string
          is_selected?: boolean | null
          location_stop_id: string
          madlib_word: string
          option_number: number
          riddle_answer: string
          riddle_text: string
          story_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hint_1?: string | null
          hint_2?: string | null
          id?: string
          is_selected?: boolean | null
          location_stop_id?: string
          madlib_word?: string
          option_number?: number
          riddle_answer?: string
          riddle_text?: string
          story_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_story_options_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      madlib_blank_fills: {
        Row: {
          created_at: string
          hunt_id: string
          id: string
          location_stop_id: string
          updated_at: string
          word: string
        }
        Insert: {
          created_at?: string
          hunt_id: string
          id?: string
          location_stop_id: string
          updated_at?: string
          word: string
        }
        Update: {
          created_at?: string
          hunt_id?: string
          id?: string
          location_stop_id?: string
          updated_at?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "madlib_blank_fills_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "madlib_blank_fills_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          description: string | null
          hunt_id: string
          id: string
          is_active: boolean
          location_stop_id: string
          sponsor_id: string
          terms: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hunt_id: string
          id?: string
          is_active?: boolean
          location_stop_id: string
          sponsor_id: string
          terms?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hunt_id?: string
          id?: string
          is_active?: boolean
          location_stop_id?: string
          sponsor_id?: string
          terms?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          currency: string
          hunt_id: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          transaction_reference: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          hunt_id: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_reference?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          hunt_id?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_reference?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_hunt_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_location_stop_id: string | null
          hunt_id: string
          id: string
          player_id: string
          started_at: string
          status: Database["public"]["Enums"]["session_status"]
          team_name: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_location_stop_id?: string | null
          hunt_id: string
          id?: string
          player_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          team_name?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_location_stop_id?: string | null
          hunt_id?: string
          id?: string
          player_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          team_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_hunt_sessions_current_location_stop_id_fkey"
            columns: ["current_location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_hunt_sessions_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_hunt_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_progress: {
        Row: {
          clue_id: string | null
          created_at: string
          id: string
          is_solved: boolean
          location_stop_id: string
          player_hunt_session_id: string
          puzzle_id: string | null
          solved_at: string | null
          updated_at: string
        }
        Insert: {
          clue_id?: string | null
          created_at?: string
          id?: string
          is_solved?: boolean
          location_stop_id: string
          player_hunt_session_id: string
          puzzle_id?: string | null
          solved_at?: string | null
          updated_at?: string
        }
        Update: {
          clue_id?: string | null
          created_at?: string
          id?: string
          is_solved?: boolean
          location_stop_id?: string
          player_hunt_session_id?: string
          puzzle_id?: string | null
          solved_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_progress_clue_id_fkey"
            columns: ["clue_id"]
            isOneToOne: false
            referencedRelation: "clues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_player_hunt_session_id_fkey"
            columns: ["player_hunt_session_id"]
            isOneToOne: false
            referencedRelation: "player_hunt_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_progress_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          created_at: string
          hunt_id: string
          id: string
          location_stop_id: string
          prompt: string
          solution_data: Json | null
          type: Database["public"]["Enums"]["puzzle_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          hunt_id: string
          id?: string
          location_stop_id: string
          prompt: string
          solution_data?: Json | null
          type?: Database["public"]["Enums"]["puzzle_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          hunt_id?: string
          id?: string
          location_stop_id?: string
          prompt?: string
          solution_data?: Json | null
          type?: Database["public"]["Enums"]["puzzle_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "puzzles_location_stop_id_fkey"
            columns: ["location_stop_id"]
            isOneToOne: false
            referencedRelation: "location_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          business_name: string
          contact_email: string | null
          contact_name: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          business_name: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      waivers: {
        Row: {
          business_name: string
          created_at: string
          hunt_id: string | null
          id: string
          signature_data: string
          signed_at: string
          signed_document_url: string | null
          signer_ip_address: string | null
          signer_name: string
          signer_title: string | null
          signer_user_agent: string | null
          sponsor_id: string | null
          updated_at: string
        }
        Insert: {
          business_name: string
          created_at?: string
          hunt_id?: string | null
          id?: string
          signature_data: string
          signed_at?: string
          signed_document_url?: string | null
          signer_ip_address?: string | null
          signer_name: string
          signer_title?: string | null
          signer_user_agent?: string | null
          sponsor_id?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string
          created_at?: string
          hunt_id?: string | null
          id?: string
          signature_data?: string
          signed_at?: string
          signed_document_url?: string | null
          signer_ip_address?: string | null
          signer_name?: string
          signer_title?: string | null
          signer_user_agent?: string | null
          sponsor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waivers_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waivers_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "PLAYER" | "HOST" | "SUPER_ADMIN"
      clue_difficulty: "EASY" | "MEDIUM" | "HARD"
      hunt_start_mode: "FIXED_START" | "FLEXIBLE_START"
      hunt_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      payment_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
      payment_type: "TICKET" | "UPSELL" | "SPONSORSHIP"
      puzzle_type:
        | "RIDDLE"
        | "LOGIC"
        | "SEQUENCE"
        | "VISUAL"
        | "MINI_GAME"
        | "OTHER"
      session_status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["PLAYER", "HOST", "SUPER_ADMIN"],
      clue_difficulty: ["EASY", "MEDIUM", "HARD"],
      hunt_start_mode: ["FIXED_START", "FLEXIBLE_START"],
      hunt_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      payment_status: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      payment_type: ["TICKET", "UPSELL", "SPONSORSHIP"],
      puzzle_type: [
        "RIDDLE",
        "LOGIC",
        "SEQUENCE",
        "VISUAL",
        "MINI_GAME",
        "OTHER",
      ],
      session_status: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
    },
  },
} as const
