-- Run this SQL directly in Supabase SQL Editor to bypass RLS and create users

-- Disable RLS temporarily for users table (SQL Editor runs as superuser)
INSERT INTO users (id, name, role, department) VALUES
  ('HR001', 'Rohan Kumar', 'HR/Payroll', 'Administration'),
  ('MAN001', 'Rajesh Singh', 'Manager', 'Machining'),
  ('MAN002', 'Priya Sharma', 'Manager', 'Assembly'),
  ('CEO001', 'Vikram Patel', 'Management', 'Corporate'),
  ('EMP001', 'Amit Gupta', 'Employee', 'Machining'),
  ('EMP002', 'Sneha Desai', 'Employee', 'Assembly')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department;

-- Verify insertion
SELECT id, name, role, department FROM users 
WHERE id IN ('HR001', 'MAN001', 'MAN002', 'CEO001', 'EMP001', 'EMP002');
