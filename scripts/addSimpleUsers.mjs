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
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockUsers = [
  {
    id: "HR001",
    name: "Rohan Kumar",
    role: "HR/Payroll",
    department: "Administration",
  },
  {
    id: "MAN001",
    name: "Rajesh Singh",
    role: "Manager",
    department: "Machining",
  },
  {
    id: "MAN002",
    name: "Priya Sharma",
    role: "Manager",
    department: "Assembly",
  },
  {
    id: "CEO001",
    name: "Vikram Patel",
    role: "Management",
    department: "Corporate",
  },
  {
    id: "EMP001",
    name: "Amit Gupta",
    role: "Employee",
    department: "Machining",
  },
  {
    id: "EMP002",
    name: "Sneha Desai",
    role: "Employee",
    department: "Assembly",
  },
];

async function addSimpleUsers() {
  console.log("📝 Adding mock users with minimal fields...\n");

  for (const mockUser of mockUsers) {
    try {
      console.log(`Processing: ${mockUser.id} (${mockUser.name})`);

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", mockUser.id)
        .single();

      if (existingUser) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            name: mockUser.name,
            role: mockUser.role,
            department: mockUser.department,
          })
          .eq("id", mockUser.id);

        if (updateError) {
          console.error(`  ❌ Error: ${updateError.message}`);
        } else {
          console.log(`  ✅ Updated\n`);
        }
      } else {
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: mockUser.id,
            name: mockUser.name,
            role: mockUser.role,
            department: mockUser.department,
          });

        if (insertError) {
          console.error(`  ❌ Error: ${insertError.message}`);
        } else {
          console.log(`  ✅ Created\n`);
        }
      }
    } catch (error) {
      console.error(
        `  ❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }

  console.log("✅ Done!");
  process.exit(0);
}

addSimpleUsers().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
