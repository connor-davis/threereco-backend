import { zValidator } from "@hono/zod-validator";
import { fileTypeFromBuffer } from "file-type";
import { writeFile } from "fs/promises";
import { Hono } from "hono";
import { Session } from "hono-sessions";
import { encodeBase64 } from "hono/utils/encode";
import path from "path";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

const userImageRouter = new Hono<{
  Variables: { session: Session; session_key_rotation: boolean };
}>();

const UploadQuerySchema = z.object({
  image: z.string(),
});

userImageRouter.post(
  "/",
  async (context, next) => authMiddleware(undefined, context, next),
  zValidator("json", UploadQuerySchema),
  async (context) => {
    const { image } = await UploadQuerySchema.parseAsync(
      await context.req.json()
    );

    const session = context.get("session");
    const userId: string = session.get("user_id") as string;

    const outputPath = path.join(process.cwd(), "uploads", userId);

    await writeFile(outputPath, image, { encoding: "utf-8" });

    return context.text("ok", 200);
  }
);

const DownloadQuerySchema = z.object({
  id: z.string().uuid().optional(),
});

userImageRouter.get(
  "/",
  async (context, next) => await authMiddleware(undefined, context, next),
  zValidator("query", DownloadQuerySchema),
  async (context) => {
    const { id } = await DownloadQuerySchema.parseAsync(context.req.query());

    const session = context.get("session");
    const userId: string = session.get("user_id") as string;

    const imagePath = path.join(process.cwd(), "uploads", id ? id : userId);

    if (!existsSync(imagePath))
      return context.json(
        { error: "Not Found", reason: "Image not found." },
        404
      );

    const imageData = await readFile(imagePath, { encoding: "utf-8" });

    return context.text(imageData, 200);
  }
);

export default userImageRouter;
