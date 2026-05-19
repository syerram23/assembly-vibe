/*
 * Mock seed data for Assembly Vibe.
 * Single source of truth — every module imports from here.
 */

import type {
  Organization,
  User,
  Membership,
  PartnerProfile,
  Connector,
  EntityType,
  VectorIndex,
  PolicyRuleset,
  PermissionRole,
  Agent,
  Application,
  Repository,
  BuildCredential,
  AppVersion,
  Release,
  ChangeRequest,
  Ticket,
  Workflow,
  WorkflowRun,
  ReviewItem,
  AuditEvent,
  Alert,
  ApiKey,
} from "./types";

// ─── Organization ──────────────────────────────────────────────────────────

export const currentOrg: Organization = {
  id: "org_acme",
  name: "Acme Mortgage",
  industry: "Regulated banking",
  size: "1,200 employees",
  region: "us-east-1",
  engagementPath: "self-service",
  createdAt: "2025-11-04T14:20:00Z",
};

// ─── Users + memberships ───────────────────────────────────────────────────

export const users: User[] = [
  { id: "u_maria",   email: "maria@acme.com",      fullName: "Maria Cordova",       avatarColor: "#4F46E5" },
  { id: "u_devon",   email: "devon@acme.com",      fullName: "Devon Park",          avatarColor: "#2F6B40" },
  { id: "u_priya",   email: "priya@acme.com",      fullName: "Priya Iyer",          avatarColor: "#7A511A" },
  { id: "u_jordan",  email: "jordan@acme.com",     fullName: "Jordan Reyes",        avatarColor: "#9B2C24" },
  { id: "u_sasha",   email: "sasha@acme.com",      fullName: "Sasha Whitfield",     avatarColor: "#3F37B8" },
  { id: "u_eng_lin", email: "lin@assembly.io",     fullName: "Lin Tao · Assembly",  avatarColor: "#15172A" },
  { id: "u_eng_omar",email: "omar@assembly.io",    fullName: "Omar Bashir · Assembly", avatarColor: "#15172A" },
];

export const memberships: Membership[] = [
  { id: "m_1", organizationId: "org_acme", userId: "u_maria",  role: "Owner",    invitedAt: "2025-11-04T14:20:00Z" },
  { id: "m_2", organizationId: "org_acme", userId: "u_devon",  role: "Admin",    invitedAt: "2025-11-06T10:11:00Z" },
  { id: "m_3", organizationId: "org_acme", userId: "u_priya",  role: "Builder",  invitedAt: "2025-12-01T08:35:00Z" },
  { id: "m_4", organizationId: "org_acme", userId: "u_jordan", role: "Builder",  invitedAt: "2025-12-04T12:00:00Z" },
  { id: "m_5", organizationId: "org_acme", userId: "u_sasha",  role: "Reviewer", invitedAt: "2026-01-10T09:00:00Z" },
];

export const partnerProfiles: PartnerProfile[] = [
  {
    id: "pp_1",
    userId: "u_eng_lin",
    certificationStatus: "Certified",
    certifiedOn: "2025-09-20",
    organizationsAccessible: ["org_acme"],
    specialties: ["banking", "compliance"],
  },
  {
    id: "pp_2",
    userId: "u_eng_omar",
    certificationStatus: "Certified",
    certifiedOn: "2025-10-02",
    organizationsAccessible: ["org_acme"],
    specialties: ["insurance", "claims"],
  },
];

// ─── Connectors ────────────────────────────────────────────────────────────

