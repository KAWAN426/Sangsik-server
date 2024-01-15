import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const SECRET_KEY = process.env.SECRET_KEY || "secret";

export async function getGoogleLoginInfo(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) return;
  const userId = payload.sub;
  const userToken = jwt.sign({ userId }, SECRET_KEY);

  return {
    payload,
    userToken,
  };
}
