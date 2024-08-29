import { CookieStore, Session, sessionMiddleware } from "hono-sessions";
import db, { runMigrations } from "./db";
import { genSaltSync, hashSync } from "bcrypt";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import logger from "./utilities/logger";
import requestMiddlewareLogger from "./utilities/requestMiddlewareLogger";
import routes from "./routes";
import { secureHeaders } from "hono/secure-headers";
import { users } from "./schemas";

dotenv.config();

const app = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

app.use(secureHeaders());
app.use(cors());
app.use(csrf());

const store = new CookieStore();

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
  ___      _______  __    _  _______  _     _  _______  ___      _______  
  |   |    |       ||  |  | ||       || | _ | ||       ||   |    |       | 
  |   |    |   _   ||   |_| ||    ___|| || || ||   _   ||   |    |    ___| 
  |   |    |  | |  ||       ||   |___ |       ||  | |  ||   |    |   |___  
  |   |___ |  |_|  ||  _    ||    ___||       ||  |_|  ||   |___ |    ___| 
  |       ||       || | |   ||   |___ |   _   ||       ||       ||   |     
  |_______||_______||_|  |__||_______||__| |__||_______||_______||___|     
   _______  _______  _______  _______  _     _  _______  ______    _______ 
  |       ||       ||       ||       || | _ | ||   _   ||    _ |  |       |
  |  _____||   _   ||    ___||_     _|| || || ||  |_|  ||   | ||  |    ___|
  | |_____ |  | |  ||   |___   |   |  |       ||       ||   |_||_ |   |___ 
  |_____  ||  |_|  ||    ___|  |   |  |       ||       ||    __  ||    ___|
   _____| ||       ||   |      |   |  |   _   ||   _   ||   |  | ||   |___ 
  |_______||_______||___|      |___|  |__| |__||__| |__||___|  |_||_______|                                                                                         
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
