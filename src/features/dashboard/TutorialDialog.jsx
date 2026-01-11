import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogActions, Button, Typography, Box, 
  MobileStepper, useTheme 
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

// Icons for visuals
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded'; // Rail
import RadioRoundedIcon from '@mui/icons-material/RadioRounded'; // News
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'; // Notes
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded'; // Settings

// FIX: Standard Import
import { useSettings } from '../../context/SettingsContext';

const steps = [
  {
    label: 'Welcome Home',
    description: 'This is your new personal dashboard. It runs offline-first and is designed to be your central hub.',
    icon: <Typography variant="h1">👋</Typography>,
  },
  {
    label: 'Navigation Rail',
    description: 'Use the bar on the left to switch between Pages (Home, Work, etc). You can create and customize these pages in Settings.',
    icon: <ViewSidebarRoundedIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
  },
  {
    label: 'Interactive Widgets',
    description: 'Widgets are smart! Click the "NPR" or "Radio" icon on the News widget to switch stations. Use the + button on Notes to add tables.',
    icon: <RadioRoundedIcon sx={{ fontSize: 80, color: '#D9352C' }} />,
  },
  {
    label: 'Customize Everything',
    description: 'Drag widgets by the top handle. Resize them using the bottom-right corner. Configure visibility and layouts in the Settings menu.',
    icon: <EditNoteRoundedIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
  },
  {
    label: 'Setup Calendar',
    description: 'To see your schedule, you need to paste your Google Calendar embed link. Let\'s go to settings to set that up now.',
    icon: <SettingsSuggestRoundedIcon sx={{ fontSize: 80, color: 'text.primary' }} />,
    action: 'open_settings'
  },
];

const TutorialDialog = ({ onOpenSettings }) => {
  const theme = useTheme();
  // FIX: Use the hook normally
  const { tutorialSeen, setTutorialSeen } = useSettings();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    setTutorialSeen(true);
  };

  const handleFinishAndOpenSettings = () => {
    setTutorialSeen(true);
    // Slight delay to allow dialog to close smoothly
    setTimeout(() => {
      if (onOpenSettings) onOpenSettings();
    }, 200);
  };

  // If already seen, don't render
  if (tutorialSeen) return null;

  const currentStep = steps[activeStep];

  return (
    <Dialog 
      open={!tutorialSeen} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{ 
        sx: { 
          borderRadius: '28px', 
          textAlign: 'center',
          overflow: 'hidden'
        } 
      }}
    >
      <DialogContent sx={{ pt: 5, pb: 2, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        
        {/* Animated Icon Area */}
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          {currentStep.icon}
        </Box>

        <Typography variant="h5" fontWeight={700}>
          {currentStep.label}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ px: 2, lineHeight: 1.6 }}>
          {currentStep.description}
        </Typography>

        {/* Special Action Button for Final Step */}
        {currentStep.action === 'open_settings' && (
          <Button 
            variant="contained" 
            disableElevation
            onClick={handleFinishAndOpenSettings}
            sx={{ mt: 2, borderRadius: 4, textTransform: 'none', fontWeight: 700 }}
          >
            Open Settings Now
          </Button>
        )}

      </DialogContent>

      <DialogActions sx={{ p: 0, flexDirection: 'column' }}>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ width: '100%', bgcolor: 'transparent', p: 2 }}
          nextButton={
            <Button size="small" onClick={activeStep === maxSteps - 1 ? handleFinish : handleNext}>
              {activeStep === maxSteps - 1 ? 'Done' : 'Next'}
              {activeStep === maxSteps - 1 ? <CheckRoundedIcon fontSize="small" sx={{ ml: 0.5 }} /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
};

export default TutorialDialog;