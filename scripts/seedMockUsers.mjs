import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    for (const line of lines) {
      if (line.startsWith("VITE_SUPABASE_URL=")) {
        supabaseUrl = line.replace("VITE_SUPABASE_URL=", "").trim();
      }
      if (line.startsWith("SUPABASE_SERVICE_KEY=")) {
        supabaseServiceKey = line.replace("SUPABASE_SERVICE_KEY=", "").trim();
      }
    }
  }
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables in .env.local:\n");
  console.error("   - VITE_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_KEY (for admin access)\n");
  console.error("Please add these to your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const mockUsers = [
  {
    id: "HR001",
    email: "rohan@avlm.com",
    password: "HR001pass",
    name: "Rohan Kumar",
    role: "HR/Payroll",
    department: "Administration",
    designation: "HR Manager",
  },
  {
    id: "MAN001",
    email: "manager1@avlm.com",
    password: "MAN001pass",
    name: "Rajesh Singh",
    role: "Manager",
    department: "Machining",
    designation: "Department Manager",
  },
  {
    id: "MAN002",
    email: "manager2@avlm.com",
    password: "MAN002pass",
    name: "Priya Sharma",
    role: "Manager",
    department: "Assembly",
    designation: "Department Manager",
  },
  {
    id: "CEO001",
    email: "ceo@avlm.com",
    password: "CEO001pass",
    name: "Vikram Patel",
    role: "Management",
    department: "Corporate",
    designation: "Chief Executive Officer",
  },
  {
    id: "EMP001",
    email: "employee1@avlm.com",
    password: "EMP001pass",
    name: "Amit Gupta",
    role: "Employee",
    department: "Machining",
    designation: "Machine Operator",
  },
  {
    id: "EMP002",
    email: "employee2@avlm.com",
    password: "EMP002pass",
    name: "Sneha Desai",
    role: "Employee",
    department: "Assembly",
    designation: "Assembly Technician",
  },
];

async function seedDatabase() {
  console.log("🌱 Starting mock user seeding...\n");

  for (const mockUser of mockUsers) {
    try {
      console.log(`Processing user: ${mockUser.id} (${mockUser.email})`);

      // 1. Create Supabase Auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: mockUser.email,
          password: mockUser.password,
          user_metadata: {
            employee_id: mockUser.id,
          },
          email_confirm: true,
        });

      if (authError) {
        if (authError.message.includes("User already exists")) {
          console.log(`  ℹ️  Auth user already exists for ${mockUser.email}`);
        } else {
          console.error(`  ❌ Auth error: ${authError.message}`);
          continue;
        }
      } else {
        console.log(`  ✅ Created Supabase Auth user`);
      }

      // 2. Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", mockUser.id)
        .single();

      if (existingUser) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            personal_email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
            department: mockUser.department,
            designation: mockUser.designation,
            employment_status: "Active",
          })
          .eq("id", mockUser.id);

        if (updateError) {
          console.error(`  ❌ Update error: ${updateError.message}`);
        } else {
          console.log(`  ✅ Updated user record with email and credentials`);
        }
      } else {
        const { error: insertError } = await supabase.from("users").insert({
          id: mockUser.id,
          name: mockUser.name,
          personal_email: mockUser.email,
          role: mockUser.role,
          department: mockUser.department,
          designation: mockUser.designation,
          employment_status: "Active",
          email: mockUser.email,
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error(`  ❌ Insert error: ${insertError.message}`);
        } else {
          console.log(`  ✅ Created user record in database`);
        }
      }

      console.log(
        `  📧 Email: ${mockUser.email} | 🔐 Password: ${mockUser.password}\n`,
      );
    } catch (error) {
      console.error(
        `  ❌ Unexpected error for ${mockUser.id}: ${error.message}\n`,
      );
    }
  }

  console.log("✅ Mock user seeding completed!");
  console.log("\n📋 Login Credentials:");
  console.log("─".repeat(70));
  mockUsers.forEach((user) => {
    console.log(
      `${user.id.padEnd(8)} | ${user.email.padEnd(25)} | Password: ${user.password}`,
    );
  });
  console.log("─".repeat(70));

  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
