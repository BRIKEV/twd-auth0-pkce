import express from "express";
import path from "path";
import { notesRouter } from "./routes/notes";

const app = express();

app.use(express.json());

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
