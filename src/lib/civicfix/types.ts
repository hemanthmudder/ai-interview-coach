export const categories = [
  "Road Maintenance",
  "Sanitation",
  "Water Supply",
  "Electricity/Streetlight",
  "Public Safety",
  "Other",
] as const;

export const severities = ["Low", "Medium", "High", "Critical"] as const;
export const reportStatuses = ["Submitted", "Acknowledged", "In Progress", "Resolved"] as const;

export type Category = (typeof categories)[number];
export type Severity = (typeof severities)[number];
export type ReportStatus = (typeof reportStatuses)[number];

export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type User = {
  id: string;
  identifier: string;
  identifierType: "email" | "phone";
  name: string;
  role: "citizen" | "admin";
  createdAt: string;
};

export type Department = {
  id: string;
  name: string;
  category: Category;
};

export type Report = {
  id: string;
  userId: string;
  imageUrls: string[];
  description: string;
  category: Category;
  severity: Severity;
  severityScore: number;
  confidence: number;
  status: ReportStatus;
  departmentId: string;
  location: Location;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  reportId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
