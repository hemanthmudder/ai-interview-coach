import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { analyzeIssue } from "@/lib/civicfix/classifier";
import { getUserFromSession } from "@/lib/civicfix/session";
import { civicfixStore } from "@/lib/civicfix/repository";
import type { Location } from "@/lib/civicfix/types";

async function currentUser() { return getUserFromSession((await cookies()).get("civicfix_session")?.value); }

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const reports = [...civicfixStore.reports.values()].filter((report) => report.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const location = body?.location as Location | undefined;
  if (description.length < 10 || description.length > 1000) return NextResponse.json({ error: "Description must be between 10 and 1000 characters." }, { status: 400 });
  if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return NextResponse.json({ error: "A valid device location is required." }, { status: 400 });
  const analysis = analyzeIssue(description);
  const department = civicfixStore.getDepartment(analysis.category);
  const now = new Date().toISOString();
  const report = { id: randomUUID(), userId: user.id, imageUrls: Array.isArray(body?.imageUrls) ? body.imageUrls.filter((url: unknown): url is string => typeof url === "string").slice(0, 6) : [], description, ...analysis, status: "Submitted" as const, departmentId: department.id, location, createdAt: now, updatedAt: now };
  civicfixStore.reports.set(report.id, report);
  civicfixStore.addNotification({ id: randomUUID(), userId: user.id, reportId: report.id, title: "Report categorized", message: `${report.category} · ${report.severity} priority. Assigned to ${department.name}.`, read: false, createdAt: now });
  return NextResponse.json({ report, department, analysis }, { status: 201 });
}
