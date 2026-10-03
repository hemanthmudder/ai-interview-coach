import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { civicfixStore } from "@/lib/civicfix/repository";
import { getUserFromSession } from "@/lib/civicfix/session";

export async function GET() {
  const user = getUserFromSession((await cookies()).get("civicfix_session")?.value);
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({ notifications: civicfixStore.notifications.filter((notification) => notification.userId === user.id) });
}
