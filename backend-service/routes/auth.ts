import { Router } from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { env } from "../env";

export const authRouter = Router();

/**
 * Step 1: Redirect to Auth0
 */
authRouter.get("/login", (_req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.auth0.clientId,
    redirect_uri: env.auth0.redirectUri,
    scope: "openid profile email",
  });

  res.redirect(
    `https://${env.auth0.domain}/authorize?${params.toString()}`
  );
});

/**
 * Step 2: OAuth callback
 */
authRouter.get("/callback", async (req, res, next) => {
  try {
    const code = req.query.code as string | undefined;

    if (!code) {
      return res.sendStatus(400);
    }

    const tokenRes = await fetch(
      `https://${env.auth0.domain}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: env.auth0.clientId,
          client_secret: env.auth0.clientSecret,
          code,
          redirect_uri: env.auth0.redirectUri,
        }),
      }
    );

    if (!tokenRes.ok) {
      return res.sendStatus(401);
    }

    const token = await tokenRes.json() as {
      access_token: string;
      id_token: string;
      token_type: string;
      expires_in: number;
    };

    // Store tokens server-side
    req.session.accessToken = token.access_token;
    req.session.idToken = token.id_token;
    const decoded = jwt.decode(token.id_token) as {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };
    req.session.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

/**
 * Logout
 */
authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => {
    const params = new URLSearchParams({
      client_id: env.auth0.clientId,
      returnTo: "http://localhost:5173/",
    });

    res.redirect(
      `https://${env.auth0.domain}/v2/logout?${params.toString()}`
    );
  });
});
