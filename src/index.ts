import { genSaltSync, hashSync } from "bcrypt";
import { CookieStore, Session, sessionMiddleware } from "hono-sessions";
import db, { runMigrations } from "./db";

import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import routes from "./routes";
import { users } from "./schemas";
import logger from "./utilities/logger";
import requestMiddlewareLogger from "./utilities/requestMiddlewareLogger";
import { existsSync, mkdirSync } from "fs";
import path from "path";

dotenv.config();

const app = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

// app.use(secureHeaders());
// app.use(cors());
// app.use(csrf());

const store = new CookieStore();

if (!existsSync(path.join(process.cwd(), "uploads"))) mkdirSync("uploads");

app.use(
  "*",
  sessionMiddleware({
    store,
    encryptionKey: process.env.SECURITY_PHRASE,
    expireAfterSeconds: 60 * 30, // 30 Minutes
    cookieOptions: {
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  })
);

app.use(requestMiddlewareLogger);

app.route("/", routes);

await runMigrations();

export default {
  port: 4000,
  fetch: app.fetch,
};

process.stdout.write("\x1Bc");

console.log(`
  $$\\   $$\\          $$\\ $$\\               $$\\
  $$ | $$  |         $$ |\\__|              $$ |
  $$ |$$  / $$$$$$\\  $$ |$$\\ $$$$$$\\$$$$\\  $$$$$$$\\  $$\\   $$\\
  $$$$$  /  \\____$$\\ $$ |$$ |$$  _$$  _$$\\ $$  __$$\\ $$ |  $$ |
  $$  $$<   $$$$$$$ |$$ |$$ |$$ / $$ / $$ |$$ |  $$ |$$ |  $$ |
  $$ |\\$$\\ $$  __$$ |$$ |$$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ |
  $$ | \\$$\\\\$$$$$$$ |$$ |$$ |$$ | $$ | $$ |$$$$$$$  |\\$$$$$$  |
  \\__|  \\__|\\_______|\\__|\\__|\\__| \\__| \\__|\\_______/  \\______/ 
`);

logger.info("🚀 Server listening on http://127.0.0.1:4000");

const adminEmail = process.env.ADMIN_EMAIL ?? "";
const adminPassword = process.env.ADMIN_PASSWORD ?? "";

const result = await db
  .select()
  .from(users)
  .where(eq(users.email, adminEmail))
  .limit(1);

const adminFound = result[0];

if (!adminFound) {
  const salt = genSaltSync(512);

  await db.insert(users).values({
    email: adminEmail,
    password: hashSync(adminPassword, salt),
    role: "System Admin",
  });

  console.log(
    "✅ Created admin user " + adminEmail + " with password " + adminPassword
  );
}
