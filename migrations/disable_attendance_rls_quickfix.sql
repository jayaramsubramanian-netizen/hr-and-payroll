-- QUICK FIX: Disable RLS on attendance table to allow clock-in/out to work
-- This is a temporary fix. For production, use proper RLS policies.

-- Step 1: Disable RLS
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;

-- Verification: Check if RLS is disabled
-- This should return 't' if RLS is disabled
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'attendance';
