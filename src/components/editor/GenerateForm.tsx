"use client";

import { useState } from "react";
import type { ResearchResult } from "@/lib/ai-researcher";

type Status = "idle" | "researching" | "rendering" | "done" | "error";

interface GenerateResult {
  videoId: number;
  status: string;
  outputPath?: string;
  data?: ResearchResult;
  error?: string;
}

export function GenerateForm() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [dryRun, setDryRun] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus("researching");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, format, dryRun }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unbekannter Fehler");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Netzwerkfehler");
      setStatus("error");
    }
  }

  const isLoading = status === "researching" || status === "rendering";

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
            Thema
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="z.B. Tech-Aktien, Fußball WM, Bevölkerung Europa …"
            disabled={isLoading}
            className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-sky-500/60 focus:bg-white/[0.06] transition disabled:opacity-40"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
              Format
            </label>
            <div className="flex gap-2">
              {(["16:9", "9:16", "1:1"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    format === f
                      ? "bg-sky-500 text-white"
                      : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08]"
                  } disabled:opacity-40`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded accent-sky-500"
              />
              <span className="text-sm text-white/60">Dry-Run (nur Daten, kein Video)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {status === "researching" ? "KI recherchiert…" : "Video wird gerendert…"}
            </span>
          ) : (
            "Video generieren"
          )}
        </button>
      </form>

      {/* Error */}
      {status === "error" && error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span className="font-semibold">Fehler:</span> {error}
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
        <ResultCard result={result} dryRun={dryRun} />
      )}
    </div>
  );
}

function ResultCard({ result, dryRun }: { result: GenerateResult; dryRun: boolean }) {
  const data = result.data;

  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-sm font-semibold text-green-300">
          {dryRun ? "Daten recherchiert" : "Video fertig!"}
        </span>
        <span className="ml-auto text-xs text-white/30">Job #{result.videoId}</span>
      </div>

      {data && (
        <div className="space-y-2">
          <div>
            <div className="text-xs text-white/40 mb-0.5">Titel</div>
            <div className="text-white font-medium">{data.title}</div>
          </div>
          <div>
            <div className="text-xs text-white/40 mb-0.5">Blickwinkel</div>
            <div className="text-white/70 text-sm">{data.angle}</div>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-xs text-white/40 mb-0.5">Teilnehmer</div>
              <div className="text-white text-sm">{data.participants.length}</div>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-0.5">Zeitraum</div>
              <div className="text-white text-sm">
                {data.timeLabels[0]} – {data.timeLabels[data.timeLabels.length - 1]}
              </div>
            </div>
          </div>

          {/* Teilnehmer-Dots */}
          <div className="flex flex-wrap gap-2 pt-1">
            {data.participants.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs text-white/60">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
              </div>
            ))}
          </div>

          {/* Social Media */}
          {data.socialMedia && (
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="text-xs text-white/40 mb-1">Social Media</div>
              <div className="text-sm text-white/70 italic">&ldquo;{data.socialMedia.title}&rdquo;</div>
              <div className="text-xs text-sky-400 mt-1">
                {data.socialMedia.hashtags.join(" ")}
              </div>
            </div>
          )}
        </div>
      )}

      {result.outputPath && (
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="text-xs text-white/40 mb-1">Output</div>
          <code className="text-xs text-green-300 break-all">{result.outputPath}</code>
        </div>
      )}
    </div>
  );
}
