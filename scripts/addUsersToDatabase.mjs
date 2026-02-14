import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Load environment variables from .env.local
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
  console.error("❌ Missing Supabase environment variables in .env.local:\n");
  console.error("   - VITE_SUPABASE_URL");
  console.error("   - VITE_SUPABASE_ANON_KEY\n");
  console.error("Please add these to your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockUsers = [
  {
    id: "HR001",
    email: "rohan@avlm.com",
    name: "Rohan Kumar",
    role: "HR/Payroll",
    department: "Administration",
    designation: "HR Manager",
  },
  {
    id: "MAN001",
    email: "manager1@avlm.com",
    name: "Rajesh Singh",
    role: "Manager",
    department: "Machining",
    designation: "Department Manager",
  },
  {
    id: "MAN002",
    email: "manager2@avlm.com",
    name: "Priya Sharma",
    role: "Manager",
    department: "Assembly",
    designation: "Department Manager",
  },
  {
    id: "CEO001",
    email: "ceo@avlm.com",
    name: "Vikram Patel",
    role: "Management",
    department: "Corporate",
    designation: "Chief Executive Officer",
  },
  {
    id: "EMP001",
    email: "employee1@avlm.com",
    name: "Amit Gupta",
    role: "Employee",
    department: "Machining",
    designation: "Machine Operator",
  },
  {
    id: "EMP002",
    email: "employee2@avlm.com",
    name: "Sneha Desai",
    role: "Employee",
    department: "Assembly",
    designation: "Assembly Technician",
  },
];

async function addUsersToDatabase() {
  console.log("📝 Adding mock users to database...\n");

  for (const mockUser of mockUsers) {
    try {
      console.log(`Processing: ${mockUser.id} (${mockUser.email})`);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", mockUser.id)
        .single();

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from("users")
          .update({
            personal_email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
            department: mockUser.department,
            employment_status: "Active",
          })
          .eq("id", mockUser.id);

        if (updateError) {
          console.error(`  ❌ Error: ${updateError.message}`);
        } else {
          console.log(`  ✅ Updated user record\n`);
        }
      } else {
        // Create new user
        const { error: insertError } = await supabase.from("users").insert({
          id: mockUser.id,
          name: mockUser.name,
          personal_email: mockUser.email,
          role: mockUser.role,
          department: mockUser.department,
          employment_status: "Active",
        });

        if (insertError) {
          console.error(`  ❌ Error: ${insertError.message}`);
        } else {
          console.log(`  ✅ Created user record\n`);
        }
      }
    } catch (error) {
      console.error(
        `  ❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }

  console.log("✅ All users processed!");
  console.log("\n📋 Login Credentials:");
  console.log("─".repeat(70));
  mockUsers.forEach((user) => {
    console.log(
      `${user.id.padEnd(8)} | ${user.email.padEnd(25)} | Password: (as set in Supabase)`,
    );
  });
  console.log("─".repeat(70));

  process.exit(0);
}

addUsersToDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
