import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculatePropertyTenantScore } from "../shared/matching";
import { insertSwipeSchema, insertMatchSchema, insertPropertySchema, insertTenantPassportSchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper to get mock user ID (replace with real auth later)
  const getCurrentUserId = (req: any) => "user-1";

  // === SWIPE ACTIONS ===
  app.post("/api/swipe", async (req, res) => {
    try {
      const data = insertSwipeSchema.parse(req.body);
      const swipe = await storage.createSwipe(data);

      // Check if this creates a match (double opt-in)
      if (data.kind === "like") {
        let reciprocalSwipe: any = null;
        let tenantId: string;
        let landlordId: string;
        let propertyId: string;

        if (data.actorRole === "tenant") {
          // Tenant swiped on property
          // targetId is propertyId, need to find if landlord swiped on this tenant
          propertyId = data.targetId;
          tenantId = data.actorId;
          
          // Get property to find landlord
          const property = await storage.getProperty(propertyId);
          if (!property) {
            return res.json({ swipe, match: null });
          }
          landlordId = property.landlordId;
          
          // Check if landlord swiped on this tenant for this property
          const landlordSwipes = await storage.getSwipesByActor(landlordId);
          reciprocalSwipe = landlordSwipes.find(s => 
            s.kind === "like" && 
            s.targetId === tenantId && 
            s.propertyId === propertyId
          );
        } else {
          // Landlord swiped on tenant
          // targetId is tenantId, propertyId is specified
          if (!data.propertyId) {
            return res.status(400).json({ error: "propertyId required for landlord swipes" });
          }
          
          landlordId = data.actorId;
          tenantId = data.targetId;
          propertyId = data.propertyId;
          
          // Check if tenant swiped on this property
          const tenantSwipes = await storage.getSwipesByActor(tenantId);
          reciprocalSwipe = tenantSwipes.find(s => 
            s.kind === "like" && 
            s.targetId === propertyId
          );
        }
        
        if (reciprocalSwipe) {
          // Create match!
          const match = await storage.createMatch({
            tenantId,
            landlordId,
            propertyId,
            origin: "both",
          });
          
          return res.json({ swipe, match });
        }
      }

      res.json({ swipe, match: null });
    } catch (error) {
      console.error("Swipe error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid swipe data" });
    }
  });

  // === MATCHES ===
  app.get("/api/matches", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      const role = req.query.role as "tenant" | "landlord";

      const matches = role === "tenant"
        ? await storage.getMatchesByTenant(userId)
        : await storage.getMatchesByLandlord(userId);

      res.json({ matches });
    } catch (error) {
      console.error("Get matches error:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // === SCOUT MODE (Landlord discovers tenants) ===
  app.get("/api/scout", async (req, res) => {
    try {
      const landlordId = getCurrentUserId(req);
      const propertyId = req.query.propertyId as string;

      if (!propertyId) {
        return res.status(400).json({ error: "propertyId required" });
      }

      // Get property details
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Get all visible tenant passports
      const tenants = await storage.getVisibleTenantPassports();

      // Calculate match scores for each tenant
      const rankedTenants = tenants.map((tenant) => {
        const matchResult = calculatePropertyTenantScore(property, tenant);

        return {
          tenantId: tenant.tenantId,
          tenant: tenant,
          score: matchResult.score,
          category: matchResult.category,
          label: matchResult.label,
          reasons: matchResult.reasons,
          gaps: matchResult.gaps,
        };
      });

      // Sort by score descending
      rankedTenants.sort((a, b) => b.score - a.score);

      res.json({ tenants: rankedTenants });
    } catch (error) {
      console.error("Scout mode error:", error);
      res.status(500).json({ error: "Failed to fetch tenant pool" });
    }
  });

  // === INVITES (Landlord invites tenant) ===
  app.post("/api/invites", async (req, res) => {
    try {
      const schema = z.object({
        landlordId: z.string(),
        tenantId: z.string(),
        propertyId: z.string(),
        messageTemplate: z.string().optional(),
      });

      const data = schema.parse(req.body);

      // Create a landlord→tenant swipe with "like"
      const swipe = await storage.createSwipe({
        actorId: data.landlordId,
        actorRole: "landlord",
        targetId: data.tenantId,
        targetType: "tenant",
        propertyId: data.propertyId,
        kind: "like",
        messageTemplate: data.messageTemplate,
      });

      res.json({ invite: swipe });
    } catch (error) {
      console.error("Invite error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid invite data" });
    }
  });

  // === PROPERTIES ===
  app.post("/api/properties", async (req, res) => {
    try {
      const data = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(data);
      res.json({ property });
    } catch (error) {
      console.error("Create property error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid property data" });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const landlordId = req.query.landlordId as string;
      const published = req.query.published === "true";

      if (landlordId) {
        const properties = await storage.getPropertiesByLandlord(landlordId);
        return res.json({ properties });
      }

      if (published) {
        const properties = await storage.getPublishedProperties();
        return res.json({ properties });
      }

      res.status(400).json({ error: "landlordId or published filter required" });
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json({ property });
    } catch (error) {
      console.error("Get property error:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const updates = req.body;
      const property = await storage.updateProperty(req.params.id, updates);
      res.json({ property });
    } catch (error) {
      console.error("Update property error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update property" });
    }
  });

  // === TENANT PASSPORT ===
  app.post("/api/tenant-passport", async (req, res) => {
    try {
      const data = insertTenantPassportSchema.parse(req.body);
      const passport = await storage.createTenantPassport(data);
      res.json({ passport });
    } catch (error) {
      console.error("Create passport error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid passport data" });
    }
  });

  app.get("/api/tenant-passport/:tenantId", async (req, res) => {
    try {
      const passport = await storage.getTenantPassport(req.params.tenantId);
      if (!passport) {
        return res.status(404).json({ error: "Tenant passport not found" });
      }
      res.json({ passport });
    } catch (error) {
      console.error("Get passport error:", error);
      res.status(500).json({ error: "Failed to fetch tenant passport" });
    }
  });

  app.patch("/api/tenant-passport/:id", async (req, res) => {
    try {
      const updates = req.body;
      const passport = await storage.updateTenantPassport(req.params.id, updates);
      res.json({ passport });
    } catch (error) {
      console.error("Update passport error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update passport" });
    }
  });

  // === VIEWINGS ===
  app.post("/api/viewings", async (req, res) => {
    try {
      const schema = z.object({
        propertyId: z.string(),
        startTime: z.string().transform((s) => new Date(s)),
        endTime: z.string().transform((s) => new Date(s)),
      });

      const data = schema.parse(req.body);
      const viewing = await storage.createViewing(data);
      res.json({ viewing });
    } catch (error) {
      console.error("Create viewing error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid viewing data" });
    }
  });

  app.post("/api/viewings/:id/book", async (req, res) => {
    try {
      const { tenantId } = req.body;
      const viewing = await storage.bookViewing(req.params.id, tenantId);
      res.json({ viewing });
    } catch (error) {
      console.error("Book viewing error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to book viewing" });
    }
  });

  // === OFFERS ===
  app.post("/api/offers", async (req, res) => {
    try {
      const schema = z.object({
        tenantId: z.string(),
        propertyId: z.string(),
        rentPcm: z.number(),
        startDate: z.string().transform((s) => new Date(s)),
        termMonths: z.number(),
        conditions: z.string().optional(),
      });

      const data = schema.parse(req.body);
      const offer = await storage.createOffer(data);
      res.json({ offer });
    } catch (error) {
      console.error("Create offer error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid offer data" });
    }
  });

  app.patch("/api/offers/:id", async (req, res) => {
    try {
      const updates = req.body;
      const offer = await storage.updateOffer(req.params.id, updates);
      res.json({ offer });
    } catch (error) {
      console.error("Update offer error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update offer" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
