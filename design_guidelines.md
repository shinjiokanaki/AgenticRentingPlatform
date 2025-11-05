# Design Guidelines: Agentic Rental Platform

## Design Approach

**Hybrid Approach**: Search-first interface inspired by Airbnb's property browsing clarity + Linear's data-dense UI precision + Stripe's functional restraint.

**Core Principle**: Make complex rental workflows feel effortless through clear information hierarchy, intelligent data presentation, and progressive disclosure.

---

## Typography

**Font System**:
- Primary: Inter (400, 500, 600, 700) via Google Fonts
- Monospace: JetBrains Mono (400, 500) for data/numbers

**Hierarchy**:
- Hero/Search: text-4xl/text-5xl font-semibold
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl/text-2xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Labels/Metadata: text-sm font-medium
- Micro Copy: text-xs font-normal
- Match Scores/Numbers: font-mono text-2xl font-semibold

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** only
- Component padding: p-4 or p-6
- Section spacing: space-y-8 or space-y-12
- Card gaps: gap-6
- Form field spacing: space-y-4
- Inline elements: gap-2 or gap-4

**Containers**:
- Max-width: max-w-7xl for main content
- Search results grid: max-w-screen-2xl
- Forms/Detail views: max-w-4xl
- Narrow content: max-w-2xl

**Grid Systems**:
- Property Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature Displays: grid-cols-2 lg:grid-cols-4 gap-4
- Document Grid: grid-cols-1 sm:grid-cols-2 gap-4

---

## Component Library

### Search & Discovery

**Search Modal/Hero** (Landing):
- Full-width search bar with icon, large touch targets (min-h-14)
- Auto-complete dropdown with recent searches
- Quick filters as pill buttons below search
- Prominent "Search Properties" CTA button

**Property Cards**:
- Image aspect ratio: 4:3 with rounded-lg
- Match badge (top-right corner): Likely (solid), Maybe (outlined), Unlikely (subtle)
- Price: font-mono text-xl font-semibold
- Location/specs: text-sm with icons
- Reason pill: inline badge with truncated text
- Hover: subtle shadow lift (shadow-lg)

**Match Score Display**:
- Circular progress or horizontal bar (0-100 scale)
- Label badge: rounded-full px-3 py-1 text-sm font-medium
- Breakdown facets: grid of small stat cards with icons

### Forms & Inputs

**Form Fields**:
- Input height: min-h-12
- Border: border-2 with rounded-lg
- Labels: text-sm font-medium mb-2
- Helper text: text-xs below input
- Error states: border-red with text-red message

**Multi-Step Forms** (Onboarding):
- Progress indicator: horizontal step bar with checkmarks
- Each step in its own card (p-6 space-y-4)
- Back/Continue buttons: flex justify-between

**Document Upload**:
- Drag-and-drop zone: dashed border, p-8, center-aligned
- File list: cards with icon, name, size, status badge, delete button
- Upload status: progress bar with percentage

### Navigation

**Top Navigation**:
- Fixed header: h-16 with shadow
- Logo left, search center (on tenant view), user menu right
- Role switcher (Tenant/Landlord) if applicable

**Sidebar** (Landlord Dashboard):
- Fixed left: w-64
- Menu items: p-3 rounded-lg with icons
- Active state: distinct background
- Section dividers

### Data Display

**Property Detail View**:
- Hero gallery: carousel or grid (aspect-4:3)
- Two-column layout: Details (left, 2/3) + Actions sidebar (right, 1/3)
- Requirements panel: checklist with icons and status
- Gaps explainer: alert/notice card with bullet points

**Viewing Slots**:
- Calendar grid or list view
- Slot cards: border rounded-lg p-4 with date/time and "Book" button
- Booked slots: opacity-50 with strike-through

**Offer Flow**:
- Modal with form fields
- Summary panel showing calculations (rent × term, deposit)
- Document checklist before submit

### Messaging

**Conversation List**:
- Cards with avatar, name, property context, last message preview
- Unread badge (count)
- Property thumbnail if applicable

**Chat Interface**:
- Messages: speech-bubble style, sender-aligned
- System messages: centered, subtle background
- Action buttons inline (Share Docs, Book Viewing, Make Offer)

### Status & Badges

**Badge System**:
- Match Labels: rounded-full px-3 py-1.5 text-xs font-semibold
- Document Status: rounded px-2 py-1 text-xs (Uploaded, Missing, Expired)
- Viewing Status: similar styling (Confirmed, Pending, Done)
- Offer Status: larger badges for emphasis

**Progress Trackers**:
- Lifecycle stepper: horizontal with connecting lines
- Steps: circle icons with labels below
- Current: emphasized, completed: checkmark, upcoming: outline

### Buttons

**Primary Actions**: rounded-lg px-6 py-3 text-base font-medium
**Secondary**: outlined or ghost variant
**Icon Buttons**: p-2 rounded-lg
**CTAs on Images**: backdrop-blur-sm bg-white/90 rounded-lg px-8 py-4

---

## Images

**Hero Section** (Homepage):
- Large hero image showing a modern apartment interior or cityscape
- Search modal overlaid on hero with backdrop blur
- Image should convey aspiration and ease

**Property Cards**:
- High-quality interior/exterior photos
- Consistent aspect ratios across grid
- Lazy loading for performance

**Empty States**:
- Illustration or icon-based (not photos)
- Encouraging copy with CTA

**Document Icons**:
- Use icon library for document types
- Consistent sizing (w-8 h-8 or w-12 h-12)

---

## Animations

**Minimal & Purposeful**:
- Page transitions: subtle fade
- Card hover: transform scale-[1.02] shadow-lg
- Modal entry: fade + slide from bottom
- Loading states: skeleton screens (no spinners)
- Match score reveal: brief count-up animation

**No Distracting Effects**:
- Avoid parallax, complex scroll animations, or auto-playing carousels
- Focus on instant feedback for user actions

---

## Accessibility

- All interactive elements: min-h-12 for touch targets
- Focus states: ring-2 with offset
- ARIA labels on icon-only buttons
- Semantic HTML throughout
- Color is never the only indicator (use icons + text for status)

---

This design creates a professional, data-rich rental platform that balances the visual appeal of property browsing (Airbnb) with the functional clarity needed for complex workflows (Linear/Stripe), while keeping search as the primary entry point.