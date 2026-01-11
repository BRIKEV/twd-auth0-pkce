import "express-session";

declare module "express-session" {
  interface SessionData {
    accessToken?: string;
    idToken?: string;
    user?: {
      id: string;
      name?: string;
      email?: string;
      picture?: string;
    };
  }
}
