import { Router, type Request, type Response, type NextFunction } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/client";
import { notes, users } from "../db/schema";

const notesRouter = Router();

function requireSessionUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.sendStatus(401);
  }
  next();
}

async function ensureUserRecord(sessionUser: { id: string; name?: string; email?: string; picture?: string }) {
  await db
    .insert(users)
    .values({
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      picture: sessionUser.picture,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        name: sessionUser.name,
        email: sessionUser.email,
        picture: sessionUser.picture,
      },
    });
}

notesRouter.use(requireSessionUser);

notesRouter.get("/", async (req, res, next) => {
  try {
    const user = req.session.user!;
    await ensureUserRecord(user);

    const data = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(desc(notes.createdAt), desc(notes.id));

    res.json({ notes: data });
  } catch (err) {
    next(err);
  }
});

notesRouter.post("/", async (req, res, next) => {
  try {
    const user = req.session.user!;
    await ensureUserRecord(user);

    const { title, content } = req.body ?? {};

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    const [inserted] = await db
      .insert(notes)
      .values({
        userId: user.id,
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
