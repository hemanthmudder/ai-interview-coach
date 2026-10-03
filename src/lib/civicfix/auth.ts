import { randomUUID } from "node:crypto";
import { civicfixStore } from "./repository";
import type { User } from "./types";

export function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

export function issueOtp(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const code = process.env.NODE_ENV === "production" ? String(Math.floor(100000 + Math.random() * 900000)) : "123456";
  civicfixStore.otpCodes.set(normalized, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
  return { expiresInSeconds: 600, devCode: process.env.NODE_ENV === "production" ? undefined : code };
}

export function verifyOtp(identifier: string, code: string): User | null {
  const normalized = normalizeIdentifier(identifier);
  const pending = civicfixStore.otpCodes.get(normalized);
  if (!pending || pending.expiresAt < Date.now() || pending.code !== code) return null;
  civicfixStore.otpCodes.delete(normalized);
  const existing = civicfixStore.users.get(normalized);
  if (existing) return existing;
  const user: User = { id: randomUUID(), identifier: normalized, identifierType: normalized.includes("@") ? "email" : "phone", name: normalized.includes("@") ? normalized.split("@")[0] : "Citizen", role: "citizen", createdAt: new Date().toISOString() };
  civicfixStore.users.set(normalized, user);
  return user;
}
