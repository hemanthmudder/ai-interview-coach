import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { civicfixStore } from "@/lib/civicfix/repository";
import { getUserFromSession } from "@/lib/civicfix/session";
import type { ReportStatus } from "@/lib/civicfix/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getUserFromSession((await cookies()).get("civicfix_session")?.value);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await context.params;
  const report = civicfixStore.reports.get(id);
  const body = await request.json().catch(() => null);
  const status = body?.status as ReportStatus;
  if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  if (!["Submitted", "Acknowledged", "In Progress", "Resolved"].includes(status)) return NextResponse.json({ error: "Invalid report status." }, { status: 400 });
  report.status = status;
  report.updatedAt = new Date().toISOString();
  civicfixStore.addNotification({ id: randomUUID(), userId: report.userId, reportId: report.id, title: `Report ${status}`, message: `Your report is now ${status.toLowerCase()}.`, read: false, createdAt: report.updatedAt });
  return NextResponse.json({ report });
}
