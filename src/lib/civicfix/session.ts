import { randomUUID } from "node:crypto";
import { civicfixStore } from "./repository";
import type { User } from "./types";

const sessions = new Map<string, string>();

export function createSession(user: User) {
  const token = randomUUID();
  sessions.set(token, user.id);
  return token;
}

export function getUserFromSession(token?: string) {
  const userId = token ? sessions.get(token) : undefined;
  if (!userId) return null;
  return [...civicfixStore.users.values()].find((user) => user.id === userId) ?? null;
}
