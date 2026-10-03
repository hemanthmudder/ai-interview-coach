import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/civicfix/session";

export async function GET() {
  const token = (await cookies()).get("civicfix_session")?.value;
  const user = getUserFromSession(token);
  return NextResponse.json({ user });
}
