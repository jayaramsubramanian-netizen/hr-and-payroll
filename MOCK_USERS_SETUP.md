# 🔐 Mock User Setup Guide for AVLM ERP

## Overview
This guide will help you set up mock users with email/password credentials for testing your HR and Payroll system.

## Quick Setup Options

### Option 1: Manual Setup via Supabase Dashboard (Recommended for Quick Testing)

#### Step 1: Create Auth Users in Supabase
1. Go to https://app.supabase.com
2. Select your project: **efqidaikwcjlohmyypfy** 
3. Navigate to **Authentication > Users**
4. Click **Add User** and create the following accounts:

**HR Manager**
- Email: `rohan@avlm.com`
- Password: `HR001pass`
- Email Confirmed: ✓

**Manager 1 (Machining)**
- Email: `manager1@avlm.com`
- Password: `MAN001pass`
- Email Confirmed: ✓

**Manager 2 (Assembly)**
- Email: `manager2@avlm.com`
- Password: `MAN002pass`
- Email Confirmed: ✓

**CEO**
- Email: `ceo@avlm.com`
- Password: `CEO001pass`
- Email Confirmed: ✓

**Employee 1**
- Email: `employee1@avlm.com`
- Password: `EMP001pass`
- Email Confirmed: ✓

**Employee 2**
- Email: `employee2@avlm.com`
- Password: `EMP002pass`
- Email Confirmed: ✓

#### Step 2: Run the SQL Migration
1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `migrations/seed_mock_users.sql`
4. Click **Run**
5. The users table will be updated with the user records

#### Step 3: Test Login
- Go to your application
- Select **Sign In** tab
- Choose **Email/Password** method
- Use any of the email/password combinations above

---

### Option 2: Automated Setup via Node.js Script

If you have Supabase Service Key access:

1. Get your Service Key from Supabase dashboard:
   - Go to Settings > API
   - Copy the `service_role` key

2. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

3. Run the seed script:
   ```bash
   node scripts/seedMockUsers.mjs
   ```

This will automatically:
- Create auth users in Supabase
- Update the users table with employee records

---

## 📋 User Credentials Reference

| Role | Employee ID | Email | Password | Department |
|------|---|---|---|---|
| HR Manager | HR001 | rohan@avlm.com | HR001pass | Administration |
| Manager | MAN001 | manager1@avlm.com | MAN001pass | Machining |
| Manager | MAN002 | manager2@avlm.com | MAN002pass | Assembly |
| CEO | CEO001 | ceo@avlm.com | CEO001pass | Corporate |
| Employee | EMP001 | employee1@avlm.com | EMP001pass | Machining |
| Employee | EMP002 | employee2@avlm.com | EMP002pass | Assembly |

---

## 🧪 Testing Login Methods

### Employee ID Login (No Password)
1. Click **Sign In**
2. Select **Employee ID** tab
3. Enter: `HR001` (or any employee ID)
4. Click **Sign In**

### Email/Password Login
1. Click **Sign In**
2. Select **Email/Password** tab
3. Enter: `rohan@avlm.com` and `HR001pass`
4. Click **Sign In**

---

## ✨ What Happens After Login

Once logged in, each user can access different features based on their role:

### HR/Payroll (rohan@avlm.com)
- ✓ View all employees
- ✓ Add new employees
- ✓ Process payroll
- ✓ View reports
- ✓ Manage pending requests

### Manager (manager1@avlm.com)
- ✓ View department employees
- ✓ Approve pending requests
- ✓ View attendance records
- ✓ View reports

### Employee (employee1@avlm.com)
- ✓ View personal profile
- ✓ Clock in/out
- ✓ Request leave
- ✓ View payslips
- ✓ Check attendance

---

## 🔧 Troubleshooting

### "Invalid email or password"
- Ensure you created the auth user in Supabase first
- Check that email is confirmed
- Verify password is exactly as specified

### "User record not found in system"
- The auth user exists but the `users` table doesn't have a matching record
- Run the SQL migration from `migrations/seed_mock_users.sql`

### Need to Add More Users?
Edit the SQL file or create new auth users following the same pattern, then add records to the users table with:
```sql
INSERT INTO users (id, name, personal_email, email, role, department, designation, employment_status)
VALUES ('EMPXXX', 'Full Name', 'email@avlm.com', 'email@avlm.com', 'Employee', 'Department', 'Designation', 'Active');
```

---

## 💡 Next Steps

1. Test the login functionality
2. Verify role-based access control
3. Test employee workflows (clock in, submit leave, etc.)
4. Check payroll calculations
5. Generate sample reports
