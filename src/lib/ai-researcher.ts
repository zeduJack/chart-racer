/**
 * AI-Researcher: Nutzt Claude API mit Web Search Tool
 * um Bar Chart Race Daten zu einem Thema zu recherchieren.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface ResearchedParticipant {
  name: string;
  color: string;
  imageUrl?: string;
  values: number[];
}

export interface ResearchResult {
  title: string;
  subtitle: string;
  timeUnit: "year" | "month" | "quarter";
  timeLabels: string[];
  participants: ResearchedParticipant[];
  valueFormat: {
    prefix?: string;
    suffix?: string;
    abbreviate: boolean;
  };
  suggestedPalette?: string;
  angle: string; // Der gewählte Blickwinkel (für History-Tracking)
  socialMedia?: {
    title: string;
    description: string;
    hashtags: string[];
  };
}

const SYSTEM_PROMPT = `Du bist ein Daten-Recherche-Agent für Bar Chart Race Videos.

Dein Job:
1. Erhalte ein Thema und ggf. eine Liste bereits behandelter Blickwinkel
2. Wähle einen NEUEN, interessanten Blickwinkel der viral gehen könnte
3. Recherchiere via Web Search konkrete Zahlen/Daten (mind. 5 Zeitpunkte, mind. 5 Teilnehmer)
4. Liefere die Daten als JSON zurück

WICHTIG für die Daten:
- Alle Werte müssen positive Zahlen sein
- Zeitreihe muss vollständig sein (keine Lücken)
- Mindestens 5 Teilnehmer, mindestens 5 Zeitpunkte
- Werte pro Teilnehmer exakt so viele wie timeLabels

Antworte NUR mit dem JSON-Objekt (kein Markdown, kein Text darum):
{
  "angle": "Kurze Beschreibung des gewählten Blickwinkels (für History-Tracking)",
  "title": "Videotitel",
  "subtitle": "Untertitel mit Einheit und Zeitraum",
  "timeUnit": "year" | "month" | "quarter",
  "timeLabels": ["2020", "2021", ...],
  "participants": [
    {
      "name": "Name",
      "color": "#hexcolor",
      "imageUrl": null,
      "values": [100, 200, ...]
    }
  ],
  "valueFormat": {
    "prefix": "$",
    "suffix": "B",
    "abbreviate": true
  },
  "suggestedPalette": "tech-neon",
  "socialMedia": {
    "title": "Hook-Titel für Social Media",
    "description": "Kurze Beschreibung",
    "hashtags": ["#tag1", "#tag2"]
  }
}`;

export async function researchTopic(
  topic: string,
  previousAngles: string[] = []
): Promise<ResearchResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const previousAnglesText =
    previousAngles.length > 0
      ? `\n\nBereits behandelte Blickwinkel (NICHT wiederholen):\n${previousAngles.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
      : "";

  const userMessage = `Thema: "${topic}"${previousAnglesText}

Bitte recherchiere passende Daten und liefere ein vollständiges JSON zurück.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  // Agent-Loop: Claude kann mehrfach Web Search nutzen
  let response: Anthropic.Message;
  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    iterations++;

    response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
        } as Anthropic.Messages.ToolUnion,
      ],
      messages,
    });

    // Ende: Claude hat fertige Antwort
    if (response.stop_reason === "end_turn") {
      break;
    }

    // Tool-Use: Web Search ausführen (server-side, wird von Anthropic erledigt)
    // Bei pause_turn: weiter loopen
    if (response.stop_reason === "pause_turn" || response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });

      // Tool-Results sammeln (für client-side tools — web_search ist server-side)
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      if (toolUseBlocks.length > 0) {
        // Nur für custom tools nötig — web_search läuft server-side
        // Dummy-continue für den Loop
        const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map(
          (tool) => ({
            type: "tool_result" as const,
            tool_use_id: tool.id,
            content: "Tool executed server-side",
          })
        );
        messages.push({ role: "user", content: toolResults });
      }
      continue;
    }

    // Unerwarteter stop_reason
    break;
  }

  // JSON aus der Antwort extrahieren
  const textBlock = response!.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );

  if (!textBlock) {
    throw new Error("Keine Text-Antwort vom AI-Researcher erhalten");
  }

  const jsonText = textBlock.text.trim();

  // JSON parsen (ggf. Markdown-Fences entfernen)
  const cleanJson = jsonText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: ResearchResult;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    throw new Error(
      `AI-Researcher hat kein gültiges JSON zurückgegeben:\n${jsonText.slice(0, 500)}`
    );
  }

  // Basis-Validierung
  if (!parsed.participants || parsed.participants.length < 2) {
    throw new Error("Zu wenige Teilnehmer in den recherchierten Daten");
  }
  if (!parsed.timeLabels || parsed.timeLabels.length < 2) {
    throw new Error("Zu wenige Zeitpunkte in den recherchierten Daten");
  }

  return parsed;
}