export const connectors: Connector[] = [
  { id: "conn_workday",   organizationId: "org_acme", type: "workday",      displayName: "Workday · Employees",     status: "Healthy",  lastSyncAt: "2026-05-18T18:42:00Z", recordCount: 1247,  scope: "read-only" },
  { id: "conn_sf",        organizationId: "org_acme", type: "salesforce",   displayName: "Salesforce · Accounts",   status: "Healthy",  lastSyncAt: "2026-05-18T18:30:00Z", recordCount: 8402,  scope: "read-only" },
  { id: "conn_sn",        organizationId: "org_acme", type: "snowflake",    displayName: "Snowflake · Warehouse",   status: "Healthy",  lastSyncAt: "2026-05-18T18:14:00Z", recordCount: 1840000, scope: "read-only" },
  { id: "conn_ghd",       organizationId: "org_acme", type: "guidewire",    displayName: "Guidewire · Policies",    status: "Syncing",  lastSyncAt: "2026-05-18T18:38:00Z", recordCount: 11083, scope: "read + write" },
  { id: "conn_gws",       organizationId: "org_acme", type: "google",       displayName: "Google Workspace",        status: "Healthy",  lastSyncAt: "2026-05-18T17:55:00Z", recordCount: 342,   scope: "scoped folders" },
  { id: "conn_slk",       organizationId: "org_acme", type: "slack",        displayName: "Slack",                   status: "Healthy",  lastSyncAt: "2026-05-18T18:41:00Z", recordCount: 18,    scope: "channels: 11" },
  { id: "conn_pg",        organizationId: "org_acme", type: "postgres",     displayName: "Postgres · Risk DB",      status: "Error",    lastSyncAt: "2026-05-18T15:02:00Z", recordCount: 4855,  scope: "read-only" },
];

// ─── Entities ──────────────────────────────────────────────────────────────

export const entities: EntityType[] = [
  {
    id: "ent_employee",
    organizationId: "org_acme",
    name: "employee",
    displayName: "Employee",
    recordCount: 1247,
    source: "conn_workday",
    fields: [
      { id: "f_e_id",     name: "employee_id",   type: "string", required: true,  isPII: false },
      { id: "f_e_name",   name: "full_name",     type: "string", required: true,  isPII: true },
      { id: "f_e_email",  name: "email",         type: "string", required: true,  isPII: true },
      { id: "f_e_level",  name: "level",         type: "string", required: true,  isPII: false },
      { id: "f_e_loc",    name: "location",      type: "string", required: false, isPII: false },
      { id: "f_e_dept",   name: "department",    type: "string", required: false, isPII: false },
      { id: "f_e_dob",    name: "date_of_birth", type: "date",   required: false, isPII: true },
      { id: "f_e_salary", name: "base_salary",   type: "number", required: false, isPII: true },
    ],
  },
  {
    id: "ent_candidate",
    organizationId: "org_acme",
    name: "candidate",
    displayName: "Candidate",
    recordCount: 11083,
    source: "conn_ghd",
    fields: [
      { id: "f_c_id",     name: "candidate_id", type: "string", required: true,  isPII: false },
      { id: "f_c_name",   name: "full_name",    type: "string", required: true,  isPII: true },
      { id: "f_c_role",   name: "applied_role", type: "string", required: true,  isPII: false },
      { id: "f_c_stage",  name: "stage",        type: "string", required: true,  isPII: false },
      { id: "f_c_owner",  name: "owner_id",     type: "ref",    required: false, isPII: false, refEntityId: "ent_employee" },
    ],
  },
  {
    id: "ent_claim",
    organizationId: "org_acme",
    name: "claim",
    displayName: "Claim",
    recordCount: 5855,
    source: "conn_ghd",
    fields: [
      { id: "f_cl_id",    name: "claim_id",    type: "string", required: true, isPII: false },
      { id: "f_cl_amt",   name: "amount",      type: "number", required: true, isPII: false },
      { id: "f_cl_state", name: "state",       type: "string", required: true, isPII: false },
      { id: "f_cl_open",  name: "opened_at",   type: "date",   required: true, isPII: false },
      { id: "f_cl_pol",   name: "policy_ref",  type: "string", required: true, isPII: false },
    ],
  },
  {
    id: "ent_account",
    organizationId: "org_acme",
    name: "account",
    displayName: "Account",
    recordCount: 8402,
    source: "conn_sf",
    fields: [
      { id: "f_a_id",   name: "account_id",   type: "string", required: true, isPII: false },
      { id: "f_a_name", name: "name",         type: "string", required: true, isPII: false },
      { id: "f_a_arr",  name: "annual_value", type: "number", required: false, isPII: false },
    ],
  },
];

