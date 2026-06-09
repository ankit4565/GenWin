import { useState } from "react";

// ── Inline style injections for fonts + custom animations ──────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Hanken+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

    * { box-sizing: border-box; }

    body { margin: 0; background: #f7fbf2; }

    .font-hanken { font-family: 'Hanken Grotesk', sans-serif; }
    .font-inter  { font-family: 'Inter', sans-serif; }
    .font-mono   { font-family: 'JetBrains Mono', monospace; }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      user-select: none;
    }
    .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    .anim-slide-up   { animation: slideUp      0.6s cubic-bezier(.34,1.56,.64,1) forwards; }
    .anim-slide-right{ animation: slideInRight 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }

    .btn-shimmer {
      background: linear-gradient(90deg,#1b5e20 0%,#2e7d32 40%,#1b5e20 60%,#1b5e20 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite linear;
    }

    .glass-card {
      background: rgba(255,255,255,0.70);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.30);
    }
    .glass-card-hover {
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1),
                  box-shadow 0.4s cubic-bezier(.34,1.56,.64,1);
    }
    .glass-card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -10px rgba(0,0,0,.10);
    }

    input:focus, select:focus {
      outline: none;
      border-color: #00450d !important;
      box-shadow: 0 0 0 2px rgba(0,69,13,.15);
    }

    @media (prefers-reduced-motion: reduce) {
      .anim-slide-up, .anim-slide-right, .btn-shimmer { animation: none !important; opacity: 1 !important; }
      .glass-card-hover:hover { transform: none !important; }
    }
  `}</style>
);

// ── Token helpers ──────────────────────────────────────────────────────────
const C = {
  primary:        "#00450d",
  primaryCont:    "#1b5e20",
  onPrimary:      "#ffffff",
  primaryFixed:   "#acf4a4",
  secondary:      "#4b6547",
  secCont:        "#cae8c2",
  onSecCont:      "#4f694b",
  tertiary:       "#003c68",
  terCont:        "#00548e",
  onTerCont:      "#9ac8ff",
  surface:        "#f7fbf2",
  surfContLow:    "#f2f5ec",
  surfContHigh:   "#e6e9e1",
  surfVariant:    "#e0e4db",
  surfCont:       "#ecefe6",
  onSurface:      "#191d18",
  onSurfVar:      "#41493e",
  outlineVar:     "#c0c9bb",
  outline:        "#717a6d",
  error:          "#ba1a1a",
  errCont:        "rgba(255,218,214,0.22)",
  errBorder:      "rgba(186,26,26,0.22)",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function Icon({ name, className = "", style = {}, filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "icon-filled" : ""} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function Label({ children }) {
  return (
    <span
      className="font-mono"
      style={{ fontSize: 12, letterSpacing: "0.05em", fontWeight: 500, color: C.onSurfVar }}
    >
      {children}
    </span>
  );
}

function MetaCard({ label, value, delay }) {
  return (
    <div
      className="anim-slide-up rounded-xl p-4 border transition-all hover:shadow-sm"
      style={{
        background: C.surfContLow,
        borderColor: "rgba(192,201,187,0.30)",
        animationDelay: delay,
        opacity: 0,
      }}
    >
      <Label>{label}</Label>
      <p
        className="font-hanken mt-1"
        style={{ fontSize: 20, fontWeight: 700, color: C.primary }}
      >
        {value}
      </p>
    </div>
  );
}

function FieldGroup({ label, children, colSpan = 1 }) {
  return (
    <div style={{ gridColumn: `span ${colSpan}` }} className="flex flex-col gap-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="font-inter rounded-lg px-4 py-3 w-full"
      style={{
        background: C.surfContLow,
        border: `1px solid ${C.outlineVar}`,
        fontSize: 16,
        color: C.onSurface,
        transition: "border-color .2s, box-shadow .2s",
      }}
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        width: 44,
        height: 24,
        background: checked ? C.primary : C.surfVariant,
        border: "none",
        cursor: "pointer",
        focusRingColor: C.primary,
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow transition-transform duration-300"
        style={{
          top: 2,
          left: 2,
          width: 20,
          height: 20,
          transform: checked ? "translateX(20px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [fullName, setFullName]   = useState("Rajesh Kumar");
  const [phone, setPhone]         = useState("+91 98765-43210");
  const [notifs, setNotifs]       = useState(true);
  const [language, setLanguage]   = useState("en");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved, setSaved]         = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="font-inter min-h-screen flex flex-col" style={{ background: C.surface, color: C.onSurface }}>
      <GlobalStyles />

      {/* ── Top App Bar ── */}
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "rgba(247,251,242,0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid rgba(192,201,187,0.25)`,
          boxShadow: "0 1px 8px rgba(0,69,13,.06)",
        }}
      >
        <nav
          className="flex items-center justify-between h-16 mx-auto"
          style={{ padding: "0 64px", maxWidth: 1440 }}
        >
          {/* Left: logo + nav */}
          <div className="flex items-center gap-8">
            <span
              className="font-hanken cursor-pointer select-none hover:opacity-80 transition-opacity"
              style={{ fontSize: 26, fontWeight: 700, color: C.primary, letterSpacing: "-0.02em" }}
            >
              Bhopal Twin
            </span>
            <div className="hidden md:flex items-center gap-6">
              {["City Map", "Alerts", "Projects"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-hanken transition-colors hover:text-green-800"
                  style={{ fontSize: 16, fontWeight: 500, color: C.onSurfVar, textDecoration: "none" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Right: search + icons + avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative items-center">
              <input
                className="font-inter rounded-full pl-4 pr-10 py-2"
                style={{
                  background: C.surfContLow,
                  border: "none",
                  fontSize: 14,
                  width: 240,
                  color: C.onSurface,
                }}
                placeholder="Search twin data…"
              />
              <Icon
                name="search"
                className="absolute right-3"
                style={{ fontSize: 20, color: C.onSurfVar }}
              />
            </div>

            {[{ icon: "notifications" }, { icon: "settings", bordered: true }].map(({ icon, bordered }) => (
              <button
                key={icon}
                className="flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:scale-95"
                style={{
                  width: 40,
                  height: 40,
                  background: "transparent",
                  border: bordered ? `2px solid ${C.primary}` : "none",
                  cursor: "pointer",
                }}
              >
                <Icon name={icon} style={{ color: C.primary }} />
              </button>
            ))}

            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-full font-hanken font-bold select-none cursor-pointer hover:scale-105 transition-transform"
              style={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg,#2e7d32,#1b5e20)`,
                border: `2px solid ${C.primaryFixed}`,
                color: C.primaryFixed,
                fontSize: 14,
              }}
            >
              RK
            </div>
          </div>
        </nav>
      </header>

      {/* ── Main ── */}
      <main
        className="flex-grow mx-auto w-full"
        style={{ paddingTop: 96, paddingBottom: 40, paddingLeft: 64, paddingRight: 64, maxWidth: 1440 }}
      >

        {/* Profile Header */}
        <section
          className="anim-slide-up mb-6"
          style={{ animationDelay: "0.05s", opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-6">
              <div className="relative group" style={{ width: 112, height: 112 }}>
                <div
                  className="glass-card glass-card-hover rounded-xl overflow-hidden border-2 flex items-center justify-center font-hanken font-bold select-none"
                  style={{
                    width: 112,
                    height: 112,
                    borderColor: C.primaryFixed,
                    background: `linear-gradient(135deg,#2e7d32,#558b2f,#1b5e20)`,
                    color: C.primaryFixed,
                    fontSize: 32,
                    boxShadow: "0 4px 16px rgba(0,69,13,.12)",
                    cursor: "default",
                  }}
                >
                  RK
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                    style={{ background: "rgba(0,0,0,.40)" }}
                  >
                    <Icon name="upload" style={{ color: "#fff", fontSize: 28 }} />
                  </div>
                </div>
              </div>

              <div>
                <h1
                  className="font-hanken"
                  style={{ fontSize: 32, fontWeight: 700, color: C.primary, lineHeight: "40px", margin: 0 }}
                >
                  Rajesh Kumar
                </h1>
                <p
                  className="font-inter flex items-center gap-2 mt-1"
                  style={{ fontSize: 16, color: C.onSurfVar, margin: 0 }}
                >
                  rajesh.k@bhopal-citizen.in
                  <Icon name="verified" filled style={{ fontSize: 16, color: C.primary }} />
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span
                    className="font-mono px-3 py-1 rounded-full hover:scale-105 transition-transform cursor-default"
                    style={{
                      background: C.secCont,
                      color: C.onSecCont,
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      fontWeight: 500,
                    }}
                  >
                    CITIZEN_V2
                  </span>
                  <span
                    className="font-mono px-3 py-1 rounded-full hover:scale-105 transition-transform cursor-default"
                    style={{
                      background: C.terCont,
                      color: C.onTerCont,
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      fontWeight: 500,
                    }}
                  >
                    Bhopal South
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                className="font-hanken rounded-lg px-6 py-2 transition-all active:scale-95 hover:bg-gray-200"
                style={{
                  background: C.surfContHigh,
                  color: C.onSurface,
                  fontSize: 18,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="btn-shimmer font-hanken rounded-lg px-6 py-2 flex items-center gap-2 transition-all active:scale-95 shadow-md"
                style={{
                  color: C.onPrimary,
                  fontSize: 18,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Icon name="save" style={{ fontSize: 20, color: "#fff" }} />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto" }}>

          {/* ─── LEFT COLUMN (col 1–2) ─── */}
          <div className="flex flex-col gap-6" style={{ gridColumn: "1 / 3" }}>

            {/* Personal Information */}
            <div
              className="glass-card glass-card-hover anim-slide-up rounded-xl p-6 shadow-sm border-t-4"
              style={{ borderTopColor: C.primary, animationDelay: "0.15s", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Icon name="person" style={{ color: C.primary }} />
                <h2
                  className="font-hanken"
                  style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, margin: 0 }}
                >
                  Personal Information
                </h2>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <FieldGroup label="FULL NAME">
                  <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FieldGroup>
                <FieldGroup label="PHONE NUMBER">
                  <TextInput type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FieldGroup>
                <FieldGroup label="REGISTERED RESIDENCE" colSpan={2}>
                  <div
                    className="font-inter flex items-center justify-between px-4 py-3 rounded-lg border transition-colors cursor-default hover:border-green-700"
                    style={{
                      background: C.surfContLow,
                      border: `1px solid rgba(192,201,187,0.35)`,
                      fontSize: 16,
                      color: C.onSurface,
                    }}
                  >
                    <span>Sector 12, Arera Colony, Bhopal — 462016</span>
                    <Icon
                      name="map"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      style={{ color: C.primary }}
                    />
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* Account Metadata row */}
            <div className="grid grid-cols-3 gap-3">
              <MetaCard label="ACCOUNT ROLE"  value="Citizen"               delay="0.25s" />
              <MetaCard label="MEMBER SINCE"  value="Oct 14, 2023"          delay="0.30s" />
              <MetaCard label="DEPARTMENT"    value="Public Works (Liaison)" delay="0.35s" />
            </div>

            {/* Activity Log */}
            <div
              className="glass-card glass-card-hover anim-slide-up rounded-xl p-6 shadow-sm border-t-4"
              style={{ borderTopColor: C.tertiary, animationDelay: "0.40s", opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Icon name="history" style={{ color: C.tertiary }} />
                  <h2
                    className="font-hanken"
                    style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, margin: 0 }}
                  >
                    Activity Log
                  </h2>
                </div>
                <button
                  className="font-mono hover:underline"
                  style={{ fontSize: 12, letterSpacing: "0.05em", fontWeight: 500, color: C.tertiary, background: "none", border: "none", cursor: "pointer" }}
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: "report_problem",
                    iconColor: C.secondary,
                    title: "Street Light Repair",
                    sub: "Grievance #8821 – Resolved",
                    time: "2 days ago",
                    delay: "0.50s",
                  },
                  {
                    icon: "edit_calendar",
                    iconColor: C.tertiary,
                    title: "Profile Updated",
                    sub: "Security details modified",
                    time: "1 week ago",
                    delay: "0.60s",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="anim-slide-right flex items-center justify-between px-4 py-3 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.40)",
                      animationDelay: item.delay,
                      opacity: 0,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} style={{ color: item.iconColor }} />
                      <div>
                        <p
                          className="font-inter"
                          style={{ fontSize: 16, fontWeight: 600, color: C.onSurface, margin: 0 }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="font-inter"
                          style={{ fontSize: 14, color: C.onSurfVar, margin: 0 }}
                        >
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <span
                      className="font-mono whitespace-nowrap"
                      style={{ fontSize: 12, letterSpacing: "0.05em", color: C.onSurfVar }}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (col 3) ─── */}
          <div className="flex flex-col gap-6" style={{ gridColumn: "3 / 4" }}>

            {/* Preferences */}
            <div
              className="glass-card glass-card-hover anim-slide-up rounded-xl p-6 shadow-sm"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Icon name="tune" style={{ color: C.primary }} />
                <h2
                  className="font-hanken"
                  style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, margin: 0 }}
                >
                  Preferences
                </h2>
              </div>

              <div className="flex flex-col gap-5">
                {/* Language */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-inter" style={{ fontSize: 16, fontWeight: 600, color: C.onSurface, margin: 0 }}>
                      System Language
                    </p>
                    <p className="font-inter" style={{ fontSize: 14, color: C.onSurfVar, margin: 0 }}>
                      Select UI language
                    </p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="font-inter rounded-lg py-1 pl-3 pr-2 transition-all"
                    style={{
                      background: C.surfContLow,
                      border: `1px solid ${C.outlineVar}`,
                      fontSize: 14,
                      color: C.onSurface,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <option value="en">English (EN)</option>
                    <option value="hi">Hindi (HI)</option>
                  </select>
                </div>

                <hr style={{ borderColor: "rgba(192,201,187,0.30)", margin: 0 }} />

                {/* Push notifications */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-inter" style={{ fontSize: 16, fontWeight: 600, color: C.onSurface, margin: 0 }}>
                      Push Notifications
                    </p>
                    <p className="font-inter" style={{ fontSize: 14, color: C.onSurfVar, margin: 0 }}>
                      Instant alerts &amp; updates
                    </p>
                  </div>
                  <Toggle checked={notifs} onChange={setNotifs} />
                </div>
              </div>
            </div>

            {/* Security */}
            <div
              className="glass-card glass-card-hover anim-slide-up rounded-xl p-6 shadow-sm border-t-4"
              style={{ borderTopColor: C.secondary, animationDelay: "0.35s", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Icon name="security" style={{ color: C.secondary }} />
                <h2
                  className="font-hanken"
                  style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, margin: 0 }}
                >
                  Security
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                <FieldGroup label="CURRENT PASSWORD">
                  <TextInput type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
                </FieldGroup>
                <FieldGroup label="NEW PASSWORD">
                  <TextInput type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" />
                </FieldGroup>
                <FieldGroup label="CONFIRM NEW PASSWORD">
                  <TextInput type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" />
                </FieldGroup>
                <button
                  className="font-hanken w-full mt-1 py-2 rounded-lg shadow-md transition-all active:scale-95"
                  style={{
                    background: C.secondary,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.secCont;
                    e.currentTarget.style.color = C.onSecCont;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.secondary;
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Update Security
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className="anim-slide-up rounded-xl p-6 border transition-colors"
              style={{
                background: C.errCont,
                border: `1px solid ${C.errBorder}`,
                animationDelay: "0.45s",
                opacity: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,218,214,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.errCont)}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon name="warning" style={{ color: C.error }} />
                <h2
                  className="font-hanken"
                  style={{ fontSize: 20, fontWeight: 700, color: C.error, margin: 0 }}
                >
                  Danger Zone
                </h2>
              </div>
              <p
                className="font-inter mb-5"
                style={{ fontSize: 14, color: C.onSurfVar, lineHeight: "20px" }}
              >
                Deactivating your account will permanently remove your grievance history and resident benefits.
              </p>
              <button
                className="font-hanken w-full py-2 rounded-lg transition-all active:scale-95"
                style={{
                  background: "transparent",
                  border: `2px solid ${C.error}`,
                  color: C.error,
                  fontSize: 18,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.error;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.error;
                }}
              >
                Deactivate Account
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full mt-auto border-t"
        style={{
          background: C.surfCont,
          borderColor: "rgba(192,201,187,0.15)",
          padding: "24px 64px",
        }}
      >
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 mx-auto"
          style={{ maxWidth: 1440 }}
        >
          <div>
            <p className="font-hanken" style={{ fontSize: 18, fontWeight: 700, color: C.onSurface, margin: 0 }}>
              Bhopal Twin
            </p>
            <p className="font-inter" style={{ fontSize: 14, color: C.onSurfVar, margin: 0 }}>
              © 2024 Bhopal Smart City Development Corporation Limited. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Help Desk", "Contact Us"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-inter underline transition-colors hover:text-green-800"
                style={{ fontSize: 14, color: C.onSurfVar, textDecoration: "underline" }}
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <Icon
              name="language"
              className="cursor-pointer hover:scale-110 transition-all"
              style={{ color: C.onSurfVar }}
            />
            <Icon
              name="share"
              className="cursor-pointer hover:scale-110 transition-all"
              style={{ color: C.onSurfVar }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}