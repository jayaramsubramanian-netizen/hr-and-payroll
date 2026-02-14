#!/bin/bash

# Find all TypeScript files with createClient
echo "Searching for duplicate Supabase client instances..."

# List of files to check
files=(
  "src/LeaveManagementPage.tsx"
  "src/KioskModePage.tsx"
  "src/AttendanceManagementPage.tsx"
  "src/PayrollManagementPage.tsx"
  "src/MyPayslipsPage.tsx"
  "src/ClockInOutPage.tsx"
  "src/PendingRequestsPage.tsx"
  "src/ViewAllEmployees.tsx"
  "src/AddEmployeePage.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    if grep -q "createClient(" "$file"; then
      echo "  ⚠️  Found createClient in $file - needs manual fix"
    else
      echo "  ✅ No createClient found in $file"
    fi
  fi
done

echo ""
echo "Files that need fixing should:"
echo "1. Remove: import { createClient } from '@supabase/supabase-js';"
echo "2. Remove: const supabase = createClient(...);"
echo "3. Add: import { supabase } from './supabaseClient';"