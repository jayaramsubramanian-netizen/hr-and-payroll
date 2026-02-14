import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    for (const line of lines) {
      if (line.startsWith("VITE_SUPABASE_URL=")) {
        supabaseUrl = line.replace("VITE_SUPABASE_URL=", "").trim();
      }
      if (line.startsWith("VITE_SUPABASE_ANON_KEY=")) {
        supabaseAnonKey = line.replace("VITE_SUPABASE_ANON_KEY=", "").trim();
      }
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log("🔍 Checking users table schema...\n");

  // Check if we can select any data
  const { data: sample, error: sampleError } = await supabase
    .from("users")
    .select("*")
    .limit(1);

  if (sampleError) {
    console.error("Error querying users:", sampleError.message);
    process.exit(1);
  }

  if (sample && sample.length > 0) {
    console.log("📋 Available columns in users table:");
    console.log("─".repeat(50));
    Object.keys(sample[0]).forEach((col) => {
      console.log(`  • ${col}`);
    });
  } else {
    console.log("No users in table yet. Let me try with specific columns...");
    const { data: test } = await supabase
      .from("users")
      .select("id, name, role, department");

    if (test) {
      console.log("✅ Can query: id, name, role, department");
    }
  }

  process.exit(0);
}

checkSchema().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
