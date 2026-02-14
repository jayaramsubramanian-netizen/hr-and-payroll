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

async function checkRLS() {
  console.log("📋 Testing RLS on attendance table...\n");

  try {
    // Try to insert a test record
    const { data, error } = await supabase.from("attendance").insert({
      employee_id: "test-id",
      date: "2026-02-14",
      clock_in: "09:00",
      status: "Present",
    });

    if (error) {
      console.log("❌ Insert error:", error.message);
      console.log("Code:", error.code);
    } else {
      console.log("✅ Insert succeeded, record ID:", data[0]?.id);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkRLS();
