import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/client";
import { notes, users } from "../db/schema";
import { checkJwt } from "../auth/checkJwt";

const notesRouter = Router();

async function ensureUserRecord(userId: string) {
  // We only get the sub (userId) from the access token. 
  // We rely on the frontend ID token for profile info display.
  // We just need to make sure the user exists for FK constraints.
  await db
    .insert(users)
    .values({ id: userId })
    .onConflictDoNothing();
}

notesRouter.use(checkJwt);

notesRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.auth!.payload.sub!;
    await ensureUserRecord(userId);

    const data = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.createdAt), desc(notes.id));

    res.json({ notes: data });
  } catch (err) {
    next(err);
  }
});

notesRouter.post("/", async (req, res, next) => {
  try {
    const userId = req.auth!.payload.sub!;
    await ensureUserRecord(userId);

    const { title, content } = req.body ?? {};

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    const [inserted] = await db
      .insert(notes)
      .values({
        userId: userId,
        title: title.trim(),
        content: typeof content === "string" ? content : "",
      })
      .returning();

    res.status(201).json({ note: inserted });
  } catch (err) {
    next(err);
  }
});

export { notesRouter };
