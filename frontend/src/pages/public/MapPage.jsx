import { useState, useEffect } from "react";
import NavBar from "../../components/organisms/NavBar"
import CityMap from "../../features/map/CityMap";
const MAP_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuA3ilfyg33TSMjeNBNi3NUxMHVrB7Fh_irNOCcEse-e3uzA4WkMaJMR8LTOqN7dHYovvS-BSspwUxhF-QqneobPHsWcfiGlzkmaAsZBeRYw8UlOGJu4_JQtVCB7OPXHD0MOxBx5tz8N1bpOSxtcBRYO-TFJCBLntBBFDgnRYbwwy79CDkRLrhW1Awros7NPccu74gfgCQoTJIzju6ihzwISvSWsVH1XyOmMZf65-np1ys1MEkCnFgvY5ikFiFFmA-9zCT7ktcr2EgU";
const WARD_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuB8N0FuCx5ejpHkLPd3wGcW1JDgCb46DxIOtXri5H_fEXH58rSpqxQIO39uD25kS_em4-qtDzdSutITX0XgaUAiw1NwBldv548fsimxqKrmomAQJZ5iNydPSfawetmvtJwf3gsvybhZEyfSazVrdiBfsNNvnOX4MtlRF8UppUqYGJGEl8JDnVnfNnprvgCaZAGbzV3Crgx0d7MrjSLrM75dZXHVDYuPQg9guc45XLGb9pJ03aA_R19MOA-Ph7MyNTTNQOn2akzo4Qg";

const layers = [
  { id: "traffic", label: "Traffic Density", icon: "traffic", checked: true },
  { id: "flood", label: "Flood Risk", icon: "flood", checked: true, highlight: true },
  { id: "drainage", label: "Drainage Network", icon: "water_damage", checked: false },
  { id: "infra", label: "Infrastructure Assets", icon: "factory", checked: false },
  { id: "pollution", label: "Pollution Heatmap", icon: "air", checked: false },
];



function MaterialIcon({ name, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontFamily: "'Material Symbols Outlined'", fontWeight: 400 }}
    >
      {name}
    </span>
  );
}



function LayerToggle({ layer, onToggle }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        borderRadius: 8,
        cursor: "pointer",
        background: layer.highlight && layer.checked ? "rgba(0,69,13,0.08)" : "transparent",
        border: layer.highlight && layer.checked ? "1px solid rgba(0,69,13,0.18)" : "1px solid transparent",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <MaterialIcon
          name={layer.icon}
          style={{
            fontSize: 18,
            color: layer.checked ? "#00450d" : "#717a6d",
            transition: "color 0.2s",
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            color: layer.checked && layer.highlight ? "#00450d" : "#071e27",
            fontWeight: layer.highlight && layer.checked ? 600 : 400,
          }}
        >
          {layer.label}
        </span>
      </div>
      <input
        type="checkbox"
        checked={layer.checked}
        onChange={onToggle}
        style={{ width: 18, height: 18, accentColor: "#00450d", cursor: "pointer" }}
      />
    </label>
  );
}

