"use client";

import { TEMPLATES } from "@/lib/templates";
import type { ChartStyle } from "@/remotion/types";

interface TemplateSelectorProps {
  currentTemplateId?: string;
  onSelect: (style: ChartStyle) => void;
}

export function TemplateSelector({ currentTemplateId, onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <label className="block text-xs text-white/50 uppercase tracking-widest mb-3">
        Template wählen
      </label>
      <div className="grid grid-cols-1 gap-2">
        {TEMPLATES.map((t) => {
          const isActive = t.id === currentTemplateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect({ ...t.style, templateId: t.id })}
              className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                isActive
                  ? "border-sky-500/60 bg-sky-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      {isActive && (
                        <span className="text-xs bg-sky-500 text-white px-1.5 py-0.5 rounded font-medium">
                          aktiv
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{t.description}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-white/30 flex-shrink-0 ml-3">
                  <span>{t.style.visibleBars} Balken</span>
                  <span>{(t.style.durationPerStep / 30).toFixed(1)}s/Schritt</span>
                </div>
              </div>
              {/* Farbpalette */}
              <div className="flex gap-1 mt-2 pl-9">
                {t.palette.slice(0, 8).map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
