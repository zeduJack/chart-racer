#!/usr/bin/env node
/**
 * ChartRacer CLI
 * Usage:
 *   npx ts-node src/cli/index.ts render [--format 16:9] [--resolution 1080p] [--fps 30]
 *   npx ts-node src/cli/index.ts still [--frame 0]
 *   npx ts-node src/cli/index.ts generate --topic "Aktien" [--dry-run]
 *   npx ts-node src/cli/index.ts research --topic "Aktien"
 *   npx ts-node src/cli/index.ts list
 */

import { renderVideo } from "../lib/render";
import type { OutputFormat, Resolution } from "../lib/render";
import { researchTopic } from "../lib/ai-researcher";
import { getPreviousAngles, saveAngle, createVideoJob, updateVideoStatus, listVideos, listTopics } from "../lib/topic-manager";

const args = process.argv.slice(2);
const command = args[0];

function getArg(flag: string, fallback: string): string {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

async function main() {
  switch (command) {
    case "render": {
      const format = getArg("--format", "16:9") as OutputFormat;
      const resolution = getArg("--resolution", "1080p") as Resolution;
      const fps = parseInt(getArg("--fps", "30"), 10) as 30 | 60;
      const output = getArg("--output", "");

      const outputPath = await renderVideo({
        format,
        resolution,
        fps,
        outputPath: output || undefined,
      });

      console.log(`\n✅ Video gerendert: ${outputPath}`);
      break;
    }

    case "still": {
      const frame = getArg("--frame", "0");
      const { execSync } = await import("child_process");
      const path = await import("path");
      const outPath = path.join(process.cwd(), "out", "stills", `frame-${frame}.png`);
      const cmd = `npx remotion still src/remotion/index.ts BarChartRace ${outPath} --frame=${frame}`;
      execSync(cmd, { stdio: "inherit" });
      console.log(`\n✅ Still gerendert: ${outPath}`);
      break;
    }

    case "generate": {
      const topic = getArg("--topic", "");
      if (!topic) {
        console.error("❌ --topic ist erforderlich. Beispiel: generate --topic \"Tech-Aktien\"");
        process.exit(1);
      }

      const dryRun = hasFlag("--dry-run");
      const format = getArg("--format", "16:9") as OutputFormat;
      const resolution = getArg("--resolution", "1080p") as Resolution;
      const fps = parseInt(getArg("--fps", "30"), 10) as 30 | 60;

      // 1. Bisherige Blickwinkel laden
      console.log(`\n📚 Lade Themen-History für: "${topic}" ...`);
      const previousAngles = await getPreviousAngles(topic);
      if (previousAngles.length > 0) {
        console.log(`   ${previousAngles.length} bisherige Blickwinkel gefunden`);
      }

      // 2. AI-Recherche
      console.log(`\n🔍 AI recherchiert Daten ...`);
      const result = await researchTopic(topic, previousAngles);
      console.log(`   ✅ Blickwinkel: ${result.angle}`);
      console.log(`   Titel: ${result.title}`);
      console.log(`   Teilnehmer: ${result.participants.length}`);
      console.log(`   Zeitraum: ${result.timeLabels[0]} – ${result.timeLabels[result.timeLabels.length - 1]}`);

      // 3. In DB speichern
      const angleId = await saveAngle(topic, result);
      const videoId = await createVideoJob(angleId, result, format, resolution, fps);
      console.log(`\n💾 Job #${videoId} gespeichert`);

      if (dryRun) {
        console.log("\n🔍 Dry-Run: Kein Video gerendert. Daten:");
        console.log(JSON.stringify(result, null, 2));
        await updateVideoStatus(videoId, "failed", { errorMessage: "dry-run" });
        break;
      }

      // 4. Video rendern
      await updateVideoStatus(videoId, "rendering");
      try {
        const outputPath = await renderVideo({
          format,
          resolution,
          fps,
          props: { data: result },
        });

        await updateVideoStatus(videoId, "done", { outputPath });
        console.log(`\n✅ Video fertig: ${outputPath}`);

        if (result.socialMedia) {
          console.log(`\n📱 Social Media:`);
          console.log(`   Titel: ${result.socialMedia.title}`);
          console.log(`   Hashtags: ${result.socialMedia.hashtags.join(" ")}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await updateVideoStatus(videoId, "failed", { errorMessage: msg });
        throw err;
      }
      break;
    }

    case "research": {
      const topic = getArg("--topic", "");
      if (!topic) {
        console.error("❌ --topic ist erforderlich. Beispiel: research --topic \"Tech-Aktien\"");
        process.exit(1);
      }

      console.log(`\n🔍 Recherchiere Daten für Thema: "${topic}" ...`);
      const previousAngles = await getPreviousAngles(topic);
      const result = await researchTopic(topic, previousAngles);

      console.log("\n✅ Recherche abgeschlossen:");
      console.log(`   Titel: ${result.title}`);
      console.log(`   Blickwinkel: ${result.angle}`);
      console.log(`   Teilnehmer: ${result.participants.length}`);
      console.log(`   Zeitpunkte: ${result.timeLabels.join(", ")}`);
      console.log("\nJSON-Output:");
      console.log(JSON.stringify(result, null, 2));
      break;
    }

    case "list": {
      const videos = await listVideos();
      if (videos.length === 0) {
        console.log("\nKeine generierten Videos vorhanden.");
        break;
      }

      console.log(`\n📹 ${videos.length} generierte Videos:\n`);
      for (const v of videos) {
        const topic = (v.angle as { topic?: { name?: string } })?.topic?.name ?? "?";
        const angle = (v.angle as { angle?: string })?.angle ?? "?";
        const status = v.status === "done" ? "✅" : v.status === "failed" ? "❌" : "⏳";
        console.log(`${status} #${v.id} [${v.format}] ${topic} → ${angle}`);
        if (v.outputPath) console.log(`      📁 ${v.outputPath}`);
        console.log(`      📅 ${v.createdAt}`);
      }
      break;
    }

    case "topics": {
      const topics = await listTopics();
      if (topics.length === 0) {
        console.log("\nKeine Themen vorhanden.");
        break;
      }

      console.log(`\n📚 ${topics.length} Themen:\n`);
      for (const t of topics) {
        console.log(`• ${t.name} (${(t.angles as unknown[]).length} Blickwinkel)`);
        for (const a of t.angles as { angle: string }[]) {
          console.log(`    - ${a.angle}`);
        }
      }
      break;
    }

    default:
      console.log(`
ChartRacer CLI

Befehle:
  generate  --topic "Thema" [--format 16:9|9:16|1:1] [--resolution 720p|1080p|4k] [--fps 30|60] [--dry-run]
  research  --topic "Thema"        (nur recherchieren, kein Video)
  render    [--format 16:9] [--resolution 1080p] [--fps 30] [--output path.mp4]
  still     [--frame N]
  list                             (alle generierten Videos auflisten)
  topics                           (alle Themen mit Blickwinkeln anzeigen)

Beispiele:
  npx ts-node src/cli/index.ts generate --topic "Tech-Aktien"
  npx ts-node src/cli/index.ts generate --topic "Sport" --dry-run
  npx ts-node src/cli/index.ts list
  npx ts-node src/cli/index.ts render --format 16:9 --resolution 1080p
`);
  }
}

main().catch((err) => {
  console.error("❌ Fehler:", err.message);
  process.exit(1);
});
