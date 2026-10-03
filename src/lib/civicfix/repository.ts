import type { Department, Notification, Report, User } from "./types";

export const departments: Department[] = [
  { id: "roads", name: "Municipal Roads Dept", category: "Road Maintenance" },
  { id: "sanitation", name: "Sanitation Board", category: "Sanitation" },
  { id: "water", name: "Water Works Department", category: "Water Supply" },
  { id: "utilities", name: "Electrical & Lighting Dept", category: "Electricity/Streetlight" },
  { id: "safety", name: "Public Safety Office", category: "Public Safety" },
  { id: "general", name: "Metro Municipal Services", category: "Other" },
];

const users = new Map<string, User>();
const reports = new Map<string, Report>();
const notifications: Notification[] = [];
const otpCodes = new Map<string, { code: string; expiresAt: number }>();

export const civicfixStore = {
  users,
  reports,
  notifications,
  otpCodes,
  getDepartment(category: Department["category"]) { return departments.find((department) => department.category === category) ?? departments[departments.length - 1]; },
  addNotification(notification: Notification) { notifications.unshift(notification); },
};
