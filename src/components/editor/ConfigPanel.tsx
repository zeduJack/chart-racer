"use client";

import type { ChartStyle } from "@/remotion/types";
import { TemplateSelector } from "./TemplateSelector";

interface ConfigPanelProps {
  style: ChartStyle;
  onChange: (style: ChartStyle) => void;
}

export function ConfigPanel({ style, onChange }: ConfigPanelProps) {
  function update(partial: Partial<ChartStyle>) {
    onChange({ ...style, ...partial });
  }

  return (
    <div className="space-y-6">
      {/* Template-Auswahl */}
      <TemplateSelector
        currentTemplateId={style.templateId}
        onSelect={onChange}
      />

      <div className="border-t border-white/[0.06]" />

      {/* Feineinstellungen */}
      <div>
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-3">
          Feineinstellungen
        </label>
        <div className="space-y-5">
          {/* Sichtbare Balken */}
          <div>
            <label className="block text-xs text-white/40 mb-2">
              Sichtbare Balken: <span className="text-white">{style.visibleBars}</span>
            </label>
            <div className="flex gap-2">
              {[5, 8, 10, 12, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ visibleBars: n, templateId: undefined })}
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
            <label className="block text-xs text-white/40 mb-2">
              Geschwindigkeit: <span className="text-white">{(style.durationPerStep / 30).toFixed(1)}s/Schritt</span>
            </label>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={style.durationPerStep}
              onChange={(e) => update({ durationPerStep: parseInt(e.target.value), templateId: undefined })}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-xs text-white/25 mt-1">
              <span>Schnell (0.5s)</span>
              <span>Langsam (4s)</span>
            </div>
          </div>

          {/* Balkenhöhe */}
          <div>
            <label className="block text-xs text-white/40 mb-2">
              Balkenhöhe: <span className="text-white">{style.barHeight}px</span>
            </label>
            <input
              type="range"
              min={30}
              max={80}
              step={5}
              value={style.barHeight}
              onChange={(e) => update({ barHeight: parseInt(e.target.value), templateId: undefined })}
              className="w-full accent-sky-500"
            />
          </div>

          {/* Abstand zwischen Balken */}
          <div>
            <label className="block text-xs text-white/40 mb-2">
              Balken-Abstand: <span className="text-white">{style.barGap}px</span>
            </label>
            <input
              type="range"
              min={4}
              max={24}
              step={2}
              value={style.barGap}
              onChange={(e) => update({ barGap: parseInt(e.target.value), templateId: undefined })}
              className="w-full accent-sky-500"
            />
          </div>
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
          {style.templateId && (
            <>
              <span>Template:</span><span className="text-white/70">{style.templateId}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
