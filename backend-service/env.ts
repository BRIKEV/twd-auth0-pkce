import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),

  auth0: {
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    redirectUri: process.env.AUTH0_REDIRECT_URI!,
    audience: process.env.AUTH0_AUDIENCE!,
  },

  databaseUrl: process.env.DATABASE_URL ?? "file:./local.sqlite",

  sessionSecret: process.env.SESSION_SECRET ?? "dev-secret",
};
