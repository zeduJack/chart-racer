import { GenerateForm } from "@/components/editor/GenerateForm";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-sky-400 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">ChartRacer</span>
        </div>
        <nav className="flex gap-6 text-sm text-white/50">
          <a href="/" className="hover:text-white/80 transition">Preview</a>
          <a href="/editor" className="text-white/90 font-medium">Editor</a>
          <a href="/videos" className="hover:text-white/80 transition">Videos</a>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Video generieren
          </h1>
          <p className="text-white/40 text-base">
            Gib ein Thema ein — die KI recherchiert Daten und erstellt automatisch ein
            Bar Chart Race Video.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <GenerateForm />
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoCard
            icon="🔍"
            title="KI-Recherche"
            text="Claude recherchiert automatisch passende Daten mit Web Search"
          />
          <InfoCard
            icon="📊"
            title="Einzigartiger Blickwinkel"
            text="Bei wiederholtem Aufruf wird immer ein neuer Blickwinkel gewählt"
          />
          <InfoCard
            icon="🎬"
            title="Fertiges Video"
            text="Direkt als MP4 im gewählten Format und Seitenverhältnis"
          />
        </div>

        {/* API-Hinweis */}
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
            <div>
              <div className="text-sm font-medium text-amber-200 mb-1">
                ANTHROPIC_API_KEY erforderlich
              </div>
              <div className="text-xs text-white/40">
                Erstelle eine <code className="text-white/60">.env.local</code> Datei mit{" "}
                <code className="text-white/60">ANTHROPIC_API_KEY=sk-...</code> im Projekt-Root.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs text-white/40 leading-relaxed">{text}</div>
    </div>
  );
}
