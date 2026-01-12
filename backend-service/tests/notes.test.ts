import { beforeAll, describe, expect, it, beforeEach, vi, type Mock } from "vitest";
import supertest from "supertest";
import type TestAgent from "supertest/lib/agent";
import { db } from "../db/client";
import { notes, users } from "../db/schema";

// Mock the middleware BEFORE importing the app
import { checkJwt } from "../auth/checkJwt";

// 1. Tell Vitest to mock the module
vi.mock("../auth/checkJwt", () => ({
  checkJwt: vi.fn((req, res) => {
    // Default behavior: unauthorized
    res.sendStatus(401);
  }),
}));

// Import app AFTER setting up the mock
import app from "../app";

describe("notes tests", () => {
  let request: TestAgent;
  const mockCheckJwt = checkJwt as unknown as Mock;

  beforeAll(() => {
    request = supertest(app);
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset database
    await db.delete(notes);
    await db.delete(users);
  });

  describe("GET /api/notes", () => {
    it("should return 401 when not authenticated", async () => {
      // Setup the mock for failure (which is the default in our mock factory above, 
      // but explicitly setting it here for clarity)
      mockCheckJwt.mockImplementation((req, res) => {
        res.sendStatus(401);
      });

      await request.get("/api/notes").expect(401);
    });

    it("should return notes empty when authenticated", async () => {
      // Setup the mock for success
      mockCheckJwt.mockImplementation((req, res, next) => {
        req.auth = {
          payload: {
            sub: "auth0|test-user-123",
          },
        };
        next();
      });

      const response = await request.get("/api/notes").expect(200);

      expect(response.body.notes).toEqual([]);
      // validate user is created in the database
      const usersInDb = await db.select().from(users);
      expect(usersInDb.length).toBe(1);
    });

    it("should return users notes", async () => {
       const userId = "auth0|user-123";
       
       // Setup mock with specific user
       mockCheckJwt.mockImplementation((req, res, next) => {
        req.auth = {
          payload: {
            sub: userId,
          },
        };
        next();
      });

       // Manually seed the db
       await db.insert(users).values({ id: userId });
       await db.insert(notes).values({
         userId,
         title: "Test Note",
         content: "Content",
       });

      const response = await request.get("/api/notes").expect(200);

      expect(response.body.notes).toHaveLength(1);
      expect(response.body.notes[0].title).toBe("Test Note");
    });
  });

  describe("POST /api/notes", () => {
    it("should return 401 when not authenticated", async () => {
      mockCheckJwt.mockImplementation((req, res) => {
        res.sendStatus(401);
      });

      await request
        .post("/api/notes")
        .send({ title: "New Note", content: "Note content" })
        .expect(401);
    });

    it("should create a note", async () => {
      mockCheckJwt.mockImplementation((req, res, next) => {
        req.auth = {
          payload: {
            sub: "auth0|test-user-123",
          },
        };
        next();
      });

      const response = await request
        .post("/api/notes")
        .send({
            title: "New Task",
            content: "Do it"
        })
        .expect(201);
        
      expect(response.body.note.title).toBe("New Task");
      
      const inDb = await db.select().from(notes);
      expect(inDb).toHaveLength(1);
    });
  });
});
