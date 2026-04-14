import OpenAI from "openai";
import { env } from "../config/env.js";

let openaiClient = null;

// Initialize OpenAI client if API key is available
if (env.openaiApiKey) {
  openaiClient = new OpenAI({ apiKey: env.openaiApiKey });
  console.log("✅ OpenAI AI Enhancement enabled");
} else {
  console.warn("⚠️  OPENAI_API_KEY not set — AI description enhancement disabled");
}

/**
 * Enhance a product description using GPT-4o-mini.
 * Fixes grammar, improves readability, and maintains brand voice.
 *
 * @param {string} rawText - The original product description
 * @returns {Promise<{enhanced: string, original: string}>}
 */
export async function enhanceDescription(rawText) {
  if (!openaiClient) {
    return {
      enhanced: rawText,
      original: rawText,
      aiUsed: false,
      message: "AI enhancement not available — OPENAI_API_KEY not configured"
    };
  }

  if (!rawText || rawText.trim().length === 0) {
    return {
      enhanced: rawText,
      original: rawText,
      aiUsed: false,
      message: "No text provided"
    };
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a premium interior design copywriter for BhardwajDeco, a luxury laminates and wall decor brand. Your task is to enhance product descriptions.

Rules:
- Fix all grammar and spelling errors
- Improve readability and flow
- Use elegant, professional language befitting a luxury brand
- Keep the description concise (max 2-3 paragraphs)
- Highlight key material properties and design appeal
- Do NOT add information that wasn't in the original
- Do NOT use overly flowery or hyperbolic language
- Maintain a sophisticated, understated tone
- Return ONLY the enhanced description text, no explanations`
        },
        {
          role: "user",
          content: `Enhance this product description:\n\n${rawText}`
        }
      ],
      temperature: 0.4,
      max_tokens: 500
    });

    const enhanced = response.choices[0]?.message?.content?.trim() || rawText;

    return {
      enhanced,
      original: rawText,
      aiUsed: true,
      tokensUsed: response.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error("AI enhancement failed:", error.message);
    return {
      enhanced: rawText,
      original: rawText,
      aiUsed: false,
      message: `AI enhancement failed: ${error.message}`
    };
  }
}
