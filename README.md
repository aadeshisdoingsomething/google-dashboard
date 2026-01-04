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
│   │       ├── widgets/
│   │       │   ├── CalendarWidget.jsx
│   │       │   ├── ClockWidget.jsx
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
