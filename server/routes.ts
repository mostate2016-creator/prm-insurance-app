import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAutoQuoteSchema, insertHomeQuoteSchema, insertLifeQuoteSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { sendAutoQuoteNotification, sendHomeQuoteNotification, sendLifeQuoteNotification } from "./email";
import Anthropic from "@anthropic-ai/sdk";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Submit auto quote request
  app.post("/api/quotes/auto", async (req, res) => {
    try {
      const parsed = insertAutoQuoteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const quote = await storage.createAutoQuote(parsed.data);
      
      // Send email notification (non-blocking — don't fail the request if email fails)
      sendAutoQuoteNotification(parsed.data).catch((err) => {
        console.error("[Routes] Email notification failed:", err);
      });
      
      return res.status(201).json(quote);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Failed to submit auto quote" });
    }
  });

  // Get all auto quotes
  app.get("/api/quotes/auto", async (_req, res) => {
    const quotes = await storage.getAutoQuotes();
    return res.json(quotes);
  });

  // Submit home quote request
  app.post("/api/quotes/home", async (req, res) => {
    try {
      const parsed = insertHomeQuoteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const quote = await storage.createHomeQuote(parsed.data);
      
      // Send email notification (non-blocking — don't fail the request if email fails)
      sendHomeQuoteNotification(parsed.data).catch((err) => {
        console.error("[Routes] Email notification failed:", err);
      });
      
      return res.status(201).json(quote);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Failed to submit home quote" });
    }
  });

  // Get all home quotes
  app.get("/api/quotes/home", async (_req, res) => {
    const quotes = await storage.getHomeQuotes();
    return res.json(quotes);
  });

  // Submit life quote request
  app.post("/api/quotes/life", async (req, res) => {
    try {
      const parsed = insertLifeQuoteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const quote = await storage.createLifeQuote(parsed.data);
      
      sendLifeQuoteNotification(parsed.data).catch((err) => {
        console.error("[Routes] Email notification failed:", err);
      });
      
      return res.status(201).json(quote);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Failed to submit life quote" });
    }
  });

  // Get all life quotes
  app.get("/api/quotes/life", async (_req, res) => {
    const quotes = await storage.getLifeQuotes();
    return res.json(quotes);
  });

  // AI Chat endpoint
  const anthropic = new Anthropic();

  const SYSTEM_PROMPT = `You are a friendly insurance assistant for PRM Insurance, a local insurance agency based in Springfield, Missouri. Your job is to help visitors figure out which type of insurance quote they need.

PRM Insurance offers three types of quotes:
1. **Auto Insurance** — for cars, trucks, and vehicles
2. **Home Insurance** — for houses, condos, townhouses, and rental properties
3. **Life Insurance** — for protecting your family's financial future

Your approach:
- Be warm, conversational, and brief (2-3 sentences max per response)
- Ask one simple question at a time to understand what they need
- Once you identify what they need, recommend the right quote form and include the link
- If they need multiple types, suggest starting with one

When recommending a quote form, use these exact links:
- Auto: [Get an Auto Quote](/auto-quote)
- Home: [Get a Home Quote](/home-quote)
- Life: [Get a Life Quote](/life-quote)

If someone asks something outside of insurance (like claims, billing, or complex policy questions), let them know they can call PRM Insurance directly at (417) 766-1819 for personalized help.

Keep it simple. You're helping regular folks in Missouri — no jargon, no pressure.`;

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }

      const response = await anthropic.messages.create({
        model: "claude_haiku_4_5",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      });

      const text = response.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("");

      return res.json({ reply: text });
    } catch (error: any) {
      console.error("[Chat] Error:", error.message);
      return res.status(500).json({ message: "Chat is temporarily unavailable. Please call (417) 766-1819 for help." });
    }
  });

  return httpServer;
}
