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
├── .env
├── .gitignore
├── README.md
├── eslint.config.js
├── functions/
│   └── api/
│       └── npr.js
├── index.html
├── mychanges.txt
├── package-lock.json
├── package.json
├── password.md
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── context/
│   │   └── SettingsContext.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── PinPad.jsx
│   │   └── dashboard/
│   │       ├── Dashboard.jsx
│   │       ├── NavigationRail.jsx
│   │       ├── SettingsPanel.jsx
│   │       ├── TutorialDialog.jsx
│   │       ├── services/
│   │       │   ├── nprService.js
│   │       │   └── stations.js
│   │       ├── settings/
│   │       │   ├── CalendarHelpDialog.jsx
│   │       │   ├── CalendarSettings.jsx
│   │       │   ├── ClockSettings.jsx
│   │       │   ├── GeneralSettings.jsx
│   │       │   ├── InstallAppSection.jsx
│   │       │   ├── PageSettings.jsx
│   │       │   ├── SearchOverlay.jsx
│   │       │   └── WeatherSettings.jsx
│   │       └── widgets/
│   │           ├── CalendarWidget.jsx
│   │           ├── ClockWidget.jsx
│   │           ├── NewsWidget.jsx
│   │           ├── NotesWidget.jsx
│   │           ├── WeatherWidget.jsx
│   │           └── components/
│   │               ├── LiveVisualizer.jsx
│   │               ├── NewsLogo.jsx
│   │               ├── SourcePicker.jsx
│   │               ├── TableBlock.jsx
│   │               ├── TextBlock.jsx
│   │               └── Waveform.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useNewsPlayer.js
│   ├── index.css
│   ├── main.jsx
│   └── theme.js
├── tailwind.config.js
└── vite.config.js
```

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```



3.  **Run Development Server (with Cloudflare Functions):**
    ```bash
    npm run dev:cf
    ```
    *Note: This utilizes `wrangler` to simulate Cloudflare Pages Functions locally. The standard `npm run dev` will not properly route `/api` requests.*

4.  **Build for Production:**
    ```bash
    npm run build
    ```

#