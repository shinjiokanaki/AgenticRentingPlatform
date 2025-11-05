import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["tenant", "landlord"]);
export const swipeKindEnum = pgEnum("swipe_kind", ["like", "pass", "superlike"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "matched", "stale"]);
export const matchOriginEnum = pgEnum("match_origin", ["tenant_like", "landlord_invite", "both"]);
export const docKindEnum = pgEnum("doc_kind", ["id", "payslip", "address", "employment", "landlord_ref", "credit_report"]);

// Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("tenant"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tenant Passports (profiles with visibility controls)
export const tenantPassports = pgTable("tenant_passports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => users.id),
  
  // Profile data
  salaryAnnual: integer("salary_annual"),
  salaryBand: text("salary_band"), // "£30k-£40k", "£40k-£50k", etc
  employer: text("employer"),
  householdSize: integer("household_size").default(1),
  hasPets: boolean("has_pets").default(false),
  petDetails: text("pet_details"),
  moveInFrom: timestamp("move_in_from"),
  moveInTo: timestamp("move_in_to"),
  maxBudget: integer("max_budget"),
  
  // Must-haves (what tenant requires)
  mustHaves: jsonb("must_haves").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Red flags (deal breakers for tenant)
  redFlags: jsonb("red_flags").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Visibility controls
  visible: boolean("visible").default(true),
  shareFields: jsonb("share_fields").$type<{
    salaryBand?: boolean;
    moveIn?: boolean;
    pets?: boolean;
    docsStatus?: boolean;
  }>().default(sql`'{}'::jsonb`),
  
  // Engagement metrics
  replyRate: decimal("reply_rate", { precision: 5, scale: 2 }).default("0"),
  lastActive: timestamp("last_active"),
  
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Properties
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  
  title: text("title").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  postcode: text("postcode"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  rentPcm: integer("rent_pcm").notNull(),
  depositAmount: integer("deposit_amount"),
  beds: integer("beds").notNull(),
  baths: integer("baths"),
  
  furnished: boolean("furnished").default(false),
  petsAllowed: boolean("pets_allowed").default(false),
  studentsAllowed: boolean("students_allowed").default(true),
  
  availableFrom: timestamp("available_from"),
  images: jsonb("images").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Landlord requirements
  incomeMultiple: decimal("income_multiple", { precision: 3, scale: 1 }).default("2.8"),
  mustHaves: jsonb("must_haves").$type<string[]>().default(sql`'[]'::jsonb`),
  redFlags: jsonb("red_flags").$type<string[]>().default(sql`'[]'::jsonb`),
  
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Swipes (tenant→property and landlord→tenant)
export const swipes = pgTable("swipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Actor (who is swiping)
  actorId: varchar("actor_id").notNull().references(() => users.id),
  actorRole: userRoleEnum("actor_role").notNull(),
  
  // Target (what is being swiped on)
  targetId: varchar("target_id").notNull(), // propertyId or tenantId
  targetType: text("target_type").notNull(), // "property" or "tenant"
  
  // If landlord swiping on tenant, link to specific property
  propertyId: varchar("property_id").references(() => properties.id),
  
  kind: swipeKindEnum("kind").notNull(),
  messageTemplate: text("message_template"), // For invites
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Matches (double opt-in)
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  tenantId: varchar("tenant_id").notNull().references(() => users.id),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  
  origin: matchOriginEnum("origin").notNull(),
  status: matchStatusEnum("status").notNull().default("pending"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActionAt: timestamp("last_action_at").notNull().defaultNow(),
});

// Scout Rules (auto-scout configuration for landlords)
export const scoutRules = pgTable("scout_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id),
  
  criteria: jsonb("criteria").$type<{
    geo?: { lat: number; lng: number; radiusMiles: number };
    rentMin?: number;
    rentMax?: number;
    beds?: number;
    moveInFrom?: string;
    moveInTo?: string;
    pets?: boolean;
    students?: boolean;
  }>().default(sql`'{}'::jsonb`),
  
  minScore: integer("min_score").default(60),
  dailyCap: integer("daily_cap").default(10),
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  kind: docKindEnum("kind").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  storagePath: text("storage_path").notNull(),
  
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Threads (conversations between tenant and landlord)
export const threads = pgTable("threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => threads.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  
  content: text("content").notNull(),
  kind: text("kind").notNull().default("text"), // "text", "system", "viewing_booked", etc
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Viewings
export const viewings = pgTable("viewings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  tenantId: varchar("tenant_id").references(() => users.id),
  
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  booked: boolean("booked").default(false),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Offers
export const offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  tenantId: varchar("tenant_id").notNull().references(() => users.id),
  
  rentPcm: integer("rent_pcm").notNull(),
  startDate: timestamp("start_date").notNull(),
  termMonths: integer("term_months").notNull(),
  conditions: text("conditions"),
  
  status: text("status").notNull().default("pending"), // "pending", "accepted", "rejected"
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTenantPassportSchema = createInsertSchema(tenantPassports).omit({ id: true, updatedAt: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSwipeSchema = createInsertSchema(swipes).omit({ id: true, createdAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true, lastActionAt: true });
export const insertScoutRuleSchema = createInsertSchema(scoutRules).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadedAt: true });
export const insertThreadSchema = createInsertSchema(threads).omit({ id: true, createdAt: true, lastMessageAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertViewingSchema = createInsertSchema(viewings).omit({ id: true, createdAt: true });
export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TenantPassport = typeof tenantPassports.$inferSelect;
export type InsertTenantPassport = z.infer<typeof insertTenantPassportSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type ScoutRule = typeof scoutRules.$inferSelect;
export type InsertScoutRule = z.infer<typeof insertScoutRuleSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Thread = typeof threads.$inferSelect;
export type InsertThread = z.infer<typeof insertThreadSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Viewing = typeof viewings.$inferSelect;
export type InsertViewing = z.infer<typeof insertViewingSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
