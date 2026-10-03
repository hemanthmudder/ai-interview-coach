import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { categories, severities } from "@/lib/civicfix/types";
import { civicfixStore } from "@/lib/civicfix/repository";
import { getUserFromSession } from "@/lib/civicfix/session";
import { randomUUID } from "node:crypto";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getUserFromSession((await cookies()).get("civicfix_session")?.value);
  const { id } = await context.params;
  const report = civicfixStore.reports.get(id);
  if (!user || !report || report.userId !== user.id) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  if (!categories.includes(body?.category) || !severities.includes(body?.severity)) return NextResponse.json({ error: "Invalid category or severity override." }, { status: 400 });
  report.category = body.category;
  report.severity = body.severity;
  report.updatedAt = new Date().toISOString();
  const department = civicfixStore.getDepartment(report.category);
  report.departmentId = department.id;
  civicfixStore.addNotification({ id: randomUUID(), userId: user.id, reportId: report.id, title: "Report confirmed", message: `Assigned to ${department.name}.`, read: false, createdAt: report.updatedAt });
  return NextResponse.json({ report, department });
}
