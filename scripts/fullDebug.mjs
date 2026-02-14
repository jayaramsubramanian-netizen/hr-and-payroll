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

async function fullDebug() {
  console.log("🔍 FULL LOGIN DIAGNOSIS\n");

  // Check 1: Users in database
  console.log("1️⃣  Users Table Contents:");
  console.log("─".repeat(70));
  const { data: dbUsers } = await supabase
    .from("users")
    .select("id, name, role, personal_email");

  if (!dbUsers || dbUsers.length === 0) {
    console.log("  ❌ NO USERS IN DATABASE!");
    process.exit(1);
  }

  console.log(`  Found ${dbUsers.length} users:\n`);
  dbUsers.forEach((u) => {
    console.log(
      `  ${u.id.padEnd(10)} | ${u.name.padEnd(20)} | ${u.personal_email || "(no email)"}`,
    );
  });

  // Check 2: Test exact login query
  console.log("\n2️⃣  Testing Login Query:");
  console.log("─".repeat(70));
  console.log("  Query: .from('users').select('*').eq('personal_email', 'rohan@avlm.com').single()");
  const { data: queryResult, error: queryError } = await supabase
    .from("users")
    .select("*")
    .eq("personal_email", "rohan@avlm.com");

  if (queryError) {
    console.error(`  ❌ Query Error: ${queryError.message}`);
  } else {
    console.log(`  Found ${queryResult.length} results:`);
    queryResult.forEach((u) => console.log(`    ${JSON.stringify(u, null, 2)}`));
  }

  // Check 3: Check Auth users
  console.log("\n3️⃣  Testing Auth Login:");
  console.log("─".repeat(70));
  console.log("  Attempting: auth.signInWithPassword(rohan@avlm.com, HR001pass)");
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: "rohan@avlm.com",
      password: "HR001pass",
    });

  if (authError) {
    console.error(`  ❌ Auth Error: ${authError.message}`);
    console.error(`  Code: ${authError.code}`);
    console.log("\n  💡 ISSUE: Supabase Auth user doesn't exist for rohan@avlm.com");
    console.log("  You need to create this user in Authentication > Users in Supabase dashboard");
  } else {
    console.log(`  ✅ Auth successful! User ID: ${authData.user.id}`);
    console.log(`  Email: ${authData.user.email}`);
  }

  // Check 4: Show all personal_email values
  console.log("\n4️⃣  All personal_email values in database:");
  console.log("─".repeat(70));
  const { data: emails } = await supabase
    .from("users")
    .select("id, personal_email");

  emails?.forEach((u) => {
    const emailValue = u.personal_email === null ? "NULL" : `"${u.personal_email}"`;
    console.log(`  ${u.id}: ${emailValue}`);
  });

  process.exit(0);
}

fullDebug().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
