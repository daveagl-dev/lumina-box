import Anthropic from "@anthropic-ai/sdk";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;

const SYSTEM_PROMPT = `You are Angela, the friendly assistant of Lumina Box, a cloud file storage app where users upload files, organize them in folders, mark favorites, share files and keep a trash bin.
Answer briefly (a few sentences), using simple Markdown (short lists, bold) only when it helps, and in the same language the user writes in. Help with using the app and general questions. You cannot see or access the user's files, so don't claim to; if asked about a specific file, explain how they can find it in the app.`;

let client;

export async function chat(req, res) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "Angela is not configured" });
  }

  const { messages } = req.body || {};
  const valid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() &&
        m.content.length <= MAX_MESSAGE_CHARS
    ) &&
    messages[messages.length - 1].role === "user";
  if (!valid) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    client ??= new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: messages.slice(-MAX_MESSAGES).map(({ role, content }) => ({ role, content })),
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    res.json({ reply });
  } catch (error) {
    console.error("Chat failed:", error);
    res.status(500).json({ error: "Angela could not answer right now" });
  }
}
