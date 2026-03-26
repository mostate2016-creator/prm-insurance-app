import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Auto quote requests
export const autoQuotes = pgTable("auto_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Contact info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  // Vehicle info
  vehicleYear: text("vehicle_year").notNull(),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vin: text("vin"),
  // Driver info
  dateOfBirth: text("date_of_birth").notNull(),
  licenseNumber: text("license_number"),
  currentInsurer: text("current_insurer"),
  // Coverage preferences
  coverageType: text("coverage_type").notNull(),
  additionalNotes: text("additional_notes"),
  createdAt: text("created_at").notNull(),
});

export const insertAutoQuoteSchema = createInsertSchema(autoQuotes).omit({ id: true }).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Valid ZIP code is required"),
  vehicleYear: z.string().min(4, "Vehicle year is required"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  coverageType: z.string().min(1, "Coverage type is required"),
});

export type InsertAutoQuote = z.infer<typeof insertAutoQuoteSchema>;
export type AutoQuote = typeof autoQuotes.$inferSelect;

// Home quote requests
export const homeQuotes = pgTable("home_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Contact info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Property info
  propertyAddress: text("property_address").notNull(),
  propertyCity: text("property_city").notNull(),
  propertyState: text("property_state").notNull(),
  propertyZip: text("property_zip").notNull(),
  propertyType: text("property_type").notNull(),
  yearBuilt: text("year_built").notNull(),
  squareFootage: text("square_footage").notNull(),
  numberOfBedrooms: text("number_of_bedrooms").notNull(),
  numberOfBathrooms: text("number_of_bathrooms").notNull(),
  // Additional details
  roofType: text("roof_type"),
  hasPool: text("has_pool"),
  hasSecuritySystem: text("has_security_system"),
  currentInsurer: text("current_insurer"),
  estimatedHomeValue: text("estimated_home_value"),
  additionalNotes: text("additional_notes"),
  createdAt: text("created_at").notNull(),
});

export const insertHomeQuoteSchema = createInsertSchema(homeQuotes).omit({ id: true }).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  propertyAddress: z.string().min(1, "Property address is required"),
  propertyCity: z.string().min(1, "City is required"),
  propertyState: z.string().min(1, "State is required"),
  propertyZip: z.string().min(5, "Valid ZIP code is required"),
  propertyType: z.string().min(1, "Property type is required"),
  yearBuilt: z.string().min(4, "Year built is required"),
  squareFootage: z.string().min(1, "Square footage is required"),
  numberOfBedrooms: z.string().min(1, "Number of bedrooms is required"),
  numberOfBathrooms: z.string().min(1, "Number of bathrooms is required"),
});

export type InsertHomeQuote = z.infer<typeof insertHomeQuoteSchema>;
export type HomeQuote = typeof homeQuotes.$inferSelect;

// Life quote requests
export const lifeQuotes = pgTable("life_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Contact info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  // Personal info
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  height: text("height"),
  weight: text("weight"),
  // Health & lifestyle
  tobaccoUse: text("tobacco_use").notNull(),
  generalHealth: text("general_health").notNull(),
  majorHealthConditions: text("major_health_conditions"),
  // Coverage preferences
  coverageAmount: text("coverage_amount").notNull(),
  policyType: text("policy_type").notNull(),
  currentInsurer: text("current_insurer"),
  beneficiary: text("beneficiary"),
  additionalNotes: text("additional_notes"),
  createdAt: text("created_at").notNull(),
});

export const insertLifeQuoteSchema = createInsertSchema(lifeQuotes).omit({ id: true }).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Valid ZIP code is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  tobaccoUse: z.string().min(1, "Tobacco use is required"),
  generalHealth: z.string().min(1, "General health is required"),
  coverageAmount: z.string().min(1, "Coverage amount is required"),
  policyType: z.string().min(1, "Policy type is required"),
});

export type InsertLifeQuote = z.infer<typeof insertLifeQuoteSchema>;
export type LifeQuote = typeof lifeQuotes.$inferSelect;
