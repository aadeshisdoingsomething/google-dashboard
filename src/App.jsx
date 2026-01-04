import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { getTheme } from './theme';
import Dashboard from './features/dashboard/Dashboard';
import PinPad from './features/auth/PinPad'; // Assuming you have authentication logic here

// Inner App component to consume the Context
const AppContent = () => {
  const { effectiveTheme } = useSettings();
  const theme = getTheme(effectiveTheme);
  
  // Example Auth State (Simple version)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <PinPad onUnlock={() => setIsAuthenticated(true)} />
      )}
    </ThemeProvider>
  );
};

// Main Entry
function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;