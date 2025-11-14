# HuntQuest - Story-Driven Bar Crawl Platform

A digital treasure hunt and escape room platform for creating and playing immersive bar crawl adventures.

## Overview

HuntQuest enables hosts to create themed, story-driven bar crawl experiences while players solve puzzles and explore cities through interactive adventures.

## User Roles

- **PLAYER**: Participate in hunts, solve puzzles, and explore bar crawls
- **HOST**: Create and manage hunts, set pricing, track analytics
- **SUPER_ADMIN**: Platform-wide management and oversight

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lovable Cloud (Supabase) for backend
- PWA-ready for mobile installation

## Features

- Email/password authentication with role-based access
- Mobile-first, responsive design
- Complete data model for hunts, puzzles, and player progress
- PWA capabilities for native-like mobile experience
- Secure Row Level Security policies

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # Navigation and layout components
│   └── ui/           # shadcn/ui components
├── lib/              # Utilities and auth logic
├── pages/            # Route pages
│   ├── player/       # Player dashboard
│   ├── host/         # Host dashboard
│   └── admin/        # Super admin panel
└── integrations/     # Lovable Cloud integration
```

## Documentation

- [DATA_MODEL.md](./DATA_MODEL.md) - Complete database schema
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview

## Next Steps

Future features will include:
- Hunt builder interface
- QR code generation and scanning
- AI-powered story generation
- Payment processing
- Real-time multiplayer
- Analytics dashboard
