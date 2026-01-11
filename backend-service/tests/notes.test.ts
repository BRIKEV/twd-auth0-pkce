import { beforeAll, describe, expect, it, beforeEach } from "vitest";
import nock from "nock";
import supertest from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../app";
import { getSession } from "./utils/auth";
import { db } from "../db/client";
import { notes, users } from "../db/schema";

describe("notes tests", () => {
  let request: TestAgent;
  beforeAll(() => {
    request = supertest(app);
  });

  beforeEach(async () => {
    nock.cleanAll();
    // reset database
    await db.delete(notes);
    await db.delete(users);
  });

  describe("GET /api/notes", () => {
    it("should return 401 when not authenticated", async () => {
      await request.get("/api/notes").expect(401);
    });

    it("should return notes empty when authenticated", async () => {
      const cookies = await getSession(request);

      const response = await request
        .get("/api/notes")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.notes).toEqual([]);
      // validate user is created in the database
      const usersInDb = await db.select().from(users);
      expect(usersInDb.length).toBe(1);

      // add a note to the database
      await db.insert(notes).values({
        userId: usersInDb[0].id,
        title: "Test Note",
        content: "This is a test note.",
      });

      const responseWithNote = await request
        .get("/api/notes")
        .set("Cookie", cookies)
        .expect(200);

      expect(responseWithNote.body.notes.length).toBe(1);
      expect(responseWithNote.body.notes[0].title).toBe("Test Note");
    });
  });

  describe("POST /api/notes", () => {
    it("should return 401 when not authenticated", async () => {
      await request
        .post("/api/notes")
        .send({ title: "New Note", content: "Note content" })
        .expect(401);
    });

    it("should create a new note when authenticated", async () => {
      const cookies = await getSession(request);

      const response = await request
        .post("/api/notes")
        .set("Cookie", cookies)
        .send({ title: "New Note", content: "Note content" })
        .expect(201);

      expect(response.body.note).toBeDefined();
      expect(response.body.note.title).toBe("New Note");

      // validate note is in the database
      const notesInDb = await db.select().from(notes);
      expect(notesInDb.length).toBe(1);
      expect(notesInDb[0].title).toBe("New Note");
    });
  });
});