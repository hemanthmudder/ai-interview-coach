import { NextResponse } from "next/server";
import { normalizeIdentifier, verifyOtp } from "@/lib/civicfix/auth";
import { createSession } from "@/lib/civicfix/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const identifier = typeof body?.identifier === "string" ? normalizeIdentifier(body.identifier) : "";
  const code = typeof body?.code === "string" ? body.code : "";
  const user = verifyOtp(identifier, code);
  if (!user) return NextResponse.json({ error: "That code is invalid or expired." }, { status: 401 });
  const response = NextResponse.json({ user });
  response.cookies.set("civicfix_session", createSession(user), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return response;
}
