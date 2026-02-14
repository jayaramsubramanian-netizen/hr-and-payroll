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

async function diagnoseDatabase() {
  console.log("🔍 Diagnosing database and auth issues...\n");

  // Check 1: List all users in the database
  console.log("1️⃣  Users in database:");
  console.log("─".repeat(70));
  const { data: allUsers, error: usersError } = await supabase
    .from("users")
    .select("id, name, role, department, personal_email");

  if (usersError) {
    console.error(`  ❌ Error reading users: ${usersError.message}`);
  } else if (allUsers) {
    console.log(`  Found ${allUsers.length} users:\n`);
    allUsers.forEach((user) => {
      console.log(`  ID: ${user.id}`);
      console.log(`    Name: ${user.name}`);
      console.log(`    Role: ${user.role}`);
      console.log(`    Dept: ${user.department}`);
      console.log(`    personal_email: ${user.personal_email || "(null)"}`);
      console.log();
    });
  }

  // Check 2: Test the exact query that login uses
  console.log("\n2️⃣  Testing login query for rohan@avlm.com:");
  console.log("─".repeat(70));
  const { data: testUser, error: testError } = await supabase
    .from("users")
    .select("*")
    .eq("personal_email", "rohan@avlm.com")
    .single();

  if (testError) {
    console.error(`  ❌ Query error: ${testError.message}`);
    console.error(`  Error code: ${testError.code}`);
  } else if (testUser) {
    console.log(`  ✅ Found user: ${testUser.name} (${testUser.id})`);
    console.log(`  Personal Email: ${testUser.personal_email}`);
  } else {
    console.log(`  ❌ No user found with personal_email = 'rohan@avlm.com'`);
  }

  // Check 3: Check for employees with emails containing 'avlm'
  console.log("\n3️⃣  Checking for ANY emails with 'avlm' domain:");
  console.log("─".repeat(70));
  const { data: avlmUsers, error: avlmError } = await supabase
    .from("users")
    .select("id, personal_email")
    .ilike("personal_email", "%avlm%");

  if (avlmError) {
    console.error(`  ❌ Error: ${avlmError.message}`);
  } else {
    console.log(`  Found ${avlmUsers?.length || 0} users with avlm emails`);
    avlmUsers?.forEach((u) => {
      console.log(`    ${u.id}: personal_email="${u.personal_email}"`);
    });
  }

  process.exit(0);
}

diagnoseDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
