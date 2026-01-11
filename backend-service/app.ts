import express from "express";
import path from "path";
import { sessionMiddleware } from "./session";
import { authRouter } from "./routes/auth";
import { notesRouter } from "./routes/notes";

const app = express();

app.use(sessionMiddleware);
app.use(express.json());

/**
 * Auth routes
 */
app.use("/auth", authRouter);

/**
 * Session user info endpoint
 */
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  res.json(req.session.user);
});

/**
 * Notes (protected)
 */
app.use("/api/notes", notesRouter);


/**
 * Serve frontend (prod)
 */
app.use(express.static("dist"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve("dist/index.html"));
  });
}

export default app;
