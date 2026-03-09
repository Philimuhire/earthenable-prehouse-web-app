import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export interface PicklistData {
  productInterest: string[];
  category: string[];
  phase: string[];
  house: string[];
  country: string[];
}

export interface SearchResult {
  id: string;
  name: string;
}

export interface VillageResult extends SearchResult {
  cell: string;
  sector: string;
  district: string;
  country: string;
}

export interface EmployeeResult extends SearchResult {
  phone: string;
  advancementLevel: string;
  workLocation: string;
}

export interface CustomerResult extends SearchResult {
  firstName: string;
  lastName: string;
  phone: string;
  village: string;
  district: string;
  country: string;
  contactId: string;
  customerCode: string;
}

export async function fetchPicklists(): Promise<PicklistData> {
  const res = await fetch(`${API_URL}/api/sf/picklists`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load form options");
  return res.json();
}

export async function searchVillages(q: string): Promise<VillageResult[]> {
  const res = await fetch(`${API_URL}/api/sf/villages?q=${encodeURIComponent(q)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to search villages");
  return res.json();
}

export async function searchEmployees(q: string): Promise<EmployeeResult[]> {
  const res = await fetch(`${API_URL}/api/sf/employees?q=${encodeURIComponent(q)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to search employees");
  return res.json();
}

export async function searchCustomers(q: string): Promise<CustomerResult[]> {
  const res = await fetch(`${API_URL}/api/sf/customers?q=${encodeURIComponent(q)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to search customers");
  return res.json();
}

export interface OpportunityPayload {
  existingContactId?: string;
  accountId?: string;
  salutation?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  villageId?: string;
  district?: string;
  customerCode?: string;
  category?: string;
  house?: string;
  phase?: string;
  totalSquareMeters?: number;
  productInterest?: string;
  employeeId?: string;
  customerSignedDate: string;
}

export async function createOpportunity(
  data: OpportunityPayload
): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_URL}/api/sf/opportunity`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to create opportunity");
  }
  return res.json();
}
