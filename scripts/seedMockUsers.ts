import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file.",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  department: string;
  designation: string;
}

const mockUsers: MockUser[] = [
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
      const { data: authData, error: authError } = await supabase.auth.admin
        .createUser({
          email: mockUser.email,
          password: mockUser.password,
          user_metadata: {
            employee_id: mockUser.id,
          },
          email_confirm: true, // Auto-confirm email
        });

      if (authError) {
        // Check if user already exists
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
        // Update existing user with email and other details
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
          console.log(
            `  ✅ Updated user record with email and credentials`,
          );
        }
      } else {
        // Create new user in users table
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
    } catch (error: any) {
      console.error(
        `  ❌ Unexpected error for ${mockUser.id}: ${error.message}\n`,
      );
    }
  }

  console.log("✅ Mock user seeding completed!");
  console.log("\n📋 Login Credentials:");
  console.log("─".repeat(60));
  mockUsers.forEach((user) => {
    console.log(`ID: ${user.id.padEnd(10)} | Email: ${user.email.padEnd(25)} | Pass: ${user.password}`);
  });
  console.log("─".repeat(60));

  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
