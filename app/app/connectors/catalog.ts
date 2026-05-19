/*
 * Connector catalog + helpers — shared by the connectors list page
 * and the add-connector flow. Pure mock data, no side effects.
 */

import type { ConnectorStatus } from "@/lib/types";

export interface CatalogItem {
  type: string;
  name: string;
  description: string;
}

export interface CatalogCategory {
  category: string;
  items: CatalogItem[];
}

export const CONNECTOR_CATALOG: CatalogCategory[] = [
  {
    category: "CRM",
    items: [
      { type: "salesforce", name: "Salesforce", description: "Pull contacts, accounts, opportunities, and cases." },
      { type: "hubspot",    name: "HubSpot",    description: "Pull contacts, companies, deals, and tickets." },
    ],
  },
  {
    category: "HRIS",
    items: [
      { type: "workday",  name: "Workday",  description: "Employees, levels, locations, departments." },
      { type: "bamboohr", name: "BambooHR", description: "People records and org structure." },
    ],
  },
  {
    category: "Data",
    items: [
      { type: "snowflake", name: "Snowflake", description: "Read from the warehouse via secure JDBC role." },
      { type: "postgres",  name: "Postgres",  description: "Read-only access to operational schemas." },
      { type: "bigquery",  name: "BigQuery",  description: "Read from datasets via service account." },
    ],
  },
  {
    category: "Comms",
    items: [
      { type: "slack", name: "Slack", description: "Send messages, run /commands, post to channels." },
      { type: "teams", name: "Teams", description: "Post adaptive cards and run channel actions." },
      { type: "email", name: "Email", description: "Inbound + outbound mail via mailbox routing." },
    ],
  },
  {
    category: "Files",
    items: [
      { type: "google",   name: "Google Drive", description: "Index scoped folders for retrieval." },
      { type: "onedrive", name: "OneDrive",     description: "Index documents from selected libraries." },
      { type: "s3",       name: "Amazon S3",    description: "Read and write to a scoped bucket prefix." },
    ],
  },
  {
    category: "Industry",
    items: [
      { type: "guidewire", name: "Guidewire", description: "Open files, attach notes, sync policy state." },
      { type: "duckcreek", name: "Duck Creek", description: "Read policies, claims, and accounting events." },
      { type: "bullhorn",  name: "Bullhorn",   description: "Candidate, placement, and timesheet objects." },
    ],
  },
  {
    category: "Generic",
    items: [
      { type: "rest", name: "REST / Webhook", description: "Generic HTTP for systems without a connector." },
    ],
  },
];

export function statusTone(s: ConnectorStatus): "neutral" | "indigo" | "sage" | "amber" | "warn" {
  switch (s) {
    case "Healthy":       return "sage";
    case "Syncing":       return "indigo";
    case "Error":         return "warn";
    case "Paused":        return "amber";
    case "Not connected": return "neutral";
  }
}

export function iconLetter(type: string): string {
  if (type === "rest") return "{ }";
  return type.charAt(0).toUpperCase();
}

export function displayType(type: string): string {
  const map: Record<string, string> = {
    salesforce: "salesforce",
    hubspot: "hubspot",
    workday: "workday",
    bamboohr: "bamboohr",
    snowflake: "snowflake",
    postgres: "postgres",
    bigquery: "bigquery",
    slack: "slack",
    teams: "teams",
    email: "email",
    google: "google-workspace",
    onedrive: "onedrive",
    s3: "amazon-s3",
    guidewire: "guidewire",
    duckcreek: "duck-creek",
    bullhorn: "bullhorn",
    rest: "rest/webhook",
  };
  return map[type] ?? type;
}

export function catalogItemFor(type: string): CatalogItem | undefined {
  for (const cat of CONNECTOR_CATALOG) {
    const item = cat.items.find((i) => i.type === type);
    if (item) return item;
  }
  return undefined;
}
