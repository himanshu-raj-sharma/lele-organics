import { SignJWT, jwtVerify } from "jose";
import { scryptSync, timingSafeEqual } from "crypto";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret);

export type AuthTokenPayload = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function createAuthToken(payload: AuthTokenPayload) {
  return await new SignJWT({
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "CUSTOMER" && payload.role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      role: payload.role,
    } as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function verifyPassword(
  password: string,
  storedPasswordHash: string
) {
  try {
    const [salt, storedHash] = storedPasswordHash.split(":");

    if (!salt || !storedHash) {
      return false;
    }

    const derivedHash = scryptSync(password, salt, 64);

    const storedHashBuffer = Buffer.from(storedHash, "hex");

    if (derivedHash.length !== storedHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(derivedHash, storedHashBuffer);
  } catch {
    return false;
  }
}