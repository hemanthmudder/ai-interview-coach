import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/civicfix/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const identifier = typeof body?.identifier === "string" ? body.identifier : "";
  if (!identifier || (!identifier.includes("@") && identifier.replace(/\D/g, "").length < 7)) return NextResponse.json({ error: "Enter a valid email address or phone number." }, { status: 400 });
  return NextResponse.json({ ok: true, ...issueOtp(identifier) });
}
