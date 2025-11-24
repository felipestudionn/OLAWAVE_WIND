-- Migration: Ensure collection_skus table has all required columns
-- This script is idempotent - safe to run multiple times

-- Add missing columns if they don't exist (PostgreSQL will skip if they already exist)
DO $$ 
BEGIN
    -- Add collection_plan_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'collection_plan_id'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN collection_plan_id UUID REFERENCES collection_plans(id);
    END IF;

    -- Add name if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'name'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN name TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add category if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'category'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN category TEXT;
    END IF;

    -- Add family if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'family'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN family TEXT;
    END IF;

    -- Add type if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'type'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN type TEXT;
    END IF;

    -- Add channel if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'channel'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN channel TEXT;
    END IF;

    -- Add drop_number if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'drop_number'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN drop_number INTEGER;
    END IF;

    -- Add pvp if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'pvp'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN pvp DECIMAL;
    END IF;

    -- Add cost if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'cost'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN cost DECIMAL;
    END IF;

    -- Add discount if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'discount'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN discount DECIMAL DEFAULT 0;
    END IF;

    -- Add final_price if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'final_price'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN final_price DECIMAL;
    END IF;

    -- Add buy_units if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'buy_units'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN buy_units INTEGER;
    END IF;

    -- Add sale_percentage if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'sale_percentage'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN sale_percentage DECIMAL DEFAULT 60;
    END IF;

    -- Add expected_sales if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'expected_sales'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN expected_sales DECIMAL;
    END IF;

    -- Add margin if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'margin'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN margin DECIMAL;
    END IF;

    -- Add launch_date if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'launch_date'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN launch_date DATE;
    END IF;

    -- Add notes if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'notes'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN notes TEXT;
    END IF;

    -- Add reference_image_url if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'reference_image_url'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN reference_image_url TEXT;
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
    END IF;

    -- Add updated_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_skus' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE collection_skus ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- Create index on collection_plan_id for faster queries
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

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'collection_skus'
ORDER BY ordinal_position;
