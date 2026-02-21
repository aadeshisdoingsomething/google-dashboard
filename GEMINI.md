# GEMINI.md - Home M3 Dashboard

This document provides context and guidelines for interacting with the Home M3 Dashboard project.

## Project Overview

Home M3 Dashboard is a personal home hub application designed for tablets and desktops, focusing on a clean, Material Design 3 (M3) aesthetic. It features a PIN-protected entry, a highly customizable multi-page dashboard system, and various utility widgets.

### Tech Stack
- **Framework:** React 19 (Vite-based)
- **UI Library:** MUI (Material UI) v7
- **Styling:** MUI Emotion + Tailwind CSS (v3)
- **State Management:** React Context API (via `SettingsContext.jsx`)
- **Layout:** `react-grid-layout` for draggable/resizable widgets
- **Persistence:** Browser LocalStorage (via `useLocalStorage.js` hook)
- **PWA:** Enabled via `vite-plugin-pwa` for standalone device installation

## Project Structure

- `src/features/dashboard/`: Core dashboard logic, navigation rail, and settings panel.
- `src/features/dashboard/widgets/`: Individual widget implementations (Clock, Weather, News, Notes, Calendar).
- `src/features/dashboard/settings/`: Components for configuring individual widgets and global settings.
- `src/features/auth/`: Contains the `PinPad.jsx` for entry security.
- `src/context/SettingsContext.jsx`: The "brain" of the application. Manages theme, global settings, and the multi-page system.
- `src/theme.js`: Defines the M3-inspired color palette and MUI component overrides.

## Key Architectures

### Page System
The dashboard supports multiple pages. Each page has:
- A unique ID, name, and icon.
- A set of active widgets (`widgets` object).
- Specific layouts for different screen sizes (`layouts` object compatible with `react-grid-layout`).

### Theming
The app supports 'light', 'dark', and 'auto' (time-based) modes. Theme tokens are defined in `src/theme.js` using MUI's `createTheme`. Custom border colors and border radii (28px) are used to match M3 specs.

### Persistence
All user configurations, including page layouts and widget settings, are stored in LocalStorage. Keys are versioned (e.g., `app_pages_v1`) to handle migrations safely.

### Cloudflare Pages Functions
The application utilizes Cloudflare Pages Functions (`functions/api/`) to act as a backend proxy for external services (like the NPR RSS feed). This bypasses browser CORS restrictions cleanly. Local development of these functions is supported via the `wrangler` CLI.

## Development Workflows

### Build & Run
- `npm install`: Install dependencies.
- `npm run dev:cf`: Start development server using Cloudflare Wrangler (Required to test `/api` proxy functions locally).
- `npm run dev`: Start standard Vite development server (Does not support Cloudflare Functions).
- `npm run build`: Production build.
- `npm run lint`: ESLint check.

### Adding a New Widget
1. Create the widget component in `src/features/dashboard/widgets/`.
2. Add a toggle in `src/features/dashboard/settings/PageSettings.jsx` (or a specific setting section).
3. Update `DEFAULT_WIDGET_CONFIG` and `DEFAULT_PAGE_LAYOUT` in `src/context/SettingsContext.jsx`.
4. Register the widget in `src/features/dashboard/Dashboard.jsx` within the `ResponsiveGridLayout`.

## Conventions & Rules

- **Strict Functional Components:** Use React functional components and hooks.
- **Styling Preference:** Use MUI's `sx` prop or styled-components for component-specific styling; use Tailwind for layout utility classes if necessary.
- **Material Design 3:** Adhere to M3 principles (rounded corners, specific color tokens, Google Sans font).
- **Iconography:** Use `Material Symbols Rounded` via MUI's `Icon` component.
- **No External State Libs:** Prefer Context API and LocalStorage for simplicity and offline-first capability.
- **Surgical Updates:** When modifying `SettingsContext.jsx`, ensure migration logic for legacy keys is preserved.
