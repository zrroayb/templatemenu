# Template Menu - Modern Menu Website

A beautiful, modern, and iconic menu website built with Next.js, featuring a soft design aesthetic inspired by Japandi and Neumorphic styles. Includes a professional admin dashboard for managing menu items and categories.

## Features

### Public Menu
- 🎨 Soft, iconic design with glassmorphism effects
- ✨ Smooth animations powered by Framer Motion
- 📱 Fully responsive design
- 🎯 Modern UI with soft shadows and organic shapes
- ⚡ Built with Next.js 14 and TypeScript
- 🎭 Beautiful typography with Playfair Display and Inter fonts

### Admin Dashboard
- 🔐 Secure admin authentication
- 📊 Real-time statistics dashboard
- ➕ Add, edit, and delete menu items
- 📁 Manage categories with custom icons
- 💾 LocalStorage persistence (ready for database integration)
- 🎨 Professional UI matching the soft design aesthetic
- 📱 Fully responsive admin interface

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

- **Public Menu**: Open [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: Open [http://localhost:3000/admin](http://localhost:3000/admin)
  - Demo password: `admin` or `admin123`

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Design Philosophy

This menu website embodies a soft, iconic aesthetic through:

- **Soft Color Palette**: Cream, beige, sage, and mist tones create a calming atmosphere
- **Glassmorphism**: Translucent cards with backdrop blur for depth
- **Organic Shapes**: Flowing background elements and rounded corners
- **Smooth Animations**: Gentle transitions and hover effects
- **Typography Hierarchy**: Elegant serif headings with clean sans-serif body text
- **Neumorphic Shadows**: Soft, multi-layered shadows for tactile depth

## Admin Dashboard Features

### Menu Management
- View all menu items organized by category
- Add new items with name, description, price, and tags
- Edit existing items
- Delete items with confirmation
- Real-time updates reflected on the public menu

### Category Management
- Create new categories
- Edit category names and icons
- Delete categories (with all items)
- Choose from predefined icon set

### Statistics
- Total menu items count
- Number of categories
- Average item price

## Data Storage

Currently, menu data is stored in:
- **Runtime**: In-memory with localStorage persistence
- **Ready for**: Easy migration to database/API

The data structure is centralized in `lib/menu-data.ts` for easy integration with backend services.

## Customization

### Menu Items
Manage menu items through the admin dashboard at `/admin/dashboard` or directly edit `lib/menu-data.ts`.

### Design System
The design system is built with Tailwind CSS and can be extended through the `tailwind.config.ts` file. Custom colors are defined in the `soft` palette.

### Authentication
Update the authentication logic in `app/admin/page.tsx` to integrate with your authentication system.

