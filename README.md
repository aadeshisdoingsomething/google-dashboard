# Home M3 Dashboard

A personal home dashboard application built with React, Material UI, and Vite. Designed with Material You (M3) aesthetics, featuring a PIN-protected entry and a widget-based layout.

## Features

-   **PIN Protection:** Secure access with a numeric keypad.
-   **Dashboard:**
    -   Draggable and responsive widget layout (using `react-grid-layout`).
    -   **Clock Widget:** Displays current time and date.
    -   **Weather Widget:** Shows current weather conditions (using OpenWeatherMap API).
    -   **Calendar Widget:** Displays a calendar view.
    -   **Settings Panel:** Configure dashboard preferences.
-   **Theming:** Dark/Light mode support (currently set to Dark Mode) with Material Design 3 tokens.
-   **PWA Support:** Configured for installation as a standalone app on devices.

## Tech Stack

-   **Framework:** React + Vite
-   **UI Library:** MUI (Material UI) v7
-   **Layout:** React Grid Layout
-   **Styling:** Emotion (via MUI) + Tailwind CSS (configured)
-   **State/Storage:** Context API & Local Storage for persistence.

## Project Structure

```text
my-dashboard
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── context/
│   │   └── SettingsContext.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── PinPad.jsx
│   │   └── dashboard/
│   │       ├── settings/
│   │       │   ├── CalendarSettings.jsx
│   │       │   ├── ClockSettings.jsx
│   │       │   ├── GeneralSettings.jsx
│   │       │   ├── SearchOverlay.jsx
│   │       │   └── WeatherSettings.jsx
│   │       ├── widgets/
│   │       │   ├── CalendarWidget.jsx
│   │       │   ├── ClockWidget.jsx
│   │       │   ├── NewsWidget.jsx
│   │       │   └── WeatherWidget.jsx
│   │       ├── Dashboard.jsx
│   │       └── SettingsPanel.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── theme.js
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── password.md
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment:**
    Create a `.env` file in the root directory (or use the provided one) and add necessary variables:
    ```env
    VITE_OPENWEATHER_API_KEY=your_api_key_here
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## Configuration

-   **Weather Widget:** Ensure `VITE_OPENWEATHER_API_KEY` is set in your `.env` file.
-   **PIN Code:** Open `src/features/auth/PinPad.jsx` to change the default PIN (`1234`).

## AI Refactoring Prompt

Use the following prompt to guide an AI assistant in refactoring the codebase if

---

**Role:** Expert Software Architect specializing in React and Material Design 3.

**Project Context:**
I have a personal home dashboard application built with React and Vite. It currently uses Material UI (MUI) v7, React Grid Layout for widgets, and Tailwind CSS. The app features a PIN entry screen (`PinPad.jsx`) that gates access to the main dashboard (`Dashboard.jsx`), which contains widgets for Clock, Weather, Calendar, and News.

**Current File Structure:**
```text
my-dashboard
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── context/
│   │   └── SettingsContext.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── PinPad.jsx
│   │   └── dashboard/
│   │       ├── settings/
│   │       │   ├── CalendarSettings.jsx
│   │       │   ├── ClockSettings.jsx
│   │       │   ├── GeneralSettings.jsx
│   │       │   ├── SearchOverlay.jsx
│   │       │   └── WeatherSettings.jsx
│   │       ├── widgets/
│   │       │   ├── CalendarWidget.jsx
│   │       │   ├── ClockWidget.jsx
│   │       │   ├── NewsWidget.jsx
│   │       │   └── WeatherWidget.jsx
│   │       ├── Dashboard.jsx
│   │       └── SettingsPanel.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── theme.js
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── password.md
├── README.md
├── tailwind.config.js
└── vite.config.js
```

**Key Dependencies:**
- `react`, `react-dom`
- `@mui/material`, `@mui/icons-material` (MUI v7)
- `react-grid-layout`
- `tailwindcss`

**Goal:**
Refactor and simplify this application to use Google's Material Web Library.

**Specific Instructions:**
1.  **Simplify Styling:** Evaluate the current mix of MUI and Tailwind. The goal is to rely as much as possible on the "official" Material Design implementation provided by MUI v7 (or suggest a migration to `material-web` if that aligns better with "official" in your analysis, though MUI v7 is preferred for React). Remove redundant Tailwind classes if MUI's `sx` prop or theme capabilities can handle it more idiomaticly.
2.  **Refactor Components:** Ensure all widgets and components (`PinPad`, `Dashboard`) use proper M3 components (e.g., proper use of `Surface`, `Elevation`, `Typography` tokens).
3.  **Code Quality:** Clean up the folder structure if necessary and improve code readability.
4.  **Visuals:** Ensure the app looks and feels like a native Material You application (dynamic colors, rounded corners, large touch targets).

**Please provide a plan and then execute the refactoring.**

---