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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableSchema() {
  console.log("🔍 Checking users table schema and contents...\n");

  // Try to get one row to see what columns exist
  console.log("Attempting to read users table...");
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    console.error(`Error: ${error.message}`);
    console.log("\n📊 Let me try with specific columns:");

    // Try common column names one by one
    const commonColumns = [
      "id",
      "name",
      "role",
      "department",
      "personal_email",
      "mobile_number",
      "created_at",
    ];

    for (const col of commonColumns) {
      const { data: test, error: testError } = await supabase
        .from("users")
        .select(col)
        .limit(1);

      if (!testError) {
        console.log(`  ✅ Column "${col}" exists`);
      } else {
        console.log(`  ❌ Column "${col}" doesn't exist`);
      }
    }
  } else {
    console.log(`✅ Table accessible. Found ${data.length} records\n`);
    if (data.length > 0) {
      console.log("Available columns:");
      Object.keys(data[0]).forEach((col) => {
        console.log(`  • ${col}: ${data[0][col]}`);
      });
    } else {
      console.log("Table is empty!");
    }
  }

  process.exit(0);
}

checkTableSchema().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
