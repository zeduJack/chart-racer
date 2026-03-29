"use client";

import { useState, useRef, useCallback } from "react";
import { parseAuto } from "@/lib/csv-parser";
import type { ResearchResult } from "@/lib/ai-researcher";

interface UploadFormProps {
  onDataParsed: (data: ResearchResult) => void;
}

const EXAMPLE_CSV = `name,color,2020,2021,2022,2023,2024
Apple,#6b7280,274,366,394,383,391
Microsoft,#0078d4,143,168,198,212,245
Alphabet,#4285f4,183,258,283,307,350
Amazon,#ff9900,386,470,514,575,638
NVIDIA,#76b900,11,17,27,44,130`;

export function UploadForm({ onDataParsed }: UploadFormProps) {
  const [text, setText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [parsed, setParsed] = useState<ResearchResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleParse(input: string) {
    setError(null);
    setWarnings([]);
    setParsed(null);

    if (!input.trim()) return;

    const result = parseAuto(input);
    if (!result.success) {
      setError(result.error || "Parse-Fehler");
      return;
    }

    setWarnings(result.warnings || []);
    setParsed(result.data!);
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    handleParse(e.target.value);
  }

  async function handleFile(file: File) {
    const content = await file.text();
    setText(content);
    handleParse(content);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  function loadExample() {
    setText(EXAMPLE_CSV);
    handleParse(EXAMPLE_CSV);
  }

  function handleUse() {
    if (parsed) onDataParsed(parsed);
  }

  return (
    <div className="space-y-4">
      {/* Drop-Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition p-6 text-center ${
          dragOver
            ? "border-sky-400 bg-sky-500/10"
            : "border-white/[0.12] hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="text-2xl mb-2">📂</div>
        <div className="text-sm text-white/60">
          CSV oder JSON Datei hier ablegen
        </div>
        <div className="text-xs text-white/30 mt-1">oder klicken zum Auswählen</div>
      </div>

      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/50 uppercase tracking-widest">
            Oder Text einfügen (CSV / JSON)
          </label>
          <button
            type="button"
            onClick={loadExample}
            className="text-xs text-sky-400 hover:text-sky-300 transition"
          >
            Beispiel laden
          </button>
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          rows={8}
          placeholder={"name,color,2020,2021,2022\nApple,#6b7280,274,366,394\nMicrosoft,#0078d4,143,168,198"}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white/80 placeholder-white/20 font-mono text-xs focus:outline-none focus:border-sky-500/40 resize-y"
        />
      </div>

      {/* Format-Hinweis */}
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] px-4 py-3 text-xs text-white/40 space-y-1">
        <div className="text-white/60 font-medium mb-1">Unterstützte Formate</div>
        <div>
          <span className="text-white/60">CSV:</span>{" "}
          <code className="text-sky-300/70">name,color,2020,2021,2022</code> (Header + Datenzeilen)
        </div>
        <div>
          <span className="text-white/60">JSON:</span>{" "}
          <code className="text-sky-300/70">{"{ title, timeLabels, participants: [{name, color, values}] }"}</code>
        </div>
      </div>

      {/* Fehler */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Warnungen */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3 text-xs text-amber-200 space-y-1">
          {warnings.map((w, i) => (
            <div key={i}>⚠️ {w}</div>
          ))}
        </div>
      )}

      {/* Vorschau */}
      {parsed && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-green-300">Daten erkannt</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-white/40 mb-0.5">Titel</div>
              <input
                value={parsed.title}
                onChange={(e) => setParsed({ ...parsed, title: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-sky-500/40"
              />
            </div>
            <div>
              <div className="text-xs text-white/40 mb-0.5">Untertitel</div>
              <input
                value={parsed.subtitle}
                onChange={(e) => setParsed({ ...parsed, subtitle: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-sky-500/40"
              />
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-xs text-white/40">Teilnehmer</div>
              <div className="text-white">{parsed.participants.length}</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Zeitraum</div>
              <div className="text-white">
                {parsed.timeLabels[0]} – {parsed.timeLabels[parsed.timeLabels.length - 1]}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/40">Zeitpunkte</div>
              <div className="text-white">{parsed.timeLabels.length}</div>
            </div>
          </div>

          {/* Teilnehmer-Liste */}
          <div className="flex flex-wrap gap-2">
            {parsed.participants.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/[0.04] rounded px-2 py-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUse}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm hover:opacity-90 transition"
          >
            Diese Daten verwenden →
          </button>
        </div>
      )}
    </div>
  );
}