// ─── Vector indexes ────────────────────────────────────────────────────────

export const vectorIndexes: VectorIndex[] = [
  {
    id: "vi_policy",
    organizationId: "org_acme",
    name: "policy-docs-v3",
    sources: ["conn_ghd", "conn_gws"],
    embeddingModel: "voyage-3-large",
    chunkSize: 800,
    chunkCount: 41284,
    lastReindexAt: "2026-05-17T03:00:00Z",
  },
  {
    id: "vi_regs",
    organizationId: "org_acme",
    name: "cfpb-reg-pack-v2.1",
    sources: ["manual-upload"],
    embeddingModel: "voyage-3-large",
    chunkSize: 1200,
    chunkCount: 8430,
    lastReindexAt: "2026-04-29T10:00:00Z",
  },
];

// ─── Policies ──────────────────────────────────────────────────────────────

export const policyRulesets: PolicyRuleset[] = [
  {
    id: "pr_pii",
    organizationId: "org_acme",
    name: "PII detection & masking",
    category: "PII",
    version: "v1.4",
    rules: ["mask: ssn, dob, salary", "redact: email outside org", "audit: every PII read"],
    active: true,
  },
  {
    id: "pr_rege",
    organizationId: "org_acme",
    name: "Reg E quarterly pack",
    category: "Compliance",
    version: "v2.1",
    rules: ["CFPB §1005.11 disputes", "10-business-day investigation rule"],
    active: true,
  },
  {
    id: "pr_ret",
    organizationId: "org_acme",
    name: "Retention",
    category: "Retention",
    version: "v1.0",
    rules: ["logs: 7 years", "embeddings: 3 years", "raw records: customer-controlled"],
    active: true,
  },
];

// ─── Roles & permissions ───────────────────────────────────────────────────

export const permissionRoles: PermissionRole[] = [
  {
    id: "role_owner",
    organizationId: "org_acme",
    name: "Owner",
    description: "Full access. One per org. Cannot be deleted.",
    builtIn: true,
    permissions: [{ id: "p_o_all", scope: "*", level: "admin" }],
    memberCount: 1,
  },
  {
    id: "role_admin",
    organizationId: "org_acme",
    name: "Admin",
    description: "Full access except billing transfer.",
    builtIn: true,
    permissions: [
      { id: "p_a_org", scope: "organization", level: "admin" },
      { id: "p_a_apps", scope: "application:*", level: "admin" },
      { id: "p_a_billing", scope: "billing", level: "read" },
    ],
    memberCount: 1,
  },
  {
    id: "role_builder",
    organizationId: "org_acme",
    name: "Builder",
    description: "Connects data, configures agents, ships apps. Cannot promote to production.",
    builtIn: true,
    permissions: [
      { id: "p_b_apps_w", scope: "application:*", level: "write" },
      { id: "p_b_data",   scope: "entity:*",      level: "read"  },
      { id: "p_b_pii",    scope: "entity:*.pii",  level: "deny"  },
    ],
    memberCount: 2,
  },
  {
    id: "role_reviewer",
    organizationId: "org_acme",
    name: "Reviewer",
    description: "Works the review inbox; approves HITL gates.",
    builtIn: true,
    permissions: [
      { id: "p_r_review", scope: "review:*",      level: "write" },
      { id: "p_r_audit",  scope: "audit",         level: "read"  },
    ],
    memberCount: 1,
  },
  {
    id: "role_viewer",
    organizationId: "org_acme",
    name: "Viewer",
    description: "Read-only. Sees governed views per role.",
    builtIn: true,
    permissions: [
      { id: "p_v_apps", scope: "application:*", level: "read" },
      { id: "p_v_data", scope: "entity:*",      level: "read" },
      { id: "p_v_pii",  scope: "entity:*.pii",  level: "deny" },
    ],
    memberCount: 0,
  },
];

