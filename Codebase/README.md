# FurnitureViz - 3D Room Design & Furniture Visualization

A modern web-based 3D room design application that allows users to create and visualize interior spaces with customizable furniture arrangements. Built with Next.js, React Three Fiber, and Firebase.

## 🔗 Links

- **GitHub Repository:** https://github.com/kngpathirana/FurnitureViz---HCI_Project---Group57.git
- **YouTube Demo:** [https://youtu.be/YOUR_VIDEO_ID](https://youtu.be/YOUR_VIDEO_ID)

## 👥 Group Members

| Name | Student ID |
|------|------------|
| P U N Pieris | 10952710 |
| Ginigaddarage Jayasri | 10953502 |
| Kavindu Pathirana | 10953487 |
| Rathnayake M Rathnayake | 10954925 |
| Samarathunga  Samarathunga | 10953558 |
| Karunarathna Karunarathna | 10953359 |


## Overview

FurnitureViz is an interactive room design tool that enables users to:

- Design rooms with customizable dimensions and colors
- Place and arrange 3D furniture models in real-time
- Switch between 2D floor plan and 3D visualization modes
- Save and manage multiple room designs
- Adjust furniture properties including size, position, rotation, and color

## Key Features

### Room Customization
- Adjustable room dimensions (width, length, height)
- Customizable wall and floor colors
- Multiple room shapes support (rectangle, square, L-shape)
- Real-time 3D preview

### Furniture Management
- Extensive furniture library including:
  - Chairs (Office, Armchair, Gaming)
  - Tables (Dining, Coffee, Desk)
  - Sofas and Couches
  - Beds (Single, Double, King)
  - Storage (Cabinets, Wardrobes, Bookshelves)
- Drag-and-drop furniture placement
- Real-time property editing (dimensions, color, position, rotation)
- Material selection (wood, fabric, leather, metal)

### Dual View Modes
- **2D Mode**: Top-down floor plan view for precise furniture placement
- **3D Mode**: Interactive 3D visualization with orbit controls

### Design Management
- Save and load room designs
- User authentication and personal design library
- Design history with undo functionality
- Grid snapping for precise positioning

## Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### 3D Graphics
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library
- **OBJ Loader** - 3D model loading

### State Management & Data
- **Zustand** - Lightweight state management
- **Firebase Firestore** - Cloud database for design storage
- **NextAuth.js** - Authentication solution
- **TanStack Query** - Data fetching and caching

### UI Components
- **shadcn/ui** - Accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Form Handling
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- Firebase project with Firestore enabled
- Firebase service account credentials

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd codebase

# Install dependencies
bun install
```

### Environment Setup

1. Create a `.env` file in the root directory
2. Add your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Firebase Configuration

```bash
# Deploy Firestore rules and indexes
./deploy-firestore.sh

# Or manually
firebase deploy --only firestore:rules,firestore:indexes
```

### Running the Application

```bash
# Development mode
bun run dev

# Production build
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── designs/         # Design CRUD operations
│   ├── dashboard/           # User dashboard
│   ├── editor/              # Main room editor
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── saved-designs/       # Saved designs gallery
├── components/              
│   ├── auth/                # Authentication components
│   ├── editor/              # Editor-specific components
│   │   ├── Canvas2D.tsx    # 2D floor plan canvas
│   │   ├── Canvas3D.tsx    # 3D visualization canvas
│   │   └── SaveDialog.tsx  # Design save dialog
│   ├── layout/              # Layout components
│   │   ├── Navigation.tsx  # Main navigation
│   │   ├── Sidebar.tsx     # Furniture library sidebar
│   │   └── PropertiesPanel.tsx  # Item property editor
│   └── ui/                  # Reusable UI components
├── data/
│   └── furniture.ts         # Furniture template definitions
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── auth.ts             # Authentication helpers
│   ├── db.ts               # Firestore client
│   └── firestore-helpers.ts # Database operations
├── store/
│   └── editorStore.ts      # Zustand editor state
└── types/
    └── index.ts            # TypeScript type definitions
```

## Core Components

### Canvas3D
Interactive 3D scene rendering with Three.js featuring:
- Orbit controls for camera manipulation
- Dynamic lighting and shadows
- Real-time furniture model loading
- Room environment rendering

### Canvas2D
Top-down 2D floor plan with:
- Grid-based layout
- Drag-and-drop furniture placement
- Precise dimension controls
- Snap-to-grid functionality

### PropertiesPanel
Real-time property editor for:
- Furniture dimensions (width, depth, height)
- Position coordinates (x, y, z)
- Rotation angle
- Color and material selection

### Sidebar
Furniture library browser with:
- Category-based organization
- Template selection
- Preview thumbnails
- Quick add functionality

## Available 3D Models

The application includes 3D furniture models in OBJ format:

- **Chairs**: Office chairs, armchairs, gaming chairs
- **Tables**: Dining tables, coffee tables, desks
- **Sofas**: Various sofa styles and sizes
- **Beds**: Single, double, and king-size beds
- **Cabinets**: Storage cabinets, wardrobes, bookshelves

Models are located in `/public/models/` organized by category.

## User Authentication

- Email/password authentication via NextAuth.js
- Protected routes for editor and dashboard
- User-specific design storage
- Session management

## Design Storage

Designs are stored in Firebase Firestore with the following structure:

```typescript
{
  id: string;
  name: string;
  description?: string;
  userId: string;
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  roomShape: 'rectangle' | 'square' | 'l-shape';
  wallColor: string;
  floorColor: string;
  furnitureItems: FurnitureItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Key Scripts

```bash
# Start development server with logging
bun run dev

# Run linting
bun run lint

# Build for production
bun run build

# Start production server
bun start
```

### State Management

The application uses Zustand for client-side state management. The editor store (`editorStore.ts`) manages:

- Current view mode (2D/3D)
- Room specifications
- Furniture items array
- Selected item tracking
- Grid settings
- Undo/redo history
- Unsaved changes tracking

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

WebGL support required for 3D rendering.

## License

This project is private and proprietary.

---

Built with Next.js, React Three Fiber, and Firebase.
