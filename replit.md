# RentMatch - AI-Powered Rental Platform

## Overview
RentMatch is a "Tinder for renting" platform featuring double-opt-in matching between tenants and landlords. The platform uses AI-powered matching scores, proactive landlord scouting, and a complete rental lifecycle workflow from search to move-in.

## Recent Implementation (November 5, 2025)

### Key Features Implemented

1. **Double Opt-In Matching System**
   - Both tenant and landlord must show interest to create a match
   - Swipe-based interface (like/pass/superlike)
   - Match percentage categorization: 0-25%, 26-50%, 51-75%, 76-100%
   - Based on must-haves and red flags alignment

2. **Tenant Passport**
   - Comprehensive profile with salary, employment, household size, pets, move-in dates
   - Must-haves (requirements tenants need)
   - Red flags (deal breakers for tenants)
   - Visibility controls (choose what landlords can see)
   - Profile completeness tracking

3. **Landlord Scout Mode**
   - Discover and rank qualified tenants
   - View tenant match percentages and reasons
   - Send invites to tenants
   - Swipe deck interface for quick decisions
   - List view with detailed tenant profiles

4. **Match Percentage Engine** (`shared/matching.ts`)
   - Calculates compatibility based on must-haves and red flags
   - Bidirectional scoring (tenant→property and property→tenant)
   - Returns detailed reasons and gaps
   - Categorizes matches into 4 groups

5. **Reusable Components Created**
   - `TenantPassport` - Profile management with visibility controls
   - `SwipeDeck` - Tinder-style swipe interface (reusable for both sides)
   - `MatchBadge` - Display match percentages
   - `PropertyCard` - Property listings with match scores
   - `SearchModal` - Property search with filters
   - `DocumentUploadZone` - Document vault
   - `RequirementsPanel` - Show requirement status
   - `GapsExplainer` - Explain match strengths/gaps
   - `ViewingSlotPicker` - Book property viewings
   - `OfferModal` - Submit rental offers
   - `ProfileStepper` - Onboarding wizard
   - `ConversationList` - Message inbox
   - `ChatInterface` - Real-time messaging

6. **Pages Implemented**
   - `HomePage` - Hero search + featured properties
   - `PropertyDetailPage` - Full property details with matching
   - `ScoutModePage` - Landlord tenant discovery
   - `MatchesPage` - Active/pending matches with actions
   - `OnboardingPage` - Profile setup wizard
   - `MessagesPage` - Conversation threads

### Database Schema

Comprehensive schema with 11 tables:
- `users` - Both tenants and landlords with role-based access
- `tenant_passports` - Tenant profiles with must-haves, red flags, visibility
- `properties` - Listings with landlord requirements
- `swipes` - Like/pass/superlike actions from both sides
- `matches` - Double opt-in matches with status tracking
- `scout_rules` - Auto-scout configuration for landlords
- `documents` - Secure document vault
- `threads` - Conversation threads between matches
- `messages` - Chat messages
- `viewings` - Viewing slot management
- `offers` - Rental offer submissions

### Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Routing**: Wouter
- **State**: TanStack Query
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Integrations**: Stripe, Object Storage, OpenAI
- **Fonts**: Inter (primary) + JetBrains Mono (monospace)

### Design System

- **Color Scheme**: Hybrid aesthetics (Airbnb + Linear + Stripe)
- **Spacing**: 2, 4, 6, 8, 12, 16, 20 primitives
- **Match Categories**:
  - 76-100%: Excellent (green)
  - 51-75%: Good (blue)
  - 26-50%: Fair (yellow)
  - 0-25%: Poor (red)

### Matching Algorithm Specification

From the design doc:

**Tenant→Property Score:**
```
scoreTP = 40*affordability + 20*reqFit + 15*timingFit + 15*docs + 10*rentFit
```

