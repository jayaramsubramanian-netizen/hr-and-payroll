import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
    if (urlMatch) supabaseUrl = urlMatch[1].trim();
    if (keyMatch) supabaseAnonKey = keyMatch[1].trim();
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables not found");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log("📋 Checking users table schema...\n");

  try {
    // Get a single row to see what columns exist
    const { data, error: selectError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (selectError) {
      console.error("❌ Error:", selectError.message);
      return;
    }

    if (data && data.length > 0) {
      const row = data[0];
      console.log("✅ Columns in users table:");
      Object.keys(row).forEach((col) => {
        console.log(`   - ${col}: ${typeof row[col]}`);
      });
    } else {
      console.log("   (No users yet)");
    }

    // Also check leave_requests table
    console.log("\n📋 Checking leave_requests table schema...\n");
    const { data: leaveData } = await supabase
      .from("leave_requests")
      .select("*")
      .limit(1);

    if (leaveData && leaveData.length > 0) {
      console.log("✅ Columns in leave_requests table:");
      Object.keys(leaveData[0]).forEach((col) => {
        console.log(`   - ${col}`);
      });
    } else {
      console.log("   (No leave requests yet)");
    }

    // Check attendance table
    console.log("\n📋 Checking attendance table structure...\n");
    const { data: attData } = await supabase
      .from("attendance")
      .select("*")
      .limit(1);

    if (attData && attData.length > 0) {
      console.log("✅ Columns in attendance table:");
      Object.keys(attData[0]).forEach((col) => {
        console.log(`   - ${col}`);
      });
    } else {
      console.log("   (No attendance records yet)");
    }

    // Check RLS policies on attendance
    console.log("\n📋 Checking RLS policies...\n");
    const { data: policies, error: policyError } = await supabase
      .from("pg_policies")
      .select("*")
      .eq("tablename", "attendance");

    if (!policyError && policies) {
      console.log("✅ Policies on attendance table:");
      policies.forEach((p) => {
        console.log(`   - ${p.policyname}: ${p.qual}`);
      });
    } else {
      console.log("   (Could not fetch policies - may require admin access)");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkSchema();
