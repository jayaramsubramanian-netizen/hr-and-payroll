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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAttendanceInsert() {
  console.log("📋 Testing Attendance Table Operations...\n");

  // Test 1: Try to insert
  console.log("1️⃣ Test INSERT with anon key:");
  const { data: insertData, error: insertError } = await supabase
    .from("attendance")
    .insert({
      employee_id: "test-emp",
      date: "2026-02-14",
      clock_in: "09:00",
      status: "Present",
      entry_number: 1,
    })
    .select();

  if (insertError) {
    console.log("   ❌ Error:", insertError.message);
    console.log("   Code:", insertError.code);
  } else {
    console.log("   ✅ Success! Inserted record with ID:", insertData[0]?.id);
  }

  // Test 2: Try to read
  console.log("\n2️⃣ Test SELECT:");
  const { data: selectData, error: selectError } = await supabase
    .from("attendance")
    .select("*")
    .limit(1);

  if (selectError) {
    console.log("   ❌ Error:", selectError.message);
  } else {
    console.log("   ✅ Success! Found", selectData.length, "records");
  }

  // Test 3: Check if RLS is enabled
  console.log("\n3️⃣ Check if RLS is enabled on attendance:");
  try {
    const { data: rls } = await supabase.rpc("has_rls", {
      table_name: "attendance",
    });
    console.log("   RLS enabled:", rls);
  } catch (e) {
    console.log("   Could not check RLS status via RPC");
  }
}

testAttendanceInsert();