**Property→Tenant Score (Scout Mode):**
```
scorePT = 35*affordability_to_rent   // salary vs rent * incomeMultiple
        + 20*timing_overlap          // move-in vs availableFrom
        + 15*doc_completeness        // % of landlord-required docs present
        + 15*engagement              // tenant reply rate / recency
        + 10*household_fit           // pets/students/HMO rules
        + 5 *distance_decay
```

**Match Categories:**
- Hot (≥80): 76-100% category
- Warm (65-79): 51-75% category
- Cold (<65): 26-50% and 0-25% categories

### Current Status

**Completed:**
- ✅ Database schema with double-opt-in support
- ✅ Match percentage calculation engine
- ✅ Tenant Passport component
- ✅ Swipe Deck component
- ✅ Scout Mode page
- ✅ Matches page
- ✅ All core UI components
- ✅ Storage interface (partial - has type errors to fix)

**Pending:**
- ⏳ Fix TypeScript errors in storage.ts
- ⏳ Implement API routes for swipe/match/invite actions
- ⏳ Invite notification system
- ⏳ End-to-end testing

### Known Issues

1. **Type Errors in server/storage.ts**: Drizzle schema inference causing readonly array type mismatches. Need to add proper type assertions for `mustHaves`, `redFlags`, `shareFields`, and nullable fields.

2. **API Routes Not Implemented**: Need to create REST endpoints for:
   - POST /api/swipe - Record swipe actions
   - POST /api/matches - Create matches when both sides swipe right
   - POST /api/invites - Send landlord invites to tenants
   - GET /api/scout - Get ranked tenants for landlord
   - GET /api/matches - Get user's matches

### Next Steps

1. Fix TypeScript errors in storage implementation
2. Implement API routes with proper validation
3. Add invite notification flow
4. Connect frontend components to backend APIs
5. E2E testing of complete swipe→match→message flow
6. Deploy and test Stripe payment integration

### File Structure

```
client/src/
  components/
    TenantPassport.tsx
    SwipeDeck.tsx
    MatchBadge.tsx
    PropertyCard.tsx
    SearchModal.tsx
    DocumentUploadZone.tsx
    RequirementsPanel.tsx
    GapsExplainer.tsx
    ViewingSlotPicker.tsx
    OfferModal.tsx
    ProfileStepper.tsx
    ConversationList.tsx
    ChatInterface.tsx
    examples/ (example implementations for each component)
  pages/
    HomePage.tsx
    PropertyDetailPage.tsx
    ScoutModePage.tsx
    MatchesPage.tsx
    OnboardingPage.tsx
    MessagesPage.tsx
shared/
  schema.ts (11 tables)
  matching.ts (match calculation engine)
server/
  storage.ts (in-memory storage with full CRUD)
  routes.ts (API routes - to be implemented)
```

### User Experience Flow

**For Tenants:**
1. Complete Tenant Passport (profile + must-haves + red flags)
2. Search properties or use Daily Picks swipe deck
3. See match percentages (76-100%, 51-75%, etc.)
4. Swipe right on properties they like
5. Get matched when landlord also shows interest
6. Message landlord, book viewing, make offer

**For Landlords:**
1. List property with requirements (must-haves + red flags)
2. Use Scout Mode to discover qualified tenants
3. View ranked list with match scores and reasons
4. Send invites or swipe on tenants
5. Get matched when tenant accepts/likes back
6. Message tenant, schedule viewings, review offers

### Integration Notes

- **Stripe**: Configured for deposit payments (keys in secrets)
- **Object Storage**: For document vault and property images
- **OpenAI**: For generating match explanations and reasons
- **PostgreSQL**: Development database available via DATABASE_URL

### Design Philosophy

- Search-first for tenants (familiar UX)
- Proactive scouting for landlords (reduce tenant burden)
- Double opt-in ensures mutual interest
- Percentage-based matching (clearer than vague labels)
- Complete lifecycle: search → match → view → offer → move-in
