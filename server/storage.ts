import {
  type User,
  type InsertUser,
  type TenantPassport,
  type InsertTenantPassport,
  type Property,
  type InsertProperty,
  type Swipe,
  type InsertSwipe,
  type Match,
  type InsertMatch,
  type ScoutRule,
  type InsertScoutRule,
  type Viewing,
  type InsertViewing,
  type Offer,
  type InsertOffer,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenant Passports
  getTenantPassport(tenantId: string): Promise<TenantPassport | undefined>;
  createTenantPassport(passport: InsertTenantPassport): Promise<TenantPassport>;
  updateTenantPassport(id: string, passport: Partial<InsertTenantPassport>): Promise<TenantPassport>;
  getVisibleTenantPassports(): Promise<TenantPassport[]>;
  
  // Properties
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByLandlord(landlordId: string): Promise<Property[]>;
  getPublishedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  
  // Swipes
  getSwipe(actorId: string, targetId: string): Promise<Swipe | undefined>;
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSwipesByActor(actorId: string): Promise<Swipe[]>;
  
  // Matches
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesByTenant(tenantId: string): Promise<Match[]>;
  getMatchesByLandlord(landlordId: string): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match>;
  
  // Scout Rules
  getScoutRulesByLandlord(landlordId: string): Promise<ScoutRule[]>;
  createScoutRule(rule: InsertScoutRule): Promise<ScoutRule>;
  
  // Viewings
  getViewingsByProperty(propertyId: string): Promise<Viewing[]>;
  createViewing(viewing: InsertViewing): Promise<Viewing>;
  bookViewing(id: string, tenantId: string): Promise<Viewing>;
  
  // Offers
  getOffersByProperty(propertyId: string): Promise<Offer[]>;
  getOffersByTenant(tenantId: string): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: string, offer: Partial<InsertOffer>): Promise<Offer>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tenantPassports: Map<string, TenantPassport>;
  private properties: Map<string, Property>;
  private swipes: Map<string, Swipe>;
  private matches: Map<string, Match>;
  private scoutRules: Map<string, ScoutRule>;
  private viewings: Map<string, Viewing>;
  private offers: Map<string, Offer>;

  constructor() {
    this.users = new Map();
    this.tenantPassports = new Map();
    this.properties = new Map();
    this.swipes = new Map();
    this.matches = new Map();
    this.scoutRules = new Map();
    this.viewings = new Map();
    this.offers = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date(), role: insertUser.role || "tenant" };
    this.users.set(id, user);
    return user;
  }

  // Tenant Passports
  async getTenantPassport(tenantId: string): Promise<TenantPassport | undefined> {
    return Array.from(this.tenantPassports.values()).find((p) => p.tenantId === tenantId);
  }

  async createTenantPassport(insertPassport: InsertTenantPassport): Promise<TenantPassport> {
    const id = randomUUID();
    const passport: TenantPassport = {
      ...insertPassport,
      id,
      updatedAt: new Date(),
      mustHaves: insertPassport.mustHaves || [],
      redFlags: insertPassport.redFlags || [],
      shareFields: insertPassport.shareFields || {},
      visible: insertPassport.visible ?? true,
      replyRate: insertPassport.replyRate || "0",
    };
    this.tenantPassports.set(id, passport);
    return passport;
  }

  async updateTenantPassport(id: string, updates: Partial<InsertTenantPassport>): Promise<TenantPassport> {
    const existing = this.tenantPassports.get(id);
    if (!existing) throw new Error("Tenant passport not found");
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.tenantPassports.set(id, updated);
    return updated;
  }

  async getVisibleTenantPassports(): Promise<TenantPassport[]> {
    return Array.from(this.tenantPassports.values()).filter((p) => p.visible);
  }

  // Properties
  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((p) => p.landlordId === landlordId);
  }

  async getPublishedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((p) => p.published);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: insertProperty.images || [],
      mustHaves: insertProperty.mustHaves || [],
      redFlags: insertProperty.redFlags || [],
      incomeMultiple: insertProperty.incomeMultiple || "2.8",
      published: insertProperty.published ?? false,
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property> {
    const existing = this.properties.get(id);
    if (!existing) throw new Error("Property not found");
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  // Swipes
  async getSwipe(actorId: string, targetId: string): Promise<Swipe | undefined> {
    return Array.from(this.swipes.values()).find(
      (s) => s.actorId === actorId && s.targetId === targetId
    );
  }

  async createSwipe(insertSwipe: InsertSwipe): Promise<Swipe> {
    const id = randomUUID();
    const swipe: Swipe = { ...insertSwipe, id, createdAt: new Date() };
    this.swipes.set(id, swipe);
    return swipe;
  }

  async getSwipesByActor(actorId: string): Promise<Swipe[]> {
    return Array.from(this.swipes.values()).filter((s) => s.actorId === actorId);
  }

  // Matches
  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByTenant(tenantId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter((m) => m.tenantId === tenantId);
  }

  async getMatchesByLandlord(landlordId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter((m) => m.landlordId === landlordId);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = {
      ...insertMatch,
      id,
      createdAt: new Date(),
      lastActionAt: new Date(),
      status: insertMatch.status || "pending",
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: string, updates: Partial<InsertMatch>): Promise<Match> {
    const existing = this.matches.get(id);
    if (!existing) throw new Error("Match not found");
    const updated = { ...existing, ...updates, lastActionAt: new Date() };
    this.matches.set(id, updated);
    return updated;
  }

  // Scout Rules
  async getScoutRulesByLandlord(landlordId: string): Promise<ScoutRule[]> {
    return Array.from(this.scoutRules.values()).filter((r) => r.landlordId === landlordId);
  }

  async createScoutRule(insertRule: InsertScoutRule): Promise<ScoutRule> {
    const id = randomUUID();
    const rule: ScoutRule = {
      ...insertRule,
      id,
      createdAt: new Date(),
      criteria: insertRule.criteria || {},
      minScore: insertRule.minScore ?? 60,
      dailyCap: insertRule.dailyCap ?? 10,
      active: insertRule.active ?? true,
    };
    this.scoutRules.set(id, rule);
    return rule;
  }

  // Viewings
  async getViewingsByProperty(propertyId: string): Promise<Viewing[]> {
    return Array.from(this.viewings.values()).filter((v) => v.propertyId === propertyId);
  }

  async createViewing(insertViewing: InsertViewing): Promise<Viewing> {
    const id = randomUUID();
    const viewing: Viewing = { ...insertViewing, id, createdAt: new Date(), booked: false };
    this.viewings.set(id, viewing);
    return viewing;
  }

  async bookViewing(id: string, tenantId: string): Promise<Viewing> {
    const existing = this.viewings.get(id);
    if (!existing) throw new Error("Viewing not found");
    const updated = { ...existing, tenantId, booked: true };
    this.viewings.set(id, updated);
    return updated;
  }

  // Offers
  async getOffersByProperty(propertyId: string): Promise<Offer[]> {
    return Array.from(this.offers.values()).filter((o) => o.propertyId === propertyId);
  }

  async getOffersByTenant(tenantId: string): Promise<Offer[]> {
    return Array.from(this.offers.values()).filter((o) => o.tenantId === tenantId);
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const id = randomUUID();
    const offer: Offer = { ...insertOffer, id, createdAt: new Date(), status: "pending" };
    this.offers.set(id, offer);
    return offer;
  }

  async updateOffer(id: string, updates: Partial<InsertOffer>): Promise<Offer> {
    const existing = this.offers.get(id);
    if (!existing) throw new Error("Offer not found");
    const updated = { ...existing, ...updates };
    this.offers.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
