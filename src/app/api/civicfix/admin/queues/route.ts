import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { civicfixStore, departments } from "@/lib/civicfix/repository";
import { getUserFromSession } from "@/lib/civicfix/session";

export async function GET() {
  const user = getUserFromSession((await cookies()).get("civicfix_session")?.value);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const queues = departments.map((department) => ({ department, reports: [...civicfixStore.reports.values()].filter((report) => report.departmentId === department.id).sort((a, b) => b.severityScore - a.severityScore || a.createdAt.localeCompare(b.createdAt)) }));
  return NextResponse.json({ queues });
}
