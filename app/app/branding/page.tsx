"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { orgBranding, applications, userById } from "@/lib/mocks";
import type { BrandColor, BrandVoiceTemplate } from "@/lib/types";

/*
 * Branding — unified org brand applied to every app the team ships.
 *
 * Sections:
 *   01 · Brand identity      (name + logo + tagline)
 *   02 · Color palette       (5 named colors with hex pickers)
 *   03 · Typography          (display / body / mono)
 *   04 · Voice               (3 voice templates, pick one)
 *   05 · Template surfaces   (which surfaces inherit branding — toggleable)
 *   06 · Apply to apps       (scope: all vs selective, per-app override)
 *   07 · Live preview        (Slack reply · Email · Web app · Document) — sticky on the right
 */

type SurfacePreview = "slack" | "email" | "web" | "document";
const SURFACES: { key: SurfacePreview; label: string }[] = [
  { key: "slack",    label: "Slack reply" },
  { key: "email",    label: "Email" },
  { key: "web",      label: "Web app" },
  { key: "document", label: "Document" },
];

function colorByName(colors: BrandColor[], name: BrandColor["name"]) {
  return colors.find((c) => c.name === name)?.hex ?? "#000";
}

export default function BrandingPage() {
  // local edit state — purely visual, doesn't persist
  const [brandName, setBrandName] = useState(orgBranding.brandName);
  const [tagline, setTagline] = useState(orgBranding.tagline);
  const [logoMark, setLogoMark] = useState(orgBranding.logoMark);
  const [colors, setColors] = useState<BrandColor[]>(orgBranding.colors);
  const [voiceId, setVoiceId] = useState(orgBranding.voiceTemplateId);
  const [scope, setScope] = useState<"all-apps" | "selective">(orgBranding.scope);
  const [previewSurface, setPreviewSurface] = useState<SurfacePreview>("slack");
  const [overridden, setOverridden] = useState<string[]>(orgBranding.overriddenAppIds);
  const [activeTemplates, setActiveTemplates] = useState<string[]>(
    orgBranding.templates.filter((t) => t.active).map((t) => t.id)
  );

  const updatedBy = userById(orgBranding.lastUpdatedBy);

  const primary   = colorByName(colors, "primary");
  const secondary = colorByName(colors, "secondary");
  const surface   = colorByName(colors, "surface");
  const ink       = colorByName(colors, "ink");

  const voice = useMemo<BrandVoiceTemplate>(
    () => orgBranding.voiceTemplates.find((v) => v.id === voiceId) ?? orgBranding.voiceTemplates[0],
    [voiceId]
  );

  const inheritedCount = scope === "all-apps"
    ? applications.length - overridden.length
    : 0;
  const overriddenCount = overridden.length;

  function setColor(name: BrandColor["name"], hex: string) {
    setColors((curr) => curr.map((c) => (c.name === name ? { ...c, hex } : c)));
  }

  function toggleOverride(appId: string) {
    setOverridden((curr) =>
      curr.includes(appId) ? curr.filter((id) => id !== appId) : [...curr, appId]
    );
  }

  function toggleTemplate(id: string) {
    setActiveTemplates((curr) =>
      curr.includes(id) ? curr.filter((t) => t !== id) : [...curr, id]
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Branding · unified across apps"
        title="Branding"
        description="One brand, every app. Set your logo, palette, typography, and voice once — every application your team ships inherits them. Override per-app only when you have to."
        actions={
          <>
            <button type="button" className="btn btn-secondary">Discard changes</button>
            <button type="button" className="btn btn-primary">
              Save branding <span className="arr">→</span>
            </button>
          </>
        }
      />

      {/* Status strip */}
      <div className="status-strip">
        <span className="ss-l">
          <span className="ss-dot" />
          <span className="ss-text">
            <b>Live</b> · applied to {inheritedCount} app{inheritedCount === 1 ? "" : "s"}
            {overriddenCount > 0 && <span className="ss-warn"> · {overriddenCount} per-app override{overriddenCount === 1 ? "" : "s"}</span>}
          </span>
        </span>
        <span className="ss-r">
          last updated <b>{updatedBy?.fullName.replace(" · Assembly", "")}</b> · {new Date(orgBranding.lastUpdatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      {/* Two-column body: config (left) + preview (right) */}
      <div className="bgrid">
        <div className="bcol bcol-l">

          {/* 01 · Brand identity */}
          <Card title="01 · Brand identity" subtitle="Used everywhere your apps surface — Slack, email, web, PDFs.">
            <div className="fld">
              <label>Brand name</label>
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="ipt"
                spellCheck={false}
              />
              <small>Appears in every email signature, Slack bot name, and document header.</small>
            </div>
            <div className="fld">
              <label>Tagline</label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="ipt"
                spellCheck={false}
              />
              <small>Optional. Used in document headers and email footers.</small>
            </div>
            <div className="fld">
              <label>Logo mark</label>
              <div className="logo-picker">
                <div
                  className="logo-display"
                  style={{ background: primary, color: surface }}
                >
                  {logoMark}
                </div>
                <div className="logo-actions">
                  <input
                    value={logoMark}
                    maxLength={2}
                    onChange={(e) => setLogoMark(e.target.value.toUpperCase().slice(0, 2))}
                    className="ipt ipt-narrow"
                    spellCheck={false}
                  />
                  <button type="button" className="btn-tiny">+ Upload SVG</button>
                  <button type="button" className="btn-tiny">+ Upload PNG</button>
                </div>
                <small>One- or two-letter monogram for placeholders. Upload a real logo for production surfaces.</small>
              </div>
            </div>
          </Card>

          {/* 02 · Palette */}
          <Card title="02 · Color palette" subtitle="Used across every app: backgrounds, accents, links, badge tones.">
            <div className="palette">
              {colors.map((c) => (
                <label key={c.name} className="swatch">
                  <span className="swatch-label">{c.name}</span>
                  <span
                    className="swatch-chip"
                    style={{ background: c.hex, color: c.name === "surface" ? ink : "#fff" }}
                  >
                    <span className="swatch-hex">{c.hex.toUpperCase()}</span>
                  </span>
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => setColor(c.name, e.target.value)}
                    className="swatch-input"
                    aria-label={`Edit ${c.name} color`}
                  />
                </label>
              ))}
            </div>
            <div className="contrast-row">
              <Pill tone="sage">Contrast · WCAG AA passed</Pill>
              <small>Primary on surface: 7.4:1 · Ink on surface: 14.2:1 · Secondary on surface: 4.6:1</small>
            </div>
          </Card>

          {/* 03 · Typography */}
          <Card title="03 · Typography" subtitle="Fonts inherited from the org. Apps fall back to system fonts in performance-sensitive surfaces.">
            <div className="ty-row">
              <div className="ty-cell">
                <label>Display</label>
                <select className="sel" defaultValue={orgBranding.displayFont}>
                  <option>Söhne</option>
                  <option>Space Grotesk</option>
                  <option>Inter Display</option>
                  <option>Custom (upload .woff2)</option>
                </select>
                <span className="ty-sample" style={{ fontFamily: orgBranding.displayFont }}>{brandName}</span>
              </div>
              <div className="ty-cell">
                <label>Body</label>
                <select className="sel" defaultValue={orgBranding.bodyFont}>
                  <option>Inter</option>
                  <option>SF Pro</option>
                  <option>System</option>
                </select>
                <span className="ty-sample" style={{ fontFamily: orgBranding.bodyFont }}>The quick brown fox jumps over.</span>
              </div>
              <div className="ty-cell">
                <label>Mono</label>
                <select className="sel" defaultValue={orgBranding.monoFont}>
                  <option>JetBrains Mono</option>
                  <option>SF Mono</option>
                  <option>IBM Plex Mono</option>
                </select>
                <span className="ty-sample mono" style={{ fontFamily: orgBranding.monoFont }}>{`>_ acme-band-bot · live`}</span>
              </div>
            </div>
          </Card>

          {/* 04 · Voice */}
          <Card title="04 · Voice" subtitle="Tone every conversational agent uses unless an app overrides.">
            <div className="voice-list">
              {orgBranding.voiceTemplates.map((v) => (
                <label
                  key={v.id}
                  className={"voice-card " + (voiceId === v.id ? "on" : "")}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={v.id}
                    checked={voiceId === v.id}
                    onChange={() => setVoiceId(v.id)}
                    className="voice-input"
                  />
                  <span className="voice-head">
                    <span className="voice-dot" />
                    <span className="voice-name">{v.label}</span>
                  </span>
                  <span className="voice-desc">{v.description}</span>
                  <span className="voice-sample">&ldquo;{v.sample}&rdquo;</span>
                </label>
              ))}
            </div>
          </Card>

          {/* 05 · Templates */}
          <Card title="05 · Template surfaces" subtitle="Surfaces that inherit branding. Toggle to opt a surface out of the unified treatment.">
            <ul className="tpl-list">
              {orgBranding.templates.map((t) => {
                const isActive = activeTemplates.includes(t.id);
                return (
                  <li key={t.id} className={"tpl-row " + (isActive ? "" : "off")}>
                    <span className={"tpl-surface tpl-" + t.surface}>{t.surface}</span>
                    <div className="tpl-text">
                      <b>{t.label}</b>
                      <small>{t.description}</small>
                      <code className="tpl-preview">{t.preview}</code>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      className={"tg " + (isActive ? "on" : "")}
                      onClick={() => toggleTemplate(t.id)}
                      title={isActive ? "Inherits branding · click to opt out" : "Opted out · click to inherit"}
                    >
                      <span className="tg-knob" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* 06 · Apply to apps */}
          <Card
            title="06 · Apply to apps"
            subtitle="Which applications inherit org branding. Per-app override is the escape hatch — use sparingly."
          >
            <div className="scope-pick">
              <label className={"scope-card " + (scope === "all-apps" ? "on" : "")}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "all-apps"}
                  onChange={() => setScope("all-apps")}
                  className="scope-input"
                />
                <span className="scope-name">All apps inherit (recommended)</span>
                <span className="scope-desc">Every app — past, present, and future — gets the org branding. Per-app overrides are still possible below.</span>
              </label>
              <label className={"scope-card " + (scope === "selective" ? "on" : "")}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "selective"}
                  onChange={() => setScope("selective")}
                  className="scope-input"
                />
                <span className="scope-name">Selective</span>
                <span className="scope-desc">Each app opts in. New apps default to unbranded until enabled.</span>
              </label>
            </div>

            <div className="apps-table">
              <header>
                <span>Application</span>
                <span>Status</span>
                <span>Override</span>
              </header>
              {applications.map((a) => {
                const isOverride = overridden.includes(a.id);
                const inherits = scope === "all-apps" && !isOverride;
                return (
                  <div className="apps-row" key={a.id}>
                    <span className="apps-name">
                      <code>{a.slug}</code>
                      <small>{a.description}</small>
                    </span>
                    <span>
                      {inherits
                        ? <Pill tone="sage">Inherits org brand</Pill>
                        : <Pill tone="amber">Custom · per-app</Pill>}
                    </span>
                    <span>
                      <button
                        type="button"
                        className="ov-btn"
                        onClick={() => toggleOverride(a.id)}
                      >
                        {isOverride ? "Restore org brand" : "Override"}
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 07 · Footer text */}
          <Card title="07 · Outbound identity" subtitle="How the org appears outside the platform.">
            <div className="fld">
              <label>Email from-name</label>
              <input className="ipt" defaultValue={orgBranding.emailFromName} />
              <small>e.g. &quot;Acme Mortgage&quot; · outbound emails from any app surface with this sender name.</small>
            </div>
            <div className="fld">
              <label>Slack bot handle</label>
              <input className="ipt" defaultValue={orgBranding.slackBotName} />
              <small>Default handle for any Slack agent built on Assembly.</small>
            </div>
            <div className="fld">
              <label>Document footer</label>
              <textarea className="ipt" rows={2} defaultValue={orgBranding.documentFooter} />
              <small>Appended to every PDF / Word document generated by docgen agents.</small>
            </div>
          </Card>
        </div>

        {/* RIGHT · Live preview (sticky) */}
        <div className="bcol bcol-r">
          <Card padding={0}>
            <div className="preview-head">
              <div className="preview-l">
                <span className="eyebrow"><span className="dot" />Live preview</span>
                <h3 className="preview-title">As your apps will appear</h3>
              </div>
              <div className="preview-tabs" role="tablist">
                {SURFACES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={previewSurface === s.key}
                    className={"prev-tab " + (previewSurface === s.key ? "on" : "")}
                    onClick={() => setPreviewSurface(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-stage">
              {previewSurface === "slack"    && <SlackPreview    primary={primary} secondary={secondary} surface={surface} ink={ink} brandName={brandName} logoMark={logoMark} voice={voice} botName={orgBranding.slackBotName} />}
              {previewSurface === "email"    && <EmailPreview    primary={primary} secondary={secondary} surface={surface} ink={ink} brandName={brandName} tagline={tagline} logoMark={logoMark} voice={voice} fromName={orgBranding.emailFromName} />}
              {previewSurface === "web"      && <WebPreview      primary={primary} secondary={secondary} surface={surface} ink={ink} brandName={brandName} logoMark={logoMark} />}
              {previewSurface === "document" && <DocumentPreview primary={primary} secondary={secondary} surface={surface} ink={ink} brandName={brandName} tagline={tagline} logoMark={logoMark} footer={orgBranding.documentFooter} />}
            </div>

            <footer className="preview-foot">
              <span className="pf-l">
                <b>Inherits</b> from org-wide brand · applies to all apps unless overridden
              </span>
              <Link href="/app/applications" className="pf-link">View per-app overrides →</Link>
            </footer>
          </Card>
        </div>
      </div>

      <style>{`
        .status-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 12px 18px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .ss-l { display: inline-flex; align-items: center; gap: 10px; }
        .ss-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-sage-fg);
          box-shadow: 0 0 0 3px rgba(47, 107, 64, 0.15);
        }
        .ss-text { font-size: 13px; color: var(--color-ink-700); }
        .ss-text b { color: var(--color-ink-950); font-weight: 600; }
        .ss-warn { color: var(--color-amber-fg); }
        .ss-r {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .ss-r b { color: var(--color-ink-700); font-weight: 600; }

        .bgrid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1180px) { .bgrid { grid-template-columns: 1fr; } }
        .bcol { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
        .bcol-r {
          position: sticky;
          top: 80px;
          align-self: start;
        }
        @media (max-width: 1180px) { .bcol-r { position: static; } }

        /* ── Inputs ────────────────────────────────────────── */
        .fld { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .fld:last-child { margin-bottom: 0; }
        .fld label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .fld small { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; }
        .ipt {
          padding: 8px 12px;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          background: #fff;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
          width: 100%;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ipt:focus-visible {
          outline: 0;
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .ipt-narrow { max-width: 80px; text-align: center; font-weight: 700; }
        textarea.ipt { font-family: var(--font-body); resize: vertical; }
        .sel {
          padding: 8px 12px;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          background: #fff;
          color: var(--color-ink-950);
          cursor: pointer;
        }
        .btn-tiny {
          padding: 5px 10px;
          font-size: 11.5px;
          font-weight: 500;
          font-family: var(--font-body);
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-200);
          border-radius: 6px;
          color: var(--color-ink-700);
          cursor: pointer;
          transition: background 0.12s;
        }
        .btn-tiny:hover { background: var(--color-ink-100); }

        /* Logo picker */
        .logo-picker { display: flex; flex-direction: column; gap: 10px; }
        .logo-display {
          width: 72px; height: 72px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 32px;
          letter-spacing: -0.02em;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 8px 22px -10px rgba(15, 17, 42, 0.2);
        }
        .logo-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

        /* Palette */
        .palette {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }
        @media (max-width: 720px) { .palette { grid-template-columns: repeat(2, 1fr); } }
        .swatch { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .swatch-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .swatch-chip {
          height: 64px;
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          padding: 8px 10px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.04);
        }
        .swatch-hex { letter-spacing: 0.04em; }
        .swatch-input {
          position: absolute;
          inset: 22px 0 0 0;
          width: 100%;
          height: 64px;
          opacity: 0;
          cursor: pointer;
        }
        .contrast-row {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed var(--color-ink-100);
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .contrast-row small {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
        }

        /* Typography */
        .ty-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 720px) { .ty-row { grid-template-columns: 1fr; } }
        .ty-cell { display: flex; flex-direction: column; gap: 6px; }
        .ty-cell label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .ty-sample {
          margin-top: 4px;
          padding: 14px 12px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          font-size: 18px;
          color: var(--color-ink-950);
          line-height: 1.2;
        }
        .ty-sample.mono { font-size: 13px; }

        /* Voice */
        .voice-list { display: grid; gap: 8px; }
        .voice-input { position: absolute; opacity: 0; pointer-events: none; }
        .voice-card {
          padding: 14px 16px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .voice-card:hover { border-color: var(--color-ink-300); }
        .voice-card.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
        }
        .voice-head { display: inline-flex; align-items: center; gap: 8px; }
        .voice-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid var(--color-ink-300);
        }
        .voice-card.on .voice-dot {
          background: var(--color-indigo-600);
          border-color: var(--color-indigo-600);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
        }
        .voice-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: -0.005em;
          color: var(--color-ink-950);
        }
        .voice-desc { color: var(--color-ink-500); font-size: 12.5px; line-height: 1.5; }
        .voice-sample {
          font-style: italic;
          color: var(--color-ink-700);
          font-size: 13px;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.02);
          border-left: 2px solid var(--color-ink-200);
          border-radius: 4px;
          margin-top: 2px;
        }

        /* Templates */
        .tpl-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .tpl-row {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          background: #fff;
          transition: opacity 0.15s, background 0.15s;
        }
        .tpl-row.off { opacity: 0.55; background: var(--color-ink-50); }
        .tpl-surface {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
          background: var(--color-indigo-100);
          padding: 4px 8px;
          border-radius: 6px;
          text-align: center;
        }
        .tpl-slack { color: var(--color-sage-fg); background: var(--color-sage-bg); }
        .tpl-email { color: var(--color-indigo-700); background: var(--color-indigo-100); }
        .tpl-sms   { color: var(--color-amber-fg); background: var(--color-amber-bg); }
        .tpl-web   { color: var(--color-ink-700); background: var(--color-ink-100); }
        .tpl-document { color: var(--color-warn-fg); background: var(--color-warn-bg); }
        .tpl-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .tpl-text b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13.5px;
          letter-spacing: -0.005em;
          color: var(--color-ink-950);
        }
        .tpl-text small { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; }
        .tpl-preview {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-700);
          background: var(--color-ink-50);
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 4px;
          display: inline-block;
          width: fit-content;
        }

        /* Toggle */
        .tg {
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: var(--color-ink-200);
          position: relative;
          cursor: pointer;
          transition: background 0.18s;
        }
        .tg.on { background: var(--color-indigo-600); }
        .tg-knob {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          top: 2px;
          left: 2px;
          transition: left 0.18s;
          box-shadow: 0 1px 2px rgba(15, 17, 42, 0.2);
        }
        .tg.on .tg-knob { left: 18px; }

        /* Scope picker */
        .scope-pick {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (max-width: 720px) { .scope-pick { grid-template-columns: 1fr; } }
        .scope-input { position: absolute; opacity: 0; pointer-events: none; }
        .scope-card {
          padding: 12px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .scope-card:hover { border-color: var(--color-ink-300); }
        .scope-card.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
        }
        .scope-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13.5px;
          color: var(--color-ink-950);
        }
        .scope-desc {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }

        /* Apps override table */
        .apps-table {
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          overflow: hidden;
        }
        .apps-table header {
          display: grid;
          grid-template-columns: 1.4fr 1fr 0.6fr;
          gap: 14px;
          padding: 10px 14px;
          background: var(--color-ink-50);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .apps-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr 0.6fr;
          gap: 14px;
          padding: 12px 14px;
          border-top: 1px solid var(--color-ink-100);
          align-items: center;
        }
        .apps-row:first-of-type { border-top: 0; }
        .apps-name { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .apps-name code {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
        }
        .apps-name small {
          font-size: 11.5px;
          color: var(--color-ink-500);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ov-btn {
          padding: 6px 10px;
          font-size: 11.5px;
          font-family: var(--font-body);
          background: transparent;
          border: 1px solid var(--color-ink-200);
          border-radius: 6px;
          color: var(--color-ink-700);
          cursor: pointer;
          transition: border-color 0.12s, background 0.12s;
        }
        .ov-btn:hover { border-color: var(--color-ink-950); background: var(--color-ink-50); }

        /* ── Preview pane ──────────────────────────────────── */
        .preview-head {
          padding: 18px 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 14px;
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .preview-l { display: flex; flex-direction: column; gap: 4px; }
        .preview-title { font-size: 16px; }
        .preview-tabs {
          display: inline-flex;
          gap: 2px;
          background: var(--color-ink-50);
          padding: 3px;
          border-radius: 8px;
        }
        .prev-tab {
          padding: 6px 12px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-ink-500);
          border-radius: 6px;
          cursor: pointer;
        }
        .prev-tab:hover { color: var(--color-ink-950); }
        .prev-tab.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 4px 10px -6px rgba(15, 17, 42, 0.18);
        }

        .preview-stage {
          padding: 28px;
          min-height: 380px;
          background: linear-gradient(180deg, #fafbfd, var(--color-ink-50));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-foot {
          padding: 12px 22px;
          background: var(--color-ink-50);
          border-top: 1px solid var(--color-ink-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--color-ink-500);
          font-family: var(--font-mono);
        }
        .pf-l b { color: var(--color-ink-950); font-weight: 600; }
        .pf-link { color: var(--color-indigo-600); text-decoration: none; }
        .pf-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Preview components — each is a small, branded surface mock.
// ─────────────────────────────────────────────────────────────────────────

interface CommonPreviewProps {
  primary: string;
  secondary: string;
  surface: string;
  ink: string;
  brandName: string;
  logoMark: string;
}

function SlackPreview({ primary, secondary, brandName, logoMark, voice, botName }: CommonPreviewProps & { voice: BrandVoiceTemplate; botName: string }) {
  return (
    <div className="prv-slack">
      <div className="ps-msg">
        <div className="ps-avatar" style={{ background: primary, color: "#fff" }}>
          <span>{logoMark}</span>
        </div>
        <div className="ps-body">
          <div className="ps-head">
            <span className="ps-name" style={{ color: primary }}>{brandName}</span>
            <span className="ps-bot" style={{ background: secondary }}>APP</span>
            <span className="ps-handle">@{botName}</span>
            <span className="ps-time">2:14 PM</span>
          </div>
          <div className="ps-text">{voice.sample}</div>
          <div className="ps-meta">
            <span className="ps-meta-pill" style={{ borderColor: primary, color: primary }}>audit ✓</span>
            <span className="ps-meta-pill">band v3.4</span>
            <span className="ps-meta-pill">policy: pii_redact</span>
          </div>
        </div>
      </div>
      <style>{`
        .prv-slack {
          width: 100%; max-width: 460px;
          background: #fff;
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          padding: 14px 18px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 8px 22px -10px rgba(15, 17, 42, 0.15);
        }
        .ps-msg { display: grid; grid-template-columns: 40px 1fr; gap: 12px; }
        .ps-avatar {
          width: 40px; height: 40px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 18px;
        }
        .ps-head { display: inline-flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .ps-name { font-weight: 700; font-size: 14.5px; }
        .ps-bot {
          font-family: var(--font-mono);
          font-size: 9px;
          padding: 2px 5px;
          border-radius: 2px;
          color: #fff;
          letter-spacing: 0.06em;
          font-weight: 700;
        }
        .ps-handle { font-size: 12px; color: var(--color-ink-500); }
        .ps-time { font-size: 11px; color: var(--color-ink-400); margin-left: auto; }
        .ps-text { margin-top: 4px; font-size: 14px; color: var(--color-ink-950); line-height: 1.45; }
        .ps-meta { margin-top: 8px; display: inline-flex; gap: 6px; flex-wrap: wrap; }
        .ps-meta-pill {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid var(--color-ink-200);
          color: var(--color-ink-500);
        }
      `}</style>
    </div>
  );
}

function EmailPreview({ primary, secondary, surface, brandName, tagline, logoMark, voice, fromName }: CommonPreviewProps & { tagline: string; voice: BrandVoiceTemplate; fromName: string }) {
  return (
    <div className="prv-email">
      <div className="pe-meta">
        <div><b>From:</b> {fromName} &lt;notifications@acme.com&gt;</div>
        <div><b>Subject:</b> Compliance update · Q2 dispute review</div>
      </div>
      <div className="pe-body">
        <header className="pe-header" style={{ background: primary }}>
          <span className="pe-mark" style={{ background: surface, color: primary }}>{logoMark}</span>
          <span className="pe-brand" style={{ color: surface }}>
            <b>{brandName}</b>
            <small>{tagline}</small>
          </span>
        </header>
        <div className="pe-content">
          <h3 style={{ color: primary }}>Your Q2 dispute review is complete</h3>
          <p>{voice.sample}</p>
          <p>You can view the full report in the Acme compliance portal. We&apos;ve attached a PDF for your records.</p>
          <a className="pe-cta" style={{ background: secondary, color: "#fff" }}>View report →</a>
        </div>
        <footer className="pe-footer" style={{ borderTopColor: primary }}>
          <span>Confidential. © 2026 Acme Mortgage. Not for redistribution.</span>
        </footer>
      </div>
      <style>{`
        .prv-email {
          width: 100%; max-width: 460px;
          background: #fff;
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          font-family: var(--font-body);
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 8px 22px -10px rgba(15, 17, 42, 0.15);
        }
        .pe-meta {
          padding: 10px 16px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-size: 11px;
          color: var(--color-ink-500);
          font-family: var(--font-mono);
        }
        .pe-meta b { color: var(--color-ink-700); margin-right: 4px; }
        .pe-meta div { padding: 2px 0; }
        .pe-header {
          padding: 22px 22px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pe-mark {
          width: 44px; height: 44px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 22px;
        }
        .pe-brand { display: flex; flex-direction: column; }
        .pe-brand b { font-size: 17px; font-family: var(--font-display); font-weight: 600; line-height: 1.1; }
        .pe-brand small { font-size: 11px; opacity: 0.78; margin-top: 3px; }
        .pe-content { padding: 22px; }
        .pe-content h3 { font-size: 18px; margin-bottom: 10px; }
        .pe-content p { font-size: 13.5px; color: var(--color-ink-700); line-height: 1.55; margin-bottom: 10px; }
        .pe-cta {
          display: inline-block;
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 6px;
        }
        .pe-footer {
          padding: 14px 22px;
          border-top: 3px solid;
          background: var(--color-ink-50);
          font-size: 10.5px;
          color: var(--color-ink-500);
          font-family: var(--font-mono);
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}

function WebPreview({ primary, secondary, surface, ink, brandName, logoMark }: CommonPreviewProps) {
  return (
    <div className="prv-web">
      <header style={{ background: primary, color: surface }}>
        <span className="pw-mark" style={{ background: surface, color: primary }}>{logoMark}</span>
        <span className="pw-name">{brandName}</span>
        <nav className="pw-nav">
          <span>Dashboard</span>
          <span>Reports</span>
          <span>Settings</span>
        </nav>
        <span className="pw-user" style={{ background: secondary }}>MC</span>
      </header>
      <main className="pw-main" style={{ background: surface, color: ink }}>
        <h3>Q2 compliance summary</h3>
        <p>3 reports completed · 1 awaiting your sign-off · audit lineage 100%</p>
        <div className="pw-stats">
          <div className="pw-stat" style={{ borderColor: primary }}>
            <span className="pw-stat-v" style={{ color: primary }}>3</span>
            <span className="pw-stat-k">completed</span>
          </div>
          <div className="pw-stat" style={{ borderColor: secondary }}>
            <span className="pw-stat-v" style={{ color: secondary }}>1</span>
            <span className="pw-stat-k">awaiting</span>
          </div>
          <div className="pw-stat" style={{ borderColor: primary }}>
            <span className="pw-stat-v" style={{ color: primary }}>100%</span>
            <span className="pw-stat-k">audited</span>
          </div>
        </div>
        <button className="pw-cta" style={{ background: primary, color: surface }}>View report</button>
      </main>
      <style>{`
        .prv-web {
          width: 100%; max-width: 460px;
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 8px 22px -10px rgba(15, 17, 42, 0.15);
          font-family: var(--font-body);
        }
        .prv-web header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
        }
        .pw-mark {
          width: 28px; height: 28px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 14px;
        }
        .pw-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; }
        .pw-nav { display: inline-flex; gap: 14px; font-size: 12px; opacity: 0.78; margin-left: 12px; flex: 1; }
        .pw-user {
          width: 26px; height: 26px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 10.5px;
          color: #fff;
        }
        .pw-main { padding: 22px; }
        .pw-main h3 { font-size: 17px; margin-bottom: 6px; }
        .pw-main p { font-size: 12.5px; color: var(--color-ink-700); margin-bottom: 14px; }
        .pw-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
        .pw-stat {
          padding: 10px;
          border: 1px solid;
          border-radius: 6px;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pw-stat-v { font-family: var(--font-display); font-weight: 600; font-size: 18px; letter-spacing: -0.015em; }
        .pw-stat-k {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pw-cta {
          padding: 8px 14px;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function DocumentPreview({ primary, secondary, surface, ink, brandName, tagline, logoMark, footer }: CommonPreviewProps & { tagline: string; footer: string }) {
  return (
    <div className="prv-doc">
      <header style={{ borderBottomColor: primary }}>
        <div className="pd-l">
          <span className="pd-mark" style={{ background: primary, color: surface }}>{logoMark}</span>
          <div className="pd-name">
            <b style={{ color: primary }}>{brandName}</b>
            <small>{tagline}</small>
          </div>
        </div>
        <div className="pd-meta">
          <div>CMP Report · Q2 2026</div>
          <div>Confidential · audit_id: a3f7c2e</div>
        </div>
      </header>
      <main>
        <h3 style={{ color: ink }}>Regulation E Quarterly Compliance Report</h3>
        <p>This report summarizes the findings of the Q2 2026 Reg E quarterly run for Acme Mortgage. 5,855 disputes were sampled across eleven CFPB rule-pack controls. 7 findings were dispositioned by named reviewers.</p>
        <table className="pd-table">
          <thead>
            <tr style={{ background: primary, color: surface }}>
              <th>Control</th>
              <th>Sampled</th>
              <th>Findings</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>§1005.11 · disputes</td><td>5,855</td><td style={{ color: primary }}>7</td></tr>
            <tr><td>§1005.7 · disclosures</td><td>5,855</td><td>0</td></tr>
            <tr><td>§1005.15 · government benefit</td><td>312</td><td>0</td></tr>
          </tbody>
        </table>
      </main>
      <footer style={{ borderTopColor: primary, color: ink }}>
        {footer}
      </footer>
      <style>{`
        .prv-doc {
          width: 100%; max-width: 460px;
          background: #fff;
          border: 1px solid var(--color-ink-100);
          border-radius: 4px;
          padding: 24px;
          font-family: var(--font-body);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 8px 22px -10px rgba(15, 17, 42, 0.15);
        }
        .prv-doc header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 3px solid;
          margin-bottom: 18px;
          gap: 14px;
        }
        .pd-l { display: inline-flex; align-items: center; gap: 12px; }
        .pd-mark {
          width: 38px; height: 38px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 19px;
        }
        .pd-name { display: flex; flex-direction: column; }
        .pd-name b { font-family: var(--font-display); font-weight: 600; font-size: 15px; }
        .pd-name small { font-size: 10.5px; color: var(--color-ink-500); }
        .pd-meta {
          text-align: right;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
        }
        .pd-meta div + div { margin-top: 2px; }
        .prv-doc h3 { font-size: 15px; margin-bottom: 8px; }
        .prv-doc p { font-size: 12px; color: var(--color-ink-700); line-height: 1.55; margin-bottom: 14px; }
        .pd-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          font-size: 11.5px;
        }
        .pd-table th {
          text-align: left;
          padding: 6px 10px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pd-table td {
          padding: 8px 10px;
          border-top: 1px solid var(--color-ink-100);
        }
        .pd-table tbody tr:first-child td { border-top: 0; }
        .prv-doc footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}
