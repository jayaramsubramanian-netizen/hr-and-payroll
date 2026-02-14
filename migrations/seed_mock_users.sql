-- AVLM ERP: Seed Mock Users with Credentials
-- Run this in Supabase SQL Editor to create test users

-- Step 1: Create Auth Users (you'll need to do this via Supabase Dashboard or API)
-- This SQL focuses on updating the users table with emails

-- HR Manager
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'HR001',
  'Rohan Kumar',
  'rohan@avlm.com',
  'rohan@avlm.com',
  'HR/Payroll',
  'Administration',
  'HR Manager',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;

-- Manager 1
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'MAN001',
  'Rajesh Singh',
  'manager1@avlm.com',
  'manager1@avlm.com',
  'Manager',
  'Machining',
  'Department Manager',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;

-- Manager 2
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'MAN002',
  'Priya Sharma',
  'manager2@avlm.com',
  'manager2@avlm.com',
  'Manager',
  'Assembly',
  'Department Manager',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;

-- CEO
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'CEO001',
  'Vikram Patel',
  'ceo@avlm.com',
  'ceo@avlm.com',
  'Management',
  'Corporate',
  'Chief Executive Officer',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;

-- Employee 1
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'EMP001',
  'Amit Gupta',
  'employee1@avlm.com',
  'employee1@avlm.com',
  'Employee',
  'Machining',
  'Machine Operator',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;

-- Employee 2
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status, created_at)
VALUES (
  'EMP002',
  'Sneha Desai',
  'employee2@avlm.com',
  'employee2@avlm.com',
  'Employee',
  'Assembly',
  'Assembly Technician',
  'Active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  personal_email = EXCLUDED.personal_email,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  designation = EXCLUDED.designation,
  employment_status = EXCLUDED.employment_status;
