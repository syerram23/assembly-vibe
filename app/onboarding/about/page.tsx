import Link from "next/link";

export default function OnboardingAbout() {
  return (
    <div className="onb-shell">
      <header className="onb-head">
        <span className="onb-eyebrow"><span className="dot" /> Onboarding · step 1 of 4</span>
        <div className="onb-dots">
          <span className="onb-dot on" />
          <span className="onb-dot" />
          <span className="onb-dot" />
          <span className="onb-dot" />
        </div>
        <h1 className="onb-title">Tell us about your company</h1>
        <p className="onb-sub">
          We use this to provision your environment and pre-populate sensible defaults. You can change everything later.
        </p>
      </header>

      <section className="onb-body">
        <label className="onb-field">
          <span>Company name</span>
          <input type="text" placeholder="e.g. Acme Mortgage" defaultValue="" />
        </label>

        <label className="onb-field">
          <span>Industry</span>
          <select defaultValue="">
            <option value="" disabled>Select your industry…</option>
            <option>Regulated banking</option>
            <option>Insurance</option>
            <option>Healthcare</option>
            <option>Logistics & supply chain</option>
            <option>Manufacturing</option>
            <option>Professional services</option>
            <option>Retail</option>
            <option>Other</option>
          </select>
        </label>

        <label className="onb-field">
          <span>Team size</span>
          <select defaultValue="">
            <option value="" disabled>Select team size…</option>
            <option>Just me</option>
            <option>2 – 10</option>
            <option>11 – 50</option>
            <option>51 – 200</option>
            <option>201 – 1,000</option>
            <option>1,000+</option>
          </select>
        </label>

        <label className="onb-field" style={{ marginBottom: 0 }}>
          <span>What outcome are you hoping to drive?</span>
          <input type="text" placeholder="One sentence — e.g. cut FNOL intake time by 50%" defaultValue="" />
        </label>
      </section>

      <footer className="onb-foot">
        <Link href="/signup" className="onb-back">← Back to sign-up</Link>
        <Link href="/onboarding/path" className="btn btn-primary">Continue <span className="arr">→</span></Link>
      </footer>
    </div>
  );
}
