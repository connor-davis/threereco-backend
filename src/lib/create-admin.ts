import { genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";

import database from "@/lib/database";
import env from "@/lib/env";
import { users } from "@/schemas/user";

export default async function createAdmin() {
  const adminEmail = env.ADMIN_EMAIL ?? "";
  const adminPassword = env.ADMIN_PASSWORD ?? "";

  const result = await database
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  const adminFound = result[0];

  if (!adminFound) {
    const passwordSalt = await genSalt(2048);
    const passwordHash = await hash(adminPassword, passwordSalt);

    await database.insert(users).values({
      email: adminEmail,
      password: passwordHash,
      role: "system_admin",
    });

    console.log(
      "✅ Created admin user: " + adminEmail + " and password " + adminPassword
    );
  }
}
