-- Migration: Create collection_skus table
-- Run this in your Supabase SQL Editor if the table doesn't exist

-- Create collection_skus table
CREATE TABLE IF NOT EXISTS collection_skus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_plan_id UUID NOT NULL REFERENCES collection_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) DEFAULT 'ROPA' CHECK (category IN ('CALZADO', 'ROPA', 'ACCESORIOS')),
  family VARCHAR(100),
  drop_number INTEGER DEFAULT 1,
  type VARCHAR(20) DEFAULT 'REVENUE' CHECK (type IN ('IMAGEN', 'ENTRY', 'REVENUE')),
  pvp DECIMAL(10,2) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(5,2) DEFAULT 0,
  final_price DECIMAL(10,2) DEFAULT 0,
  buy_units INTEGER DEFAULT 0,
  sale_percentage DECIMAL(5,2) DEFAULT 60,
  expected_sales DECIMAL(12,2) DEFAULT 0,
  margin DECIMAL(5,2) DEFAULT 0,
  channel VARCHAR(20) DEFAULT 'DTC' CHECK (channel IN ('DTC', 'WHOLESALE', 'BOTH')),
  launch_date DATE,
  notes TEXT,
  reference_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by collection_plan_id
CREATE INDEX IF NOT EXISTS idx_collection_skus_plan_id ON collection_skus(collection_plan_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_collection_skus_updated_at ON collection_skus;
CREATE TRIGGER update_collection_skus_updated_at
  BEFORE UPDATE ON collection_skus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE collection_skus ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (adjust based on your auth setup)
CREATE POLICY "Allow all operations on collection_skus" ON collection_skus
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON collection_skus TO authenticated;
GRANT ALL ON collection_skus TO service_role;
