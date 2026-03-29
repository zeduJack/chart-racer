import type { Metadata } from "next";
import { listVideos, listTopics } from "@/lib/topic-manager";

export const dynamic = "force-dynamic"; // Immer aktuell laden

export const metadata: Metadata = {
  title: "Video-Galerie",
  description: "Alle generierten Bar Chart Race Videos — Status, Format und Render-Details auf einen Blick.",
  openGraph: {
    title: "Video-Galerie · ChartRacer",
    description: "Alle generierten Bar Chart Race Videos — Status, Format und Render-Details.",
  },
  twitter: {
    title: "Video-Galerie · ChartRacer",
    description: "Alle generierten Bar Chart Race Videos — Status, Format und Render-Details.",
  },
};

export default async function VideosPage() {
  let videos: Awaited<ReturnType<typeof listVideos>> = [];
  let topics: Awaited<ReturnType<typeof listTopics>> = [];

  try {
    [videos, topics] = await Promise.all([listVideos(), listTopics()]);
  } catch {
    // DB noch nicht initialisiert oder leer
  }

  const doneVideos = videos.filter((v) => v.status === "done");
  const failedVideos = videos.filter((v) => v.status === "failed");
  const totalAngles = topics.reduce((sum, t) => sum + (t.angles as unknown[]).length, 0);

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
          <a href="/editor" className="hover:text-white/80 transition">Editor</a>
          <a href="/videos" className="text-white/90 font-medium">Videos</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Video-Galerie</h1>
            <p className="text-white/40">Alle generierten Bar Chart Race Videos</p>
          </div>
          <a
            href="/editor"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white text-sm font-medium hover:opacity-90 transition"
          >
            + Neues Video
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard label="Videos total" value={String(videos.length)} />
          <StatCard label="Erfolgreich" value={String(doneVideos.length)} color="green" />
          <StatCard label="Themen" value={String(topics.length)} />
          <StatCard label="Blickwinkel" value={String(totalAngles)} />
        </div>

        {/* Video-Liste */}
        {videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
              Alle Videos
            </h2>
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}

        {/* Themen-Übersicht */}
        {topics.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
              Themen & Blickwinkel
            </h2>
            <div className="space-y-3">
              {topics.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color === "green" ? "text-green-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: Awaited<ReturnType<typeof listVideos>>[0] }) {
  const angle = video.angle as { angle?: string; topic?: { name?: string } };
  const topicName = angle?.topic?.name ?? "Unbekannt";
  const angleName = angle?.angle ?? "–";

  const statusIcon = {
    done: "✅",
    failed: "❌",
    rendering: "⏳",
    pending: "⏸",
  }[video.status] ?? "❓";

  const statusColor = {
    done: "text-green-300",
    failed: "text-red-300",
    rendering: "text-amber-300",
    pending: "text-white/40",
  }[video.status] ?? "text-white/40";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 flex items-start gap-4">
      <div className="text-xl flex-shrink-0 mt-0.5">{statusIcon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white truncate">{angleName}</span>
          <span className={`text-xs ${statusColor}`}>{video.status}</span>
        </div>
        <div className="text-xs text-white/40 mb-2">
          Thema: <span className="text-white/60">{topicName}</span>
          {" · "}
          Format: <span className="text-white/60">{video.format}</span>
          {" · "}
          {video.resolution}
        </div>
        {video.outputPath && (
          <div className="text-xs text-white/30 font-mono truncate">{video.outputPath}</div>
        )}
        {video.errorMessage && video.errorMessage !== "dry-run" && (
          <div className="text-xs text-red-300/70 mt-1 truncate">{video.errorMessage}</div>
        )}
      </div>

      <div className="text-xs text-white/30 flex-shrink-0 text-right">
        <div>#{video.id}</div>
        <div className="mt-1">{video.createdAt?.slice(0, 10)}</div>
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: Awaited<ReturnType<typeof listTopics>>[0] }) {
  const angles = topic.angles as { angle: string; id: number }[];
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-white capitalize">{topic.name}</span>
        <span className="text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded">
          {angles.length} Blickwinkel
        </span>
      </div>
      <div className="space-y-1">
        {angles.map((a) => (
          <div key={a.id} className="text-xs text-white/40 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
            {a.angle}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-16 text-center">
      <div className="text-4xl mb-4">🎬</div>
      <div className="text-white/60 font-medium mb-2">Noch keine Videos</div>
      <div className="text-white/30 text-sm mb-6">
        Generiere dein erstes Bar Chart Race Video im Editor
      </div>
      <a
        href="/editor"
        className="inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white text-sm font-medium hover:opacity-90 transition"
      >
        Zum Editor
      </a>
    </div>
  );
}
