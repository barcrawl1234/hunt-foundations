# Architecture Documentation

## System Overview

HuntQuest is a full-stack web application built with React and Lovable Cloud (Supabase backend).

## Frontend Architecture

### Technology Stack
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** for styling with design system
- **shadcn/ui** for base components
- **React Router** for navigation

### Project Structure

```
src/
├── components/
│   ├── layout/          # Navigation, headers, footers
│   └── ui/              # Reusable UI components (shadcn/ui)
├── lib/
│   ├── auth.tsx         # Authentication context and hooks
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/signup
│   ├── player/          # Player-specific pages
│   ├── host/            # Host-specific pages
│   └── admin/           # Admin-specific pages
└── integrations/
    └── supabase/        # Auto-generated backend integration
```

## Authentication System

### Location
- Context: `src/lib/auth.tsx`
- Provider: `AuthProvider` wraps entire app
- Hook: `useAuth()` for accessing auth state

### Features
- Email/password authentication
- Role selection during signup (PLAYER/HOST)
- Session persistence via Lovable Cloud
- Auto-redirect based on user role

### Role-Based Access Control

**Route Protection:**
- `useRequireAuth(role)` hook protects pages
- Redirects unauthenticated users to `/auth`
- Redirects wrong roles to appropriate dashboards

**Dashboard Routes:**
- Players → `/player/dashboard`
- Hosts → `/host/dashboard`
- Super Admins → `/admin/super`

## Backend Architecture

### Lovable Cloud (Supabase)

**Database:**
- PostgreSQL with Row Level Security (RLS)
- Auto-generated TypeScript types
- Real-time subscriptions ready

**Authentication:**
- Built-in auth system
- Email confirmation auto-enabled
- Profile creation trigger on signup

**Security:**
- RLS policies enforce data access rules
- Hosts can only manage their own hunts
- Players can only access their own sessions
- Super admins have platform-wide access

## Design System

### Color Scheme
- **Primary**: Deep teal (adventure theme)
- **Secondary**: Amber/gold (treasure theme)
- **Accent**: Rich amber
- Custom gradients for hero elements

### Component Variants
Located in `src/components/ui/button-variants.tsx`:
- `hero`: Gradient primary buttons
- `accent`: Gradient secondary buttons
- Standard variants: default, outline, ghost, etc.

## PWA Configuration

### Files
- `public/manifest.json` - App manifest
- `index.html` - Mobile meta tags

### Features
- Installable on mobile devices
- Mobile-optimized viewport
- Standalone display mode

## Future Extension Points

### Hunt Builder (Not Yet Implemented)
- Will be added to Host dashboard
- Location management interface
- Clue/puzzle creation tools

### QR Code System (Not Yet Implemented)
- QR generation for locations
- Scanner integration for players

### Payment Integration (Not Yet Implemented)
- Stripe/payment gateway
- Ticket purchasing flow
- Revenue tracking

### AI Story Generation (Not Yet Implemented)
- Lovable AI integration for content
- Automated puzzle creation
- Story suggestions

## Development Workflow

```bash
# Local development
npm run dev          # Start dev server on :8080

# Production build
npm run build        # Creates dist/ folder

# Type checking
npm run type-check   # Validate TypeScript
```

## Deployment

Application deploys via Lovable's integrated deployment system. Backend changes deploy automatically; frontend requires clicking "Update" in publish dialog.
