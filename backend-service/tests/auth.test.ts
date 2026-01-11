import { beforeAll, describe, expect, it, beforeEach } from "vitest";
import nock from "nock";
import supertest from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../app";
import { env } from "../env";
import { authResponseMock } from "./mocks/authResponse";

describe("auth tests", () => {
  let request: TestAgent;
  beforeAll(() => {
    request = supertest(app);
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it("should redirect to auth url when visiting /auth/login", async () => {
    // Placeholder test
    const response = await request.get("/auth/login").expect(302);
    expect(response.headers.location).toBeDefined();
    expect(response.headers.location).toContain("https://");
  });

  it("should return 400 when no code is provided to /auth/callback", async () => {
    await request.get("/auth/callback").expect(400);
  });

  it("should return 401 when invalid code is provided to /auth/callback", async () => {
    nock(`https://${env.auth0.domain}`)
      .post("/oauth/token")
      .reply(401, {});
    await request
      .get("/auth/callback")
      .query({ code: "invalid_code" })
      .expect(401);
  });

  it("should successfully authenticate with valid code at /auth/callback", async () => {
    nock(`https://${env.auth0.domain}`)
      .post("/oauth/token")
      .reply(200, authResponseMock);

    const response = await request
      .get("/auth/callback")
      .query({ code: "valid_code" })
      .expect(302);

    expect(response.headers.location).toBe("/");
    // check that session cookie is set
    expect(response.headers["set-cookie"]).toBeDefined();
    // check req.session.user is set (by making a subsequent request to a protected route)
    const cookies = response.headers["set-cookie"];
    const meResponse = await request
      .get("/api/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(meResponse.body).toBeDefined();
    expect(meResponse.body.email).toBe("test@test.com");
  });

  it("should throw 401 /api/me when not authenticated", async () => {
    await request.get("/api/me").expect(401);
  });

  it("should logout successfully at /auth/logout", async () => {
    // First, authenticate
    nock(`https://${env.auth0.domain}`)
      .post("/oauth/token")
      .reply(200, authResponseMock);

    const loginResponse = await request
      .get("/auth/callback")
      .query({ code: "valid_code" })
      .expect(302);

    const cookies = loginResponse.headers["set-cookie"];

    // Now logout
    await request
      .post("/auth/logout")
      .set("Cookie", cookies)
      .expect(302);

    // Verify /api/me now returns 401
    await request
      .get("/api/me")
      .set("Cookie", cookies)
      .expect(401);
  });
});