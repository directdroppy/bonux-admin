export type UserSegment = 'new' | 'elite' | 'premium' | 'premium_plus';

export type CampaignType =
  | 'percentage_discount'
  | 'fixed_discount'
  | 'buy_x_get_y'
  | 'points_multiplier'
  | 'free_product'
  | 'flash_sale'
  | 'group_deal'
  | 'birthday_special'
  | 'first_purchase'
  | 'win_back'
  | 'dopamin_wave'
  | 'stamp_card';

export type SurpriseBoxType = 'random_discount' | 'free_product' | 'vip_access' | 'points_bonus';

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export type BusinessCategory = 'cafe' | 'restaurant' | 'retail' | 'service' | 'health' | 'entertainment' | 'other';

export type ReferralStatus = 'pending' | 'active' | 'rewarded' | 'expired';

export type RewardSource = 'store' | 'surprise_box' | 'referral_bonus' | 'achievement';

export type RedemptionStatus = 'pending' | 'claimed' | 'expired' | 'cancelled';

export type AdminRole = 'super_admin' | 'admin' | 'analyst' | 'support';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          phone?: string;
          full_name?: string;
          avatar_url?: string;
          segment: UserSegment;
          segment_points: number;
          total_points: number;
          available_points: number;
          spent_points: number;
          total_savings: number;
          daily_streak: number;
          birth_date?: string;
          referral_code: string;
          referred_by?: string;
          notification_settings: any;
          preferences: any;
          device_tokens: string[];
          language: string;
          created_at: string;
          updated_at: string;
          last_active: string;
          is_active: boolean;
          onboarding_completed: boolean;
          interested_categories?: string[];
          budget_preference?: string;
          shopping_frequency?: string;
          preferred_location?: any;
          metadata: any;
          user_segment_history?: Array<{
            segment: UserSegment;
            date: string;
            points_at_change: number;
          }>;
          last_activity_date?: string;
          ghost_customer_flag?: boolean;
          ai_preferences?: {
            favorite_categories: string[];
            preferred_times: string[];
            spending_pattern: 'budget' | 'medium' | 'premium';
            preferred_discount_type: string[];
          };
          favorite_businesses?: string[];
          followed_businesses?: string[];
          surprise_box_eligible?: boolean;
          surprise_box_last_opened?: string;
          total_referrals?: number;
          successful_referrals?: number;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      businesses: {
        Row: {
          id: string;
          owner_id?: string;
          name: string;
          slug: string;
          description?: string;
          category: BusinessCategory;
          logo_url?: string;
          cover_url?: string;
          phone?: string;
          email?: string;
          website?: string;
          address: any;
          location?: {
            type: 'Point';
            coordinates: [number, number];
          };
          business_hours: any;
          rating: number;
          total_reviews: number;
          badges: string[];
          notification_credits: number;
          subscription_tier: SubscriptionTier;
          subscription_expires_at?: string;
          qr_code_data?: string;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          settings: any;
          analytics: any;
          premium_partner?: boolean;
          verified?: boolean;
          monthly_scan_limit?: number;
          monthly_scans_used?: number;
          personalized_boost_active?: boolean;
          analytics_enabled?: boolean;
        };
        Insert: Omit<Database['public']['Tables']['businesses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description?: string;
          campaign_type: CampaignType;
          config: any;
          target_segments: UserSegment[];
          start_date: string;
          end_date?: string;
          is_flash: boolean;
          flash_duration_hours?: number;
          max_redemptions?: number;
          current_redemptions: number;
          max_per_user: number;
          requires_qr_scan: boolean;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          analytics: any;
          segment_exclusive?: {
            new?: number;
            elite?: number;
            premium?: number;
            premium_plus?: number;
          };
          dopamin_wave_config?: {
            duration_days: number;
            trigger_after_purchases: number;
            activated_at?: string;
          };
          flash_sale_timer?: string;
          first_purchase_bonus?: number;
          group_deal_config?: {
            min_people: number;
            max_people?: number;
            discount_percentage: number;
          };
          ai_recommendation_score?: number;
          tags?: string[];
          name?: string;
          business_logo?: string;
          business_image?: string;
          banner_image?: string;
          discount_text?: string;
          discount_value?: number;
          category?: string;
          price_range?: 'budget' | 'medium' | 'premium';
          gradient_colors?: string[];
          show_in_personalized?: boolean;
          personalized_priority?: number;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      campaign_redemptions: {
        Row: {
          id: string;
          campaign_id: string;
          user_id: string;
          business_id: string;
          redeemed_at: string;
          qr_code: string;
          amount_saved: number;
          segment_at_redemption: UserSegment;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['campaign_redemptions']['Row'], 'id' | 'redeemed_at'>;
        Update: Partial<Database['public']['Tables']['campaign_redemptions']['Insert']>;
      };
      loyalty_cards: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          card_type: 'stamp_card' | 'points_multiplier' | 'visit_tracker';
          progress: {
            current: number;
            total: number;
            elite_bonus?: number;
          };
          completed_count: number;
          expiry_date?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['loyalty_cards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['loyalty_cards']['Insert']>;
      };
      platform_loyalty_programs: {
        Row: {
          id: string;
          program_name: string;
          program_type: 'getir_style' | 'points_based' | 'tier_based';
          description?: string;
          total_steps: number;
          reward_structure: any;
          target_segments?: UserSegment[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['platform_loyalty_programs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['platform_loyalty_programs']['Insert']>;
      };
      user_platform_loyalty: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          current_step: number;
          completed_steps: any;
          total_rewards_earned: number;
          program_completed: boolean;
          program_completed_count: number;
          last_step_completed_at?: string;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['user_platform_loyalty']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_platform_loyalty']['Insert']>;
      };
      reward_products: {
        Row: {
          id: string;
          business_id?: string;
          name: string;
          description?: string;
          image_url?: string;
          points_required: number;
          stock_quantity: number;
          category: string;
          is_available_in_store: boolean;
          is_available_in_surprise: boolean;
          surprise_weight: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['reward_products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reward_products']['Insert']>;
      };
      reward_redemptions: {
        Row: {
          id: string;
          user_id: string;
          reward_product_id: string;
          business_id?: string;
          points_spent: number;
          source: RewardSource;
          status: RedemptionStatus;
          redemption_code: string;
          qr_code?: string;
          redeemed_at: string;
          claimed_at?: string;
          expires_at?: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['reward_redemptions']['Row'], 'id' | 'redeemed_at'>;
        Update: Partial<Database['public']['Tables']['reward_redemptions']['Insert']>;
      };
      surprise_boxes: {
        Row: {
          id: string;
          user_id: string;
          box_type: SurpriseBoxType;
          opened: boolean;
          content: {
            discount_percentage?: number;
            discount_amount?: number;
            free_product_id?: string;
            vip_access_duration?: number;
            points_bonus?: number;
            message?: string;
          };
          expires_at: string;
          opened_at?: string;
          created_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['surprise_boxes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['surprise_boxes']['Insert']>;
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id?: string;
          referral_code: string;
          bonus_earned: number;
          referred_purchase_count: number;
          status: ReferralStatus;
          created_at: string;
          activated_at?: string;
          rewarded_at?: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          rating: number;
          comment?: string;
          is_verified: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      staff_members: {
        Row: {
          id: string;
          business_id: string;
          user_id?: string;
          email: string;
          full_name: string;
          role: 'owner' | 'manager' | 'staff';
          permissions: any;
          is_active: boolean;
          invited_at: string;
          accepted_at?: string;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['staff_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['staff_members']['Insert']>;
      };
      business_notifications: {
        Row: {
          id: string;
          business_id: string;
          type: 'new_redemption' | 'milestone' | 'review' | 'alert' | 'system';
          title: string;
          message: string;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          is_read: boolean;
          action_url?: string;
          created_at: string;
          read_at?: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['business_notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['business_notifications']['Insert']>;
      };
      user_behavior_analytics: {
        Row: {
          id: string;
          user_id: string;
          search_history: Array<{
            query: string;
            timestamp: string;
            results_count: number;
          }>;
          clicked_campaigns: string[];
          favorite_categories: string[];
          preferred_times: Array<{
            day: string;
            hour: number;
          }>;
          spending_patterns: {
            average_transaction: number;
            total_spent: number;
            preferred_price_range: string;
          };
          ai_segment_prediction?: UserSegment;
          last_analyzed: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_behavior_analytics']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_behavior_analytics']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          full_name: string;
          role: AdminRole;
          permissions: string[];
          is_active: boolean;
          last_login?: string;
          created_at: string;
          updated_at: string;
          metadata?: any;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Row']>;
      };
    };
    Functions: {
      // Add RPC function types here if needed
      [key: string]: any;
    };
  };
}
