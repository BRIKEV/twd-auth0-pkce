import session from "express-session";
import { env } from "./env";

export const sessionMiddleware = session({
  name: "bff_session",
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true in prod (HTTPS)
    sameSite: "lax",
  },
});
