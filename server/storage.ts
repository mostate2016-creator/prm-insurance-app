import {
  type AutoQuote, type InsertAutoQuote,
  type HomeQuote, type InsertHomeQuote,
  type LifeQuote, type InsertLifeQuote,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createAutoQuote(quote: InsertAutoQuote): Promise<AutoQuote>;
  getAutoQuotes(): Promise<AutoQuote[]>;
  createHomeQuote(quote: InsertHomeQuote): Promise<HomeQuote>;
  getHomeQuotes(): Promise<HomeQuote[]>;
  createLifeQuote(quote: InsertLifeQuote): Promise<LifeQuote>;
  getLifeQuotes(): Promise<LifeQuote[]>;
}

export class MemStorage implements IStorage {
  private autoQuotes: Map<string, AutoQuote>;
  private homeQuotes: Map<string, HomeQuote>;
  private lifeQuotes: Map<string, LifeQuote>;

  constructor() {
    this.autoQuotes = new Map();
    this.homeQuotes = new Map();
    this.lifeQuotes = new Map();
  }

  async createAutoQuote(insertQuote: InsertAutoQuote): Promise<AutoQuote> {
    const id = randomUUID();
    const quote: AutoQuote = { ...insertQuote, id, vin: insertQuote.vin ?? null, licenseNumber: insertQuote.licenseNumber ?? null, currentInsurer: insertQuote.currentInsurer ?? null, additionalNotes: insertQuote.additionalNotes ?? null };
    this.autoQuotes.set(id, quote);
    return quote;
  }

  async getAutoQuotes(): Promise<AutoQuote[]> {
    return Array.from(this.autoQuotes.values());
  }

  async createHomeQuote(insertQuote: InsertHomeQuote): Promise<HomeQuote> {
    const id = randomUUID();
    const quote: HomeQuote = { ...insertQuote, id, roofType: insertQuote.roofType ?? null, hasPool: insertQuote.hasPool ?? null, hasSecuritySystem: insertQuote.hasSecuritySystem ?? null, currentInsurer: insertQuote.currentInsurer ?? null, estimatedHomeValue: insertQuote.estimatedHomeValue ?? null, additionalNotes: insertQuote.additionalNotes ?? null };
    this.homeQuotes.set(id, quote);
    return quote;
  }

  async getHomeQuotes(): Promise<HomeQuote[]> {
    return Array.from(this.homeQuotes.values());
  }

  async createLifeQuote(insertQuote: InsertLifeQuote): Promise<LifeQuote> {
    const id = randomUUID();
    const quote: LifeQuote = { ...insertQuote, id, height: insertQuote.height ?? null, weight: insertQuote.weight ?? null, majorHealthConditions: insertQuote.majorHealthConditions ?? null, currentInsurer: insertQuote.currentInsurer ?? null, beneficiary: insertQuote.beneficiary ?? null, additionalNotes: insertQuote.additionalNotes ?? null };
    this.lifeQuotes.set(id, quote);
    return quote;
  }

  async getLifeQuotes(): Promise<LifeQuote[]> {
    return Array.from(this.lifeQuotes.values());
  }
}

export const storage = new MemStorage();
