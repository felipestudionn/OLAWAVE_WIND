export interface Signal {
  id: string;
  signal_name: string;
  signal_type: 'item' | 'brand' | 'style' | string;
  location: string;
  period_start: string | null;
  period_end: string | null;
  reddit_mentions: number;
  reddit_avg_engagement: number;
  youtube_video_count: number;
  youtube_total_views: number;
  pinterest_pin_count: number;
  pinterest_total_saves: number;
  composite_score: number;
  acceleration_factor: number;
  platforms_present: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  report_date: string | null;
  location: string | null;
  top_signals: any;
  pdf_url: string | null;
  status: 'pending' | 'completed' | 'failed' | string;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}
