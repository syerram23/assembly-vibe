/*
 * Assembly Vibe — core data types
 *
 * Mirrors the spec in section 4.9 of the build doc.
 * All tenant-scoped data carries `organizationId`.
 */

export type AppLifecycle =
  | "Draft"
  | "Scoped"
  | "In build"
  | "Blocked"
  | "In productionization"
  | "In review"
  | "Approved"
  | "Live"
  | "Deprecated"
  | "Offboarded";

export type TicketType = "Support" | "Productionization";
export type TicketStatus =
  | "Open"
  | "Triaged"
  | "Assigned"
  | "In progress"
  | "In review"
  | "Closed";

export type Role = "Owner" | "Admin" | "Builder" | "Reviewer" | "Viewer";

export type ConnectorStatus = "Healthy" | "Syncing" | "Error" | "Paused" | "Not connected";

export type AgentStatus = "Available" | "Configured" | "Not set up" | "Coming soon";

export type ChecklistItemStatus = "Pass" | "Fail" | "Pending";

// ─── Organization & users ──────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  region: string;             // data residency
  engagementPath: "self-service" | "partner" | "delivery";
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarColor: string;        // for placeholder avatars
}

export interface Membership {
  id: string;
  organizationId: string;
  userId: string;
  role: Role;
  invitedAt: string;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  certificationStatus: "Pending" | "Certified" | "Expired";
  certifiedOn?: string;
  organizationsAccessible: string[];
  specialties: string[];      // e.g. ["healthcare", "fintech"]
}

// ─── Data plane ────────────────────────────────────────────────────────────

export interface Connector {
  id: string;
  organizationId: string;
  type: string;               // e.g. "salesforce", "workday"
  displayName: string;
  status: ConnectorStatus;
  lastSyncAt?: string;
  recordCount?: number;
  scope: string;              // e.g. "read-only"
}

export interface SyncJob {
  id: string;
  connectorId: string;
  startedAt: string;
  finishedAt?: string;
  status: "Success" | "Failed" | "Running";
  recordsSynced?: number;
  errorMessage?: string;
}

export interface EntityType {
  id: string;
  organizationId: string;
  name: string;
  displayName: string;
  recordCount: number;
  fields: Field[];
  source?: string;            // connector id or "manual"
}

export interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date" | "ref" | "json";
  required: boolean;
  isPII: boolean;
  refEntityId?: string;       // for relationships
}

export interface EntityRecord {
  id: string;
  entityTypeId: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface VectorIndex {
  id: string;
  organizationId: string;
  name: string;
  sources: string[];          // entity types or connectors indexed
  embeddingModel: string;
  chunkSize: number;
  chunkCount: number;
  lastReindexAt?: string;
}

// ─── Governance ────────────────────────────────────────────────────────────

export interface DataRule {
  id: string;
  organizationId: string;
  name: string;
  appliesTo: string;
  transformation: string;
  active: boolean;
}

export interface PolicyRuleset {
  id: string;
  organizationId: string;
  name: string;
  category: "PII" | "Compliance" | "Retention" | "Access";
  version: string;
  rules: string[];
  active: boolean;
}

// ─── Access ────────────────────────────────────────────────────────────────

export interface Permission {
  id: string;
  scope: string;              // e.g. "entity:contact" or "entity:contact.salary"
  level: "read" | "write" | "admin" | "deny";
}

export interface PermissionRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  builtIn: boolean;
  permissions: Permission[];
  memberCount: number;
}

// ─── Agents & tools ────────────────────────────────────────────────────────

export interface Agent {
  id: string;
  organizationId: string;
  code: string;               // "CV", "SR", "BA", "AI", "DG", "WF"
  name: string;
  description: string;
  examples: string;
  status: AgentStatus;
  category: "conversational" | "search" | "docgen" | "system" | "browser" | "workflow";
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
}

// ─── Applications ──────────────────────────────────────────────────────────

export interface Application {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  lifecycle: AppLifecycle;
  entitiesUsed: string[];
  agentsUsed: string[];
  repositoryId?: string;
  buildCredentialId?: string;
  currentVersion?: string;    // app version id
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  applicationId: string;
  url: string;                // e.g. https://github.com/assembly-vibe-orgs/<slug>
  owner: "Assembly" | "Customer";
  template: string;
  status: "Provisioning" | "Active" | "Transferred" | "Archived";
}

export interface BuildCredential {
  id: string;
  applicationId: string;
  token: string;              // displayed truncated
  scope: string;              // e.g. "app:hr-comp-band-bot"
  status: "Active" | "Revoked";
  createdAt: string;
}

// ─── Releases ──────────────────────────────────────────────────────────────

export interface AppVersion {
  id: string;
  applicationId: string;
  versionTag: string;         // e.g. "v0.4.2"
  commitSha: string;
  createdAt: string;
  releaseId?: string;
}

export interface ChecklistItem {
  id: string;
  key:
    | "permissions-tested"
    | "pii-reviewed"
    | "security-scan"
    | "app-owner"
    | "environment-confirmed";
  label: string;
  status: ChecklistItemStatus;
  detail?: string;
  checkedBy?: string;
  checkedAt?: string;
}

export interface Release {
  id: string;
  applicationId: string;
  appVersionId: string;
  checklist: ChecklistItem[];
  approverId?: string;        // Org Admin
  approvedAt?: string;
  decision: "Pending" | "Approved" | "Denied";
  createdAt: string;
}

export interface ChangeRequest {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  raisedById: string;
  status: "Draft" | "In build" | "In review" | "Approved" | "Live" | "Rejected";
  linkedReleaseId?: string;
  createdAt: string;
}

// ─── Work module ───────────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  organizationId: string;
  applicationId: string;
  title: string;
  type: TicketType;
  description: string;
  raisedById: string;
  assigneeId?: string;        // Assembly engineer
  status: TicketStatus;
  urgency: "low" | "normal" | "high";
  linkedPRs: { url: string; status: "open" | "merged" | "closed" }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Workflows ─────────────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  applicationId?: string;
  trigger: string;
  steps: number;
  active: boolean;
  lastRunAt?: string;
  successRate24h: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "Running" | "Success" | "Failed" | "Awaiting review";
  startedAt: string;
  durationMs?: number;
}

export interface ReviewItem {
  id: string;
  organizationId: string;
  workflowRunId: string;
  applicationName: string;
  step: string;
  description: string;
  assigneeId?: string;
  raisedAt: string;
  slaDueAt: string;
}

// ─── Activity ──────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface Alert {
  id: string;
  organizationId: string;
  name: string;
  trigger: string;
  channel: "email" | "slack" | "pagerduty" | "webhook";
  target: string;
  active: boolean;
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  organizationId: string;
  provider: "anthropic" | "openai" | "google" | "azure" | "internal";
  label: string;
  status: "Active" | "Revoked";
  createdAt: string;
  lastUsedAt?: string;
  maskedKey: string;          // e.g. "sk-ant-...8b21"
}
