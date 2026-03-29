import type { Metadata } from "next";
import { EditorTabs } from "@/components/editor/EditorTabs";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Erstelle Bar Chart Race Videos mit KI-Datenrecherche oder lade eigene CSV/JSON-Daten hoch.",
  openGraph: {
    title: "Video Editor · ChartRacer",
    description:
      "Erstelle Bar Chart Race Videos mit KI-Datenrecherche oder eigenen Daten.",
  },
  twitter: {
    title: "Video Editor · ChartRacer",
    description:
      "Erstelle Bar Chart Race Videos mit KI-Datenrecherche oder eigenen Daten.",
  },
};

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Editor</h1>
          <p className="text-white/40 text-base">
            Generiere ein Video mit KI-Recherche oder lade eigene Daten hoch.
          </p>
        </div>

        <EditorTabs />
      </main>
    </div>
  );
}
