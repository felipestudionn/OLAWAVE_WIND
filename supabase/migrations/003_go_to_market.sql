-- Migration: Go to Market tables
-- Creates drops and commercial_actions tables for GTM planning

-- Drops table: Groups of SKUs with launch dates and stories
CREATE TABLE IF NOT EXISTS drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_plan_id UUID NOT NULL REFERENCES collection_plans(id) ON DELETE CASCADE,
  
  -- Drop identification
  drop_number INTEGER NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  
  -- Timing
  launch_date DATE NOT NULL,
  end_date DATE, -- When the drop "ends" for sales curve calculation
  weeks_active INTEGER DEFAULT 8, -- How many weeks this drop contributes to sales
  
  -- Story/Theme
  story_name VARCHAR(255),
  story_description TEXT,
  
  -- Channel targeting (if null, applies to all channels)
  channels TEXT[] DEFAULT ARRAY['DTC', 'WHOLESALE'],
  
  -- Position in timeline (for drag/drop ordering)
  position INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(collection_plan_id, drop_number)
);

-- Commercial Actions table: Marketing events, collabs, sales, etc.
CREATE TABLE IF NOT EXISTS commercial_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_plan_id UUID NOT NULL REFERENCES collection_plans(id) ON DELETE CASCADE,
  
  -- Action details
  name VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- SALE, COLLAB, CAMPAIGN, SEEDING, EVENT, OTHER
  
  -- Timing
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Category/Purpose
  category VARCHAR(100), -- VISIBILIDAD, POSICIONAMIENTO, VENTAS, BUZZ, NOTORIEDAD
  
  -- Associated brand/partner (for collabs)
  partner_name VARCHAR(255),
  partner_logo_url TEXT,
  
  -- Description and notes
  description TEXT,
  
  -- Impact estimation (optional)
  expected_traffic_boost DECIMAL(5,2), -- % increase in traffic
  expected_sales_boost DECIMAL(5,2), -- % increase in sales
  
  -- Channel targeting
  channels TEXT[] DEFAULT ARRAY['DTC', 'WHOLESALE'],
  
  -- Position in timeline
  position INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Market Predictions table: Stores AI-generated demand curves
CREATE TABLE IF NOT EXISTS market_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_plan_id UUID NOT NULL REFERENCES collection_plans(id) ON DELETE CASCADE,
  
  -- Prediction data
  prediction_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Weekly predictions as JSONB array
  -- Format: [{ week: "2024-W01", predicted_sales: 50000, demand_index: 0.8, notes: "..." }]
  weekly_predictions JSONB NOT NULL DEFAULT '[]',
  
  -- Summary insights
  insights TEXT,
  gaps_detected TEXT[], -- Array of detected gaps/issues
  recommendations TEXT[],
  
  -- Model info
  model_version VARCHAR(50) DEFAULT 'gemini-2.5-flash',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add drop_id to collection_skus to link SKUs to specific drops
ALTER TABLE collection_skus 
ADD COLUMN IF NOT EXISTS drop_id UUID REFERENCES drops(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drops_collection_plan ON drops(collection_plan_id);
CREATE INDEX IF NOT EXISTS idx_drops_launch_date ON drops(launch_date);
CREATE INDEX IF NOT EXISTS idx_commercial_actions_collection_plan ON commercial_actions(collection_plan_id);
CREATE INDEX IF NOT EXISTS idx_commercial_actions_dates ON commercial_actions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_market_predictions_collection_plan ON market_predictions(collection_plan_id);
CREATE INDEX IF NOT EXISTS idx_skus_drop ON collection_skus(drop_id);

-- Update trigger for drops
CREATE OR REPLACE FUNCTION update_drops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_drops_updated_at
  BEFORE UPDATE ON drops
  FOR EACH ROW
  EXECUTE FUNCTION update_drops_updated_at();

-- Update trigger for commercial_actions
CREATE TRIGGER trigger_commercial_actions_updated_at
  BEFORE UPDATE ON commercial_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_drops_updated_at();

-- Enable RLS
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on drops" ON drops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on commercial_actions" ON commercial_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on market_predictions" ON market_predictions FOR ALL USING (true) WITH CHECK (true);
