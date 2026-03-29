"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResearchResult } from "@/lib/ai-researcher";

interface SavedDataset {
  id: number;
  name: string;
  dataJson: string;
  createdAt: string;
}

interface SavedDatasetsProps {
  onLoad: (data: ResearchResult) => void;
  refreshTrigger?: number;
}

export function SavedDatasets({ onLoad, refreshTrigger }: SavedDatasetsProps) {
  const [datasets, setDatasets] = useState<SavedDataset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/datasets");
      const data = await res.json();
      // API liefert snake_case, wir mappen auf camelCase
      setDatasets(
        data.map((d: { id: number; name: string; data_json: string; created_at: string }) => ({
          id: d.id,
          name: d.name,
          dataJson: d.data_json,
          createdAt: d.created_at,
        }))
      );
    } catch {
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets, refreshTrigger]);

  async function handleDelete(id: number) {
    await fetch(`/api/datasets?id=${id}`, { method: "DELETE" });
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  }

  function handleLoad(dataset: SavedDataset) {
    const data: ResearchResult = JSON.parse(dataset.dataJson);
    onLoad(data);
  }

  function handleDownloadJson(dataset: SavedDataset) {
    const blob = new Blob([JSON.stringify(JSON.parse(dataset.dataJson), null, 2)], {
      type: "application/json",
    });
    triggerDownload(blob, `${dataset.name}.json`);
  }

  function handleDownloadCsv(dataset: SavedDataset) {
    const data: ResearchResult = JSON.parse(dataset.dataJson);
    const headers = ["name", "color", ...data.timeLabels];
    const rows = data.participants.map((p) => [p.name, p.color, ...p.values.map(String)]);
    const csv = [headers, ...rows].map((row) => row.map(quoteCsvField).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    triggerDownload(blob, `${dataset.name}.csv`);
  }

  if (loading) {
    return (
      <div className="text-sm text-white/30 py-6 text-center">Lade gespeicherte Datensätze…</div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-8 text-center">
        <div className="text-2xl mb-2">📂</div>
        <div className="text-sm text-white/40">Noch keine Datensätze gespeichert</div>
        <div className="text-xs text-white/25 mt-1">
          Lade Daten hoch und klicke &quot;Speichern&quot;
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {datasets.map((dataset) => {
        let data: ResearchResult | null = null;
        try {
          data = JSON.parse(dataset.dataJson);
        } catch {
          // ignorieren
        }

        return (
          <div
            key={dataset.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-sm text-white truncate">{dataset.name}</div>
                {data && (
                  <div className="text-xs text-white/40 mt-0.5">
                    {data.participants.length} Teilnehmer &middot; {data.timeLabels[0]}–{data.timeLabels[data.timeLabels.length - 1]}
                  </div>
                )}
                <div className="text-xs text-white/25 mt-0.5">
                  {new Date(dataset.createdAt).toLocaleString("de-CH")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(dataset.id)}
                className="text-white/20 hover:text-red-400 transition text-lg leading-none flex-shrink-0"
                title="Löschen"
              >
                ×
              </button>
            </div>

            {data && (
              <div className="flex flex-wrap gap-1.5">
                {data.participants.slice(0, 6).map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-1 text-xs text-white/50 bg-white/[0.04] rounded px-2 py-0.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                ))}
                {data.participants.length > 6 && (
                  <div className="text-xs text-white/30 px-2 py-0.5">
                    +{data.participants.length - 6} weitere
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleLoad(dataset)}
                className="flex-1 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
              >
                In Preview laden
              </button>
              <button
                type="button"
                onClick={() => handleDownloadCsv(dataset)}
                className="px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white text-xs transition"
                title="Als CSV herunterladen"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => handleDownloadJson(dataset)}
                className="px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white text-xs transition"
                title="Als JSON herunterladen"
              >
                JSON
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function quoteCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
