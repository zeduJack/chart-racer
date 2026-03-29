"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResearchResult } from "@/lib/ai-researcher";

interface SavedResearch {
  id: number;
  topic: string;
  title: string;
  angle: string;
  researchDataJson: string;
  createdAt: string;
}

interface Props {
  onLoad: (data: ResearchResult) => void;
}

export function ResearchHistory({ onLoad }: Props) {
  const [items, setItems] = useState<SavedResearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/research");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler");
      setItems(json.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ladefehler");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/research?id=${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  function handleLoad(item: SavedResearch) {
    try {
      const data = JSON.parse(item.researchDataJson) as ResearchResult;
      onLoad(data);
    } catch {
      setError("Daten konnten nicht geladen werden");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/30 text-sm">
        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mr-2" />
        Lade gespeicherte Recherchen…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-white/40 text-sm">Noch keine Recherchen gespeichert.</div>
        <div className="text-white/25 text-xs mt-1">Starte eine KI-Recherche — sie wird hier automatisch gespeichert.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/40">{items.length} gespeicherte Recherche{items.length !== 1 ? "n" : ""}</span>
        <button onClick={fetchItems} className="text-xs text-white/30 hover:text-white/60 transition">Aktualisieren</button>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Prompt / Topic */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/30 uppercase tracking-widest">Thema</span>
                <span className="text-xs text-sky-400 font-medium truncate">{item.topic}</span>
              </div>
              {/* Generierter Titel */}
              <div className="text-sm font-semibold text-white leading-snug mb-1">{item.title}</div>
              {/* Blickwinkel */}
              <div className="text-xs text-white/40 leading-relaxed line-clamp-2">{item.angle}</div>
            </div>

            {/* Timestamp */}
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-white/25">{formatDate(item.createdAt)}</div>
              <div className="text-xs text-white/20">{formatTime(item.createdAt)}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.05]">
            <button
              onClick={() => handleLoad(item)}
              className="flex-1 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-medium transition"
            >
              In Preview laden
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-white/30 hover:text-red-300 text-xs transition disabled:opacity-40"
            >
              {deletingId === item.id ? "…" : "Löschen"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso.includes("Z") ? iso : iso + "Z");
  return d.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso.includes("Z") ? iso : iso + "Z");
  return d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
}
