import { auth } from 'express-oauth2-jwt-bearer';
import { env } from '../env';

export const checkJwt = auth({
  audience: env.auth0.audience,
  issuerBaseURL: `https://${env.auth0.domain}/`,
  tokenSigningAlg: 'RS256',
});
