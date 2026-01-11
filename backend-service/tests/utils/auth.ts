import nock from "nock";
import type TestAgent from "supertest/lib/agent";
import { authResponseMock } from "../mocks/authResponse";
import { env } from "../../env";

export const getSession = async (request: TestAgent) => {
  nock(`https://${env.auth0.domain}`)
    .post("/oauth/token")
    .reply(200, authResponseMock);

  const response = await request
    .get("/auth/callback")
    .query({ code: "valid_code" })
    .expect(302);

  // check req.session.user is set (by making a subsequent request to a protected route)
  return response.headers["set-cookie"];
};