/**
 * Removes things a model sometimes writes that only look like system output: "Tool used:" lines,
 * agent-persona announcements, and JSON blocks imitating tool results. Real tool calls and data
 * reach the UI separately, so nothing genuine is lost.
 */
export function cleanReply(text: string, userMessage = ""): string {
  let out = text.replace(/\r\n/g, "\n");
  out = out.replace(/^[ \t>*_-]*\**\s*tools?\s+used\s*\**\s*:.*$/gim, "");
  out = out.replace(/\b(?:using|via|with)\s+(?:my|the|our)\s+[\w /&-]{1,30}?\s+agent\b\s*,?\s*/gi, "");
  if (!/\bjson\b/i.test(userMessage)) out = out.replace(/```json[\s\S]*?```/gi, "");
  out = out.replace(/\n{3,}/g, "\n\n").trim();
  return out ? out.charAt(0).toUpperCase() + out.slice(1) : out;
}
