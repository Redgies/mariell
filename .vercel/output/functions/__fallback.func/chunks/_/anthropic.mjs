import Anthropic from '@anthropic-ai/sdk';

let client = null;
const ANTHROPIC_MODEL = "claude-haiku-4-5";
function getClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("[anthropic] ANTHROPIC_API_KEY missing");
    client = new Anthropic({ apiKey });
  }
  return client;
}
async function generatePlanWithAnthropic(opts) {
  var _a, _b;
  const stream = await getClient().messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: (_a = opts.maxTokens) != null ? _a : 12e3,
    temperature: (_b = opts.temperature) != null ? _b : 0.2,
    system: [
      {
        type: "text",
        text: opts.systemPrompt,
        cache_control: { type: "ephemeral" }
      }
    ],
    messages: [{ role: "user", content: opts.userPrompt }]
  });
  let fullContent = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      fullContent += chunk.delta.text;
    }
  }
  return fullContent;
}
function hasAnthropic() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
async function generateEvaluationWithAnthropic(opts) {
  var _a, _b, _c, _d, _e, _f, _g;
  const tools = [];
  if (opts.maxWebSearches && opts.maxWebSearches > 0) {
    tools.push({
      type: "web_search_20250305",
      name: "web_search",
      max_uses: opts.maxWebSearches
    });
  }
  const stream = await getClient().messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: (_a = opts.maxTokens) != null ? _a : 16e3,
    temperature: (_b = opts.temperature) != null ? _b : 0.15,
    system: opts.systemBlocks,
    messages: [{ role: "user", content: opts.userPrompt }],
    ...tools.length > 0 ? { tools } : {}
  });
  let fullContent = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      fullContent += chunk.delta.text;
    }
  }
  const finalMessage = await stream.finalMessage();
  const usage = (_c = finalMessage.usage) != null ? _c : {};
  return {
    content: fullContent,
    usage: {
      inputTokens: (_d = usage.input_tokens) != null ? _d : 0,
      outputTokens: (_e = usage.output_tokens) != null ? _e : 0,
      cacheCreationTokens: (_f = usage.cache_creation_input_tokens) != null ? _f : 0,
      cacheReadTokens: (_g = usage.cache_read_input_tokens) != null ? _g : 0
    }
  };
}

export { generatePlanWithAnthropic as a, generateEvaluationWithAnthropic as g, hasAnthropic as h };
//# sourceMappingURL=anthropic.mjs.map
