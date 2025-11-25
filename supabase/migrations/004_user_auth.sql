-- Migration: Add user_id to collection_plans for user authentication
-- This allows users to save and own their collection plans

-- Add user_id column to collection_plans if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collection_plans' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE collection_plans 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_collection_plans_user_id ON collection_plans(user_id);

-- Enable Row Level Security on collection_plans
ALTER TABLE collection_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own plans (and plans without user_id for backwards compatibility)
DROP POLICY IF EXISTS "Users can view own plans" ON collection_plans;
CREATE POLICY "Users can view own plans" ON collection_plans
    FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

-- Policy: Users can update their own plans
DROP POLICY IF EXISTS "Users can update own plans" ON collection_plans;
CREATE POLICY "Users can update own plans" ON collection_plans
    FOR UPDATE
    USING (user_id IS NULL OR user_id = auth.uid());

-- Policy: Anyone can insert new plans (they can claim them later)
DROP POLICY IF EXISTS "Anyone can insert plans" ON collection_plans;
CREATE POLICY "Anyone can insert plans" ON collection_plans
    FOR INSERT
    WITH CHECK (true);

-- Policy: Users can delete their own plans
DROP POLICY IF EXISTS "Users can delete own plans" ON collection_plans;
CREATE POLICY "Users can delete own plans" ON collection_plans
    FOR DELETE
    USING (user_id = auth.uid());

-- Also add RLS to collection_skus
ALTER TABLE collection_skus ENABLE ROW LEVEL SECURITY;

-- SKUs inherit permissions from their parent plan
DROP POLICY IF EXISTS "Users can view skus of accessible plans" ON collection_skus;
CREATE POLICY "Users can view skus of accessible plans" ON collection_skus
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collection_plans 
            WHERE collection_plans.id = collection_skus.collection_plan_id
            AND (collection_plans.user_id IS NULL OR collection_plans.user_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can modify skus of own plans" ON collection_skus;
CREATE POLICY "Users can modify skus of own plans" ON collection_skus
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM collection_plans 
            WHERE collection_plans.id = collection_skus.collection_plan_id
            AND (collection_plans.user_id IS NULL OR collection_plans.user_id = auth.uid())
        )
    );

-- Supabase Auth: Disable email confirmation requirement
-- Note: This should be done in Supabase Dashboard > Authentication > Settings
-- Set "Enable email confirmations" to OFF for development

COMMENT ON COLUMN collection_plans.user_id IS 'References the authenticated user who owns this plan';
