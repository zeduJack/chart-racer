"use client";

import type { ChartStyle } from "@/remotion/types";

interface ConfigPanelProps {
  style: ChartStyle;
  onChange: (style: ChartStyle) => void;
}

const PALETTES = [
  { id: "tech-neon", label: "Tech Neon", colors: ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6"] },
  { id: "corporate", label: "Corporate", colors: ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed"] },
  { id: "pastel", label: "Pastel", colors: ["#93c5fd", "#86efac", "#fca5a5", "#fcd34d", "#c4b5fd"] },
  { id: "mono", label: "Monochrome", colors: ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b", "#334155"] },
];

export function ConfigPanel({ style, onChange }: ConfigPanelProps) {
  function update(partial: Partial<ChartStyle>) {
    onChange({ ...style, ...partial });
  }

  return (
    <div className="space-y-5">
      {/* Sichtbare Balken */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
          Sichtbare Balken: <span className="text-white">{style.visibleBars}</span>
        </label>
        <div className="flex gap-2">
          {[5, 8, 10, 12, 15].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ visibleBars: n })}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                style.visibleBars === n
                  ? "bg-sky-500 text-white"
                  : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Animations-Geschwindigkeit */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
          Geschwindigkeit pro Schritt: <span className="text-white">{style.durationPerStep} Frames</span>
          <span className="text-white/30 ml-2">({(style.durationPerStep / 30).toFixed(1)}s)</span>
        </label>
        <input
          type="range"
          min={15}
          max={120}
          step={5}
          value={style.durationPerStep}
          onChange={(e) => update({ durationPerStep: parseInt(e.target.value) })}
          className="w-full accent-sky-500"
        />
        <div className="flex justify-between text-xs text-white/25 mt-1">
          <span>Schnell (0.5s)</span>
          <span>Langsam (4s)</span>
        </div>
      </div>

      {/* Balkenhöhe */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
          Balkenhöhe: <span className="text-white">{style.barHeight}px</span>
        </label>
        <input
          type="range"
          min={30}
          max={80}
          step={5}
          value={style.barHeight}
          onChange={(e) => update({ barHeight: parseInt(e.target.value) })}
          className="w-full accent-sky-500"
        />
      </div>

      {/* Abstand zwischen Balken */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
          Balken-Abstand: <span className="text-white">{style.barGap}px</span>
        </label>
        <input
          type="range"
          min={4}
          max={24}
          step={2}
          value={style.barGap}
          onChange={(e) => update({ barGap: parseInt(e.target.value) })}
          className="w-full accent-sky-500"
        />
      </div>

      {/* Farbpaletten-Vorschau */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
          Farbpaletten
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 flex items-center gap-2 cursor-default"
            >
              <div className="flex gap-1">
                {p.colors.map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs text-white/50">{p.label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-white/25 mt-1">
          Farben werden pro Teilnehmer aus den Daten übernommen
        </div>
      </div>

      {/* Zusammenfassung */}
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] px-4 py-3 text-xs text-white/40 space-y-1">
        <div className="text-white/60 font-medium mb-1">Aktuelle Konfiguration</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Balken:</span><span className="text-white/70">{style.visibleBars}</span>
          <span>Schritt-Dauer:</span><span className="text-white/70">{(style.durationPerStep / 30).toFixed(1)}s</span>
          <span>Balkenhöhe:</span><span className="text-white/70">{style.barHeight}px</span>
          <span>Balken-Abstand:</span><span className="text-white/70">{style.barGap}px</span>
        </div>
      </div>
    </div>
  );
}