// ─── Agents ────────────────────────────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: "agent_conv", organizationId: "org_acme", code: "CV", name: "Conversational agent",
    category: "conversational",
    description: "Runs real human conversations end to end: collects documents, verifies details, follows up, escalates when needed.",
    examples: "Reviewer panel · 4-channel notifications · clarifying questions · final attestation",
    status: "Configured",
  },
  {
    id: "agent_search", organizationId: "org_acme", code: "SR", name: "Search",
    category: "search",
    description: "Ask a question in plain language and get the answer from across every connected, governed source.",
    examples: "Regulatory lookup · prior-case retrieval · cross-system evidence search",
    status: "Configured",
  },
  {
    id: "agent_docgen", organizationId: "org_acme", code: "DG", name: "Document generation",
    category: "docgen",
    description: "Turn your data into polished reports, summaries, and completed documents automatically.",
    examples: "CMP audit report · finding records · remediation tickets · customer letters",
    status: "Configured",
  },
  {
    id: "agent_system", organizationId: "org_acme", code: "AI", name: "System actions & integrations",
    category: "system",
    description: "Pre-built actions into your existing tools, callable from any app you build.",
    examples: "SFDC contact sync · Guidewire file open · DW reconciliation · webhook handlers",
    status: "Available",
  },
  {
    id: "agent_browse", organizationId: "org_acme", code: "BA", name: "Browser automation",
    category: "browser",
    description: "Operates web tools and portals that have no API, the way a person would.",
    examples: "Carrier dispute filing · partner extranet operations · portal-only systems of record",
    status: "Available",
  },
  {
    id: "agent_wf", organizationId: "org_acme", code: "WF", name: "Workflow building blocks",
    category: "workflow",
    description: "Retries, approvals, scheduling and human review — the durable pieces, ready to assemble.",
    examples: "Reg E quarterly run · FNOL state machine · multi-step recruiting follow-up",
    status: "Configured",
  },
];

// ─── Applications ──────────────────────────────────────────────────────────

export const applications: Application[] = [
  {
    id: "app_compband", organizationId: "org_acme", name: "Comp-band bot", slug: "comp-band-bot",
    description: "Slack command that answers compensation-band questions for hiring managers.",
    ownerId: "u_priya", lifecycle: "Live",
    entitiesUsed: ["ent_employee"], agentsUsed: ["agent_conv", "agent_search"],
    repositoryId: "repo_compband", buildCredentialId: "bc_compband", currentVersion: "av_compband_v3",
    createdAt: "2026-03-12T09:00:00Z", updatedAt: "2026-05-17T14:00:00Z",
  },
  {
    id: "app_rege", organizationId: "org_acme", name: "Reg E quarterly run", slug: "reg-e-quarterly-run",
    description: "Continuous compliance testing for Reg E: sampling, controls evaluation, HITL disposition, CMP report.",
    ownerId: "u_maria", lifecycle: "Live",
    entitiesUsed: ["ent_claim"], agentsUsed: ["agent_wf", "agent_docgen", "agent_search"],
    repositoryId: "repo_rege", buildCredentialId: "bc_rege", currentVersion: "av_rege_v7",
    createdAt: "2026-01-05T11:00:00Z", updatedAt: "2026-05-17T22:00:00Z",
  },
  {
    id: "app_fnol", organizationId: "org_acme", name: "FNOL intake", slug: "fnol-intake",
    description: "First-notice-of-loss intake on voice + text, with state-aware coverage check and Guidewire file open.",
    ownerId: "u_jordan", lifecycle: "In review",
    entitiesUsed: ["ent_claim"], agentsUsed: ["agent_conv", "agent_system"],
    repositoryId: "repo_fnol", buildCredentialId: "bc_fnol", currentVersion: "av_fnol_v2",
    createdAt: "2026-04-18T13:00:00Z", updatedAt: "2026-05-18T16:00:00Z",
  },
  {
    id: "app_ar", organizationId: "org_acme", name: "AR follow-up", slug: "ar-followup",
    description: "Follows up on outstanding invoices with right-tone messages and escalation when customers ghost.",
    ownerId: "u_priya", lifecycle: "In productionization",
    entitiesUsed: ["ent_account"], agentsUsed: ["agent_conv", "agent_docgen"],
    repositoryId: "repo_ar", buildCredentialId: "bc_ar",
    createdAt: "2026-05-01T10:00:00Z", updatedAt: "2026-05-18T11:30:00Z",
  },
  {
    id: "app_vendor", organizationId: "org_acme", name: "Vendor onboarding", slug: "vendor-onboarding",
    description: "Replaces a stalled manual vendor onboarding workflow with an app the procurement team owns.",
    ownerId: "u_jordan", lifecycle: "Blocked",
    entitiesUsed: ["ent_account"], agentsUsed: ["agent_conv", "agent_docgen", "agent_system"],
    repositoryId: "repo_vendor", buildCredentialId: "bc_vendor",
    createdAt: "2026-05-09T09:00:00Z", updatedAt: "2026-05-18T08:00:00Z",
  },
  {
    id: "app_carrier", organizationId: "org_acme", name: "Carrier exception", slug: "carrier-exception",
    description: "Triage carrier exceptions: missed pickups, re-rates, accessorials, damage claims.",
    ownerId: "u_devon", lifecycle: "In build",
    entitiesUsed: ["ent_account"], agentsUsed: ["agent_browse", "agent_wf"],
    repositoryId: "repo_carrier", buildCredentialId: "bc_carrier",
    createdAt: "2026-05-14T15:00:00Z", updatedAt: "2026-05-18T17:00:00Z",
  },
  {
    id: "app_redline", organizationId: "org_acme", name: "Contract redline", slug: "contract-redline",
    description: "Drafts and redlines third-party contracts against the standard MSA playbook.",
    ownerId: "u_devon", lifecycle: "Draft",
    entitiesUsed: [], agentsUsed: [],
    createdAt: "2026-05-18T09:30:00Z", updatedAt: "2026-05-18T09:30:00Z",
  },
];

