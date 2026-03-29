import { Suspense } from "react";
import { RemotionPlayer } from "@/components/preview/RemotionPlayer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-sky-400 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">ChartRacer</span>
        </div>
        <nav className="flex gap-6 text-sm text-white/50">
          <a href="/" className="text-white/90 font-medium">Preview</a>
          <a href="/editor" className="hover:text-white/80 transition">Editor</a>
          <a href="/videos" className="hover:text-white/80 transition">Videos</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Bar Chart Race Videos
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Automatisch generierte, animierte Balkendiagramm-Videos für YouTube,
            Instagram Reels und TikTok — mit KI-Datenrecherche.
          </p>
        </div>

        {/* Player */}
        <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black shadow-2xl mb-10">
          <Suspense
            fallback={
              <div className="aspect-video flex items-center justify-center bg-[#0d1117] text-white/30 text-sm">
                Lade Player…
              </div>
            }
          >
            <RemotionPlayer />
          </Suspense>
        </div>

        {/* Stats + Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard label="Animationstyp" value="Bar Chart Race" />
          <StatCard label="Zeitraum" value="2015 – 2025" />
          <StatCard label="Auflösung" value="1920 × 1080 · 30fps" />
        </div>

        {/* Render-Hinweis */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
            Video rendern
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <RenderCmd label="16:9 (YouTube)" cmd="npm run render" />
            <RenderCmd label="9:16 (Reels/TikTok)" cmd="npm run render:reels" />
            <RenderCmd label="1:1 (Instagram)" cmd="npm run render:square" />
          </div>
          <p className="mt-4 text-xs text-white/30">
            Output: <code className="text-white/50">out/BarChartRace-[timestamp].mp4</code>
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function RenderCmd({ label, cmd }: { label: string; cmd: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-white/40 w-36 flex-shrink-0">{label}</span>
      <code className="text-sky-400 bg-white/[0.04] px-3 py-1 rounded-md">{cmd}</code>
    </div>
  );
}
