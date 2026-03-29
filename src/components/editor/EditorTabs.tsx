"use client";

import { useState } from "react";
import { GenerateForm } from "./GenerateForm";
import { UploadForm } from "./UploadForm";
import type { ResearchResult } from "@/lib/ai-researcher";

type Tab = "ai" | "upload";

export function EditorTabs() {
  const [tab, setTab] = useState<Tab>("ai");
  const [uploadedData, setUploadedData] = useState<ResearchResult | null>(null);

  function handleDataParsed(data: ResearchResult) {
    setUploadedData(data);
    // Hier könnte später der Remotion Player aktualisiert werden
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
        <TabButton active={tab === "ai"} onClick={() => setTab("ai")}>
          🤖 KI-Recherche
        </TabButton>
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
          📂 Eigene Daten
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        {tab === "ai" && (
          <>
            <div className="mb-5">
              <h2 className="text-base font-semibold mb-1">KI-Datenrecherche</h2>
              <p className="text-sm text-white/40">
                Gib ein Thema ein — Claude recherchiert automatisch passende Daten und erstellt ein Video.
              </p>
            </div>
            <GenerateForm />
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 flex-shrink-0">⚠️</span>
                <div className="text-xs text-white/40">
                  <span className="text-amber-200 font-medium">ANTHROPIC_API_KEY</span> erforderlich —
                  erstelle <code className="text-white/60">.env.local</code> mit{" "}
                  <code className="text-white/60">ANTHROPIC_API_KEY=sk-...</code>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "upload" && (
          <>
            <div className="mb-5">
              <h2 className="text-base font-semibold mb-1">Eigene Daten hochladen</h2>
              <p className="text-sm text-white/40">
                CSV oder JSON mit deinen eigenen Zeitreihendaten für das Bar Chart Race.
              </p>
            </div>
            <UploadForm onDataParsed={handleDataParsed} />

            {uploadedData && (
              <div className="mt-5 pt-5 border-t border-white/[0.06]">
                <div className="text-xs text-white/40 mb-3">Daten geladen — Video-Optionen:</div>
                <RenderWithDataForm data={uploadedData} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Info-Cards */}
      {tab === "ai" && (
        <div className="grid grid-cols-3 gap-3">
          <InfoCard icon="🔍" title="KI-Recherche" text="Claude sucht automatisch passende Daten via Web Search" />
          <InfoCard icon="📊" title="Neuer Blickwinkel" text="Beim nächsten Aufruf wird ein anderer Blickwinkel gewählt" />
          <InfoCard icon="🎬" title="Fertiges MP4" text="Direkt im gewählten Format exportiert" />
        </div>
      )}

      {tab === "upload" && (
        <div className="grid grid-cols-3 gap-3">
          <InfoCard icon="📊" title="CSV-Format" text="name,color,Jahr1,Jahr2 — eine Zeile pro Teilnehmer" />
          <InfoCard icon="🔧" title="JSON-Format" text="{ title, timeLabels, participants: [{name, color, values}] }" />
          <InfoCard icon="✏️" title="Editierbar" text="Titel und Untertitel nach dem Upload anpassen" />
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/40 hover:text-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function InfoCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs text-white/40 leading-relaxed">{text}</div>
    </div>
  );
}

function RenderWithDataForm({ data }: { data: ResearchResult }) {
  const [format, setFormat] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ videoId?: number; outputPath?: string; error?: string } | null>(null);

  async function handleRender() {
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: data.title, format, data }),
      });
      const json = await res.json();

      if (!res.ok) {
        setResult({ error: json.error });
        setStatus("error");
        return;
      }

      setResult(json);
      setStatus("done");
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Fehler" });
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <span className="text-xs text-white/50">Format:</span>
        {(["16:9", "9:16", "1:1"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              format === f ? "bg-sky-500 text-white" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleRender}
        disabled={status === "loading"}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Rendert…
          </span>
        ) : "Video rendern"}
      </button>

      {status === "error" && result?.error && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
          {result.error}
        </div>
      )}
      {status === "done" && result?.outputPath && (
        <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded px-3 py-2">
          ✅ Fertig: <code>{result.outputPath}</code>
        </div>
      )}
    </div>
  );
}