function LeftPanel({ layerState, setLayerState, liveData }) {
  const toggle = (id) =>
    setLayerState((prev) => prev.map((l) => (l.id === id ? { ...l, checked: !l.checked } : l)));

  return (
    <aside
      style={{
        position: "absolute",
        left: 24,
        top: 24,
        bottom: 24,
        width: 272,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "auto",
      }}
    >
      {/* Layer panel */}
      <div
        style={{
          background: "rgba(243,250,255,0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(192,201,187,0.35)",
          borderRadius: 16,
          padding: "16px 14px",
          boxShadow: "0 4px 24px rgba(0,69,13,0.07)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(192,201,187,0.3)",
            paddingBottom: 10,
          }}
        >
          <MaterialIcon name="layers" style={{ color: "#00450d", fontSize: 20 }} />
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "#00450d", margin: 0 }}>
            Map Layers
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {layerState.map((layer) => (
            <LayerToggle key={layer.id} layer={layer} onToggle={() => toggle(layer.id)} />
          ))}
        </div>

        <button
          style={{
            marginTop: 4,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "#00629e",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 0",
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MaterialIcon name="3d_rotation" style={{ fontSize: 17 }} />
          3D View Toggle
        </button>
      </div>

      {/* Live status card */}
      <div
        style={{
          marginTop: "auto",
          background: "rgba(243,250,255,0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(192,201,187,0.35)",
          borderRadius: 16,
          padding: "14px 14px",
          boxShadow: "0 4px 24px rgba(0,69,13,0.07)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#717a6d", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
              Bhopal Live Status
            </p>
            <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "#00450d", margin: "2px 0 0" }}>
              Active Alerts
            </h3>
          </div>
          <span
            style={{
              background: "rgba(186,26,26,0.08)",
              color: "#ba1a1a",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              animation: "livePulse 1.6s ease-in-out infinite",
            }}
          >
            LIVE
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Congestion", value: liveData.congestion, danger: true },
            { label: "Flood Risk", value: liveData.flood, danger: false },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(243,250,255,0.9)",
                border: "1px solid rgba(192,201,187,0.3)",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <p style={{ fontSize: 10, color: "#717a6d", fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{s.label}</p>
              <p
                style={{
                  fontSize: 16,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  color: s.danger ? "#ba1a1a" : "#00450d",
                  margin: "3px 0 0",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function RightControls() {
  return (
    <div
      style={{
        position: "absolute",
        right: 24,
        top: 24,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {/* Jump to ward search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(243,250,255,0.78)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(192,201,187,0.35)",
          borderRadius: 999,
          padding: "4px 4px 4px 14px",
          gap: 8,
          boxShadow: "0 2px 12px rgba(0,69,13,0.06)",
        }}
      >
        <MaterialIcon name="search" style={{ fontSize: 18, color: "#717a6d" }} />
        <input
          placeholder="Jump to Ward…"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            color: "#071e27",
            width: 170,
          }}
        />
        <button
          style={{
            background: "#00450d",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MaterialIcon name="my_location" style={{ fontSize: 19 }} />
        </button>
      </div>

      {/* Zoom controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {["add", "remove"].map((icon) => (
          <button
            key={icon}
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(243,250,255,0.78)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(192,201,187,0.3)",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,69,13,0.05)",
              color: "#41493e",
              transition: "background 0.15s",
            }}
          >
            <MaterialIcon name={icon} style={{ fontSize: 20 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function WardMarker() {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        position: "absolute",
        top: "34%",
        left: "51%",
        transform: "translate(-50%,-50%)",
        zIndex: 10,
      }}
    >
      <div
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            background: "#00450d",
            color: "#fff",
            width: 40,
            height: 40,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 8px rgba(0,69,13,0.14)",
            transform: hover ? "scale(1.12)" : "scale(1)",
            transition: "transform 0.18s",
          }}
        >
          <MaterialIcon name="water_drop" style={{ fontSize: 20 }} />
        </div>
        {hover && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 180,
              padding: "10px 12px",
              background: "rgba(243,250,255,0.96)",
              border: "1px solid rgba(192,201,187,0.4)",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,69,13,0.12)",
              whiteSpace: "nowrap",
            }}
          >
            <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#00450d", margin: 0 }}>
              Ward 23 Station
            </p>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#717a6d", margin: "3px 0 0" }}>
              Flow: 1.2k L/sec
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#00450d", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "#00450d", fontFamily: "'Inter', sans-serif" }}>Normal Ops</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WardPopup({ onClose }) {
  const metrics = [
    { icon: "group", color: "#00450d", label: "Pop: 45,210" },
    { icon: "speed", color: "#00629e", label: "Traffic: 78%" },
    { icon: "eco", color: "#2a6b2c", label: "AQI: 64 (Good)" },
    { icon: "warning", color: "#ba1a1a", label: "Grievances: 12" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        width: "min(560px, calc(100% - 48px))",
      }}
    >
      <div
        style={{
          background: "rgba(243,250,255,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "2px solid rgba(0,69,13,0.14)",
          borderRadius: 20,
          padding: 20,
          display: "flex",
          gap: 20,
          boxShadow: "0 16px 48px rgba(0,69,13,0.13)",
          animation: "popupIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          style={{
            width: 130,
            minHeight: 130,
            borderRadius: 12,
            overflow: "hidden",
            background: "#dbf1fe",
            flexShrink: 0,
          }}
        >
          <img src={WARD_IMG} alt="Ward dashboard" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <h2
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#00450d",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Arera Colony
              </h2>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#717a6d", letterSpacing: "0.06em", margin: "3px 0 0" }}>
                WARD ZONE 45 | AREA: 12.4 km²
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#717a6d",
                padding: 4,
                borderRadius: 6,
                display: "flex",
              }}
            >
              <MaterialIcon name="close" style={{ fontSize: 20 }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {metrics.map((m) => (
              <div key={m.icon} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <MaterialIcon name={m.icon} style={{ fontSize: 16, color: m.color }} />
                <span style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#41493e" }}>{m.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1,
                background: "#00450d",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 0",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              View Full Metrics
            </button>
            <button
              style={{
                background: "transparent",
                color: "#00450d",
                border: "1px solid #00450d",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Manage Ward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [layerState, setLayerState] = useState(layers);
  const [showPopup, setShowPopup] = useState(true);
  const [liveData] = useState({ congestion: "High", flood: "Low" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; font-family: 'Material Symbols Outlined' !important; }
        @keyframes livePulse { 0%,100% { opacity:1 } 50% { opacity:0.45 } }
        @keyframes popupIn { from { opacity:0; transform:translateX(-50%) translateY(16px) scale(0.97) } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1) } }
        * { box-sizing: border-box; }
        input::placeholder { color: #717a6d; }
      `}</style> */}

      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", background: "#f3faff", overflow: "hidden" }}>
        <NavBar />

        <main style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          {/* Interactive City Map (replaces static background image) */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <CityMap />
          </div>

          {/* SVG zone overlays */}
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.32, pointerEvents: "none" }}
          >
            <path d="M100 100 L400 150 L350 400 L120 380 Z" fill="rgba(0,69,13,0.4)" stroke="#00450d" strokeWidth="2" />
            <path d="M420 160 L700 200 L650 450 L410 420 Z" fill="rgba(0,98,158,0.4)" stroke="#00629e" strokeWidth="2" />
          </svg>

          {/* Ward marker */}
          <WardMarker />

          {/* Left panel */}
          <LeftPanel layerState={layerState} setLayerState={setLayerState} liveData={liveData} />

          {/* Right controls */}
          <RightControls />

          {/* Ward popup */}
          {showPopup && <WardPopup onClose={() => setShowPopup(false)} />}

          {/* Footer */}
          <footer
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              pointerEvents: "none",
              background: "linear-gradient(to top, rgba(207,230,242,0.75), transparent)",
              padding: "12px 64px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: "#41493e", margin: 0, pointerEvents: "auto" }}>
              © 2026 Bhopal Smart City | Digital Twin Live Feed
            </p>
            <div style={{ display: "flex", gap: 20, pointerEvents: "auto" }}>
              {["Privacy Policy", "Support Portal"].map((link) => (
                <a key={link} href="#" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#41493e", textDecoration: "none", letterSpacing: "0.04em" }}>
                  {link}
                </a>
              ))}
              <a href="#" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#ba1a1a", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                Emergency Contacts
              </a>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}