export const repositories: Repository[] = [
  { id: "repo_compband", applicationId: "app_compband", url: "https://github.com/assembly-vibe-orgs/acme/comp-band-bot",    owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
  { id: "repo_rege",     applicationId: "app_rege",     url: "https://github.com/assembly-vibe-orgs/acme/reg-e-quarterly-run", owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
  { id: "repo_fnol",     applicationId: "app_fnol",     url: "https://github.com/assembly-vibe-orgs/acme/fnol-intake",       owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
  { id: "repo_ar",       applicationId: "app_ar",       url: "https://github.com/assembly-vibe-orgs/acme/ar-followup",       owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
  { id: "repo_vendor",   applicationId: "app_vendor",   url: "https://github.com/assembly-vibe-orgs/acme/vendor-onboarding", owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
  { id: "repo_carrier",  applicationId: "app_carrier",  url: "https://github.com/assembly-vibe-orgs/acme/carrier-exception", owner: "Assembly", template: "@assembly/framework-app:1.4", status: "Active" },
];

export const buildCredentials: BuildCredential[] = [
  { id: "bc_compband", applicationId: "app_compband", token: "asm_live_…f3a9", scope: "app:comp-band-bot",    status: "Active", createdAt: "2026-03-12T09:01:00Z" },
  { id: "bc_rege",     applicationId: "app_rege",     token: "asm_live_…b412", scope: "app:reg-e-quarterly-run", status: "Active", createdAt: "2026-01-05T11:01:00Z" },
  { id: "bc_fnol",     applicationId: "app_fnol",     token: "asm_live_…0c11", scope: "app:fnol-intake",       status: "Active", createdAt: "2026-04-18T13:01:00Z" },
  { id: "bc_ar",       applicationId: "app_ar",       token: "asm_live_…e72d", scope: "app:ar-followup",       status: "Active", createdAt: "2026-05-01T10:01:00Z" },
  { id: "bc_vendor",   applicationId: "app_vendor",   token: "asm_live_…9a02", scope: "app:vendor-onboarding", status: "Active", createdAt: "2026-05-09T09:01:00Z" },
  { id: "bc_carrier",  applicationId: "app_carrier",  token: "asm_live_…66b8", scope: "app:carrier-exception", status: "Active", createdAt: "2026-05-14T15:01:00Z" },
];

// ─── App versions / releases ───────────────────────────────────────────────

export const appVersions: AppVersion[] = [
  { id: "av_compband_v1", applicationId: "app_compband", versionTag: "v0.1.0", commitSha: "a3f7c2e", createdAt: "2026-03-22T14:00:00Z" },
  { id: "av_compband_v2", applicationId: "app_compband", versionTag: "v0.2.0", commitSha: "8c1d7f4", createdAt: "2026-04-19T16:30:00Z" },
  { id: "av_compband_v3", applicationId: "app_compband", versionTag: "v0.3.0", commitSha: "f29b0a1", createdAt: "2026-05-12T09:15:00Z" },
  { id: "av_rege_v6",     applicationId: "app_rege",     versionTag: "v0.6.0", commitSha: "d4ee210", createdAt: "2026-04-08T22:00:00Z" },
  { id: "av_rege_v7",     applicationId: "app_rege",     versionTag: "v0.7.0", commitSha: "b9c3771", createdAt: "2026-05-08T22:00:00Z" },
  { id: "av_fnol_v1",     applicationId: "app_fnol",     versionTag: "v0.1.0", commitSha: "e1ab842", createdAt: "2026-04-25T18:00:00Z" },
  { id: "av_fnol_v2",     applicationId: "app_fnol",     versionTag: "v0.2.0", commitSha: "55ad093", createdAt: "2026-05-17T12:00:00Z" },
];

export const releases: Release[] = [
  {
    id: "rel_fnol_v2", applicationId: "app_fnol", appVersionId: "av_fnol_v2",
    checklist: [
      { id: "c1", key: "permissions-tested",   label: "Permissions tested via Access simulator", status: "Pass", checkedBy: "u_devon", checkedAt: "2026-05-18T10:00:00Z", detail: "Tested Builder + Reviewer + Viewer." },
      { id: "c2", key: "pii-reviewed",         label: "PII / sensitive data reviewed",            status: "Pass", checkedBy: "u_devon", checkedAt: "2026-05-18T10:15:00Z", detail: "Claimant SSN + DOB masked at field-level." },
      { id: "c3", key: "security-scan",        label: "Security scan clean",                     status: "Pass", checkedBy: "github-bot", checkedAt: "2026-05-18T11:00:00Z", detail: "No CVEs · no leaked secrets · spec conformance passed." },
      { id: "c4", key: "app-owner",            label: "App owner assigned",                      status: "Pass", checkedBy: "u_jordan", checkedAt: "2026-05-18T11:30:00Z", detail: "Owner: Jordan Reyes (Builder)." },
      { id: "c5", key: "environment-confirmed", label: "Environment confirmed (production · us-east-1)", status: "Pending" },
    ],
    decision: "Pending",
    createdAt: "2026-05-18T09:00:00Z",
  },
  {
    id: "rel_compband_v3", applicationId: "app_compband", appVersionId: "av_compband_v3",
    checklist: [
      { id: "c11", key: "permissions-tested",   label: "Permissions tested via Access simulator",  status: "Pass" },
      { id: "c12", key: "pii-reviewed",         label: "PII / sensitive data reviewed",            status: "Pass" },
      { id: "c13", key: "security-scan",        label: "Security scan clean",                     status: "Pass" },
      { id: "c14", key: "app-owner",            label: "App owner assigned",                      status: "Pass" },
      { id: "c15", key: "environment-confirmed", label: "Environment confirmed",                  status: "Pass" },
    ],
    approverId: "u_maria",
    approvedAt: "2026-05-13T08:42:00Z",
    decision: "Approved",
    createdAt: "2026-05-12T11:00:00Z",
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: "cr_compband_band_v4",
    applicationId: "app_compband",
    title: "Add band v4 — incorporate new L7/L8 ranges",
    description: "Add the new comp-band ranges effective Q3. Includes adjustment to the Slack reply formatting.",
    raisedById: "u_priya",
    status: "In review",
    createdAt: "2026-05-15T14:00:00Z",
  },
];

// ─── Tickets ───────────────────────────────────────────────────────────────

export const tickets: Ticket[] = [
  {
    id: "tkt_vendor_migration",
    organizationId: "org_acme",
    applicationId: "app_vendor",
    title: "Migrate ARIBA vendor master into governed data plane",
    type: "Productionization",
    description: "Need a one-shot migration of the ARIBA vendor master with reconciliation. Includes deduping the supplier records against the Snowflake AR table.",
    raisedById: "u_jordan",
    assigneeId: "u_eng_lin",
    status: "In progress",
    urgency: "normal",
    linkedPRs: [{ url: "https://github.com/assembly-vibe-orgs/acme/vendor-onboarding/pull/14", status: "open" }],
    createdAt: "2026-05-18T08:00:00Z",
    updatedAt: "2026-05-18T17:42:00Z",
  },
  {
    id: "tkt_fnol_voice_dropouts",
    organizationId: "org_acme",
    applicationId: "app_fnol",
    title: "Voice call dropouts after ~6 minutes",
    type: "Support",
    description: "FNOL agent voice channel disconnects callers around the 6-minute mark intermittently. Logs attached.",
    raisedById: "u_devon",
    assigneeId: "u_eng_omar",
    status: "Triaged",
    urgency: "high",
    linkedPRs: [],
    createdAt: "2026-05-17T22:14:00Z",
    updatedAt: "2026-05-18T09:00:00Z",
  },
  {
    id: "tkt_ar_followup_throttle",
    organizationId: "org_acme",
    applicationId: "app_ar",
    title: "Throttle policy for follow-up cadence",
    type: "Productionization",
    description: "Implement a per-customer throttle so we don't email a single contact more than 2x in 7 days.",
    raisedById: "u_priya",
    status: "Open",
    urgency: "normal",
    linkedPRs: [],
    createdAt: "2026-05-18T11:00:00Z",
    updatedAt: "2026-05-18T11:00:00Z",
  },
];

// ─── Workflows ─────────────────────────────────────────────────────────────

export const workflows: Workflow[] = [
  { id: "wf_rege",     organizationId: "org_acme", name: "reg-e-quarterly-run",  applicationId: "app_rege",  trigger: "schedule: quarterly", steps: 5, active: true,  lastRunAt: "2026-05-17T22:00:00Z", successRate24h: 100 },
  { id: "wf_fnol",     organizationId: "org_acme", name: "fnol-intake",         applicationId: "app_fnol",  trigger: "voice + text inbound", steps: 8, active: true,  lastRunAt: "2026-05-18T18:48:00Z", successRate24h: 99.7 },
  { id: "wf_compband", organizationId: "org_acme", name: "comp-band-lookup",    applicationId: "app_compband", trigger: "slack /comp",     steps: 4, active: true,  lastRunAt: "2026-05-18T18:51:00Z", successRate24h: 100 },
  { id: "wf_ar",       organizationId: "org_acme", name: "ar-followup-cadence", applicationId: "app_ar",     trigger: "daily 09:00 ET",      steps: 6, active: false, successRate24h: 0  },
];

export const workflowRuns: WorkflowRun[] = [
  { id: "wfr_1", workflowId: "wf_rege",     status: "Awaiting review", startedAt: "2026-05-17T22:00:00Z" },
  { id: "wfr_2", workflowId: "wf_compband", status: "Success",         startedAt: "2026-05-18T18:51:00Z", durationMs: 84 },
  { id: "wfr_3", workflowId: "wf_fnol",     status: "Success",         startedAt: "2026-05-18T18:48:00Z", durationMs: 187_000 },
  { id: "wfr_4", workflowId: "wf_fnol",     status: "Running",         startedAt: "2026-05-18T18:51:00Z" },
];

export const reviewQueue: ReviewItem[] = [
  {
    id: "rev_1", organizationId: "org_acme", workflowRunId: "wfr_1", applicationName: "Reg E quarterly run",
    step: "hitl.disposition", description: "7 borderline findings · CFPB §1005.11 — please disposition",
    assigneeId: "u_sasha", raisedAt: "2026-05-17T22:14:00Z", slaDueAt: "2026-05-20T22:00:00Z",
  },
  {
    id: "rev_2", organizationId: "org_acme", workflowRunId: "wfr_4", applicationName: "FNOL intake",
    step: "hitl.coverage-edge-case", description: "Out-of-state collision · coverage interpretation needed",
    assigneeId: "u_sasha", raisedAt: "2026-05-18T18:52:00Z", slaDueAt: "2026-05-18T22:00:00Z",
  },
];

// ─── Activity ──────────────────────────────────────────────────────────────

export const auditEvents: AuditEvent[] = [
  { id: "ae_1", organizationId: "org_acme", actorId: "u_devon",   actorName: "Devon Park",       action: "release.checklist.pass",  target: "fnol-intake / pii-reviewed",       createdAt: "2026-05-18T10:15:00Z" },
  { id: "ae_2", organizationId: "org_acme", actorId: "u_maria",   actorName: "Maria Cordova",    action: "release.approved",        target: "comp-band-bot v0.3.0",             createdAt: "2026-05-13T08:42:00Z" },
  { id: "ae_3", organizationId: "org_acme", actorId: "u_jordan",  actorName: "Jordan Reyes",     action: "ticket.raised",           target: "vendor-onboarding / migration",     createdAt: "2026-05-18T08:00:00Z" },
  { id: "ae_4", organizationId: "org_acme", actorId: "u_priya",   actorName: "Priya Iyer",       action: "application.created",     target: "ar-followup",                       createdAt: "2026-05-01T10:00:00Z" },
  { id: "ae_5", organizationId: "org_acme", actorId: "u_eng_lin", actorName: "Lin Tao",          action: "pr.opened",               target: "vendor-onboarding · pull/14",       createdAt: "2026-05-18T17:42:00Z" },
  { id: "ae_6", organizationId: "org_acme", actorId: "system",    actorName: "system",           action: "connector.sync.error",    target: "postgres-risk-db · timeout",        createdAt: "2026-05-18T15:02:00Z" },
];

export const alerts: Alert[] = [
  { id: "alrt_1", organizationId: "org_acme", name: "App down · production", trigger: "uptime < 99% · 5min", channel: "pagerduty", target: "ops-oncall",      active: true },
  { id: "alrt_2", organizationId: "org_acme", name: "Connector sync failure", trigger: "sync.failed",         channel: "slack",     target: "#data-ops",       active: true },
  { id: "alrt_3", organizationId: "org_acme", name: "Ticket SLA breach",     trigger: "ticket.sla.breached", channel: "email",     target: "maria@acme.com",   active: true },
  { id: "alrt_4", organizationId: "org_acme", name: "Review queue > 4h",     trigger: "review.queued.4h+",   channel: "slack",     target: "#compliance-reviewers", active: false },
];

// ─── Settings ─────────────────────────────────────────────────────────────

export const apiKeys: ApiKey[] = [
  { id: "key_anthropic", organizationId: "org_acme", provider: "anthropic", label: "Anthropic · production", status: "Active", createdAt: "2025-11-05T10:00:00Z", lastUsedAt: "2026-05-18T18:51:00Z", maskedKey: "sk-ant-...8b21" },
  { id: "key_voyage",    organizationId: "org_acme", provider: "internal",  label: "Voyage embeddings",      status: "Active", createdAt: "2026-01-22T09:00:00Z", lastUsedAt: "2026-05-17T03:00:00Z", maskedKey: "pa-...44ef" },
];

// ─── Utility lookups ───────────────────────────────────────────────────────

export const userById = (id: string) => users.find((u) => u.id === id);
export const applicationById = (id: string) => applications.find((a) => a.id === id);
export const releaseByAppId = (appId: string) => releases.find((r) => r.applicationId === appId);
