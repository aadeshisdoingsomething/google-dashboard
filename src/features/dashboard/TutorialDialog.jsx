import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogActions, Button, Typography, Box, 
  MobileStepper, useTheme 
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RadioRoundedIcon from '@mui/icons-material/RadioRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSettings } from '../../context/SettingsContext';

const steps = [
  {
    label: 'Welcome to Dashboard',
    description: 'Your personal home hub. Let\'s quickly show you around.',
    icon: <Typography variant="h1">👋</Typography>,
  },
  {
    label: 'Customize Layout',
    description: 'Drag widgets using the top handle. Resize them using the bottom-right corner.',
    icon: <DragIndicatorIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
  },
  {
    label: 'News & Radio',
    description: 'Tap the Station Icon (NPR/BBC) on the left of the widget to switch between News, Music, and Live Radio.',
    icon: <RadioRoundedIcon sx={{ fontSize: 80, color: '#D9352C' }} />,
  },
  {
    label: 'Setup Calendar',
    description: 'To see your events, go to Settings (top right) > Calendar and paste your Google Calendar Embed URL.',
    icon: <CalendarMonthIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
  },
];

const TutorialDialog = () => {
  const theme = useTheme();
  const { tutorialSeen, setTutorialSeen } = useSettings();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    setTutorialSeen(true);
  };

  // If already seen, don't render anything
  if (tutorialSeen) return null;

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
      <DialogContent sx={{ pt: 5, pb: 2, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        
        {/* Animated Icon Area */}
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          {steps[activeStep].icon}
        </Box>

        <Typography variant="h5" fontWeight={700}>
          {steps[activeStep].label}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
          {steps[activeStep].description}
        </Typography>

      </DialogContent>

      <DialogActions sx={{ p: 0, flexDirection: 'column' }}>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ width: '100%', bgcolor: 'transparent', p: 2 }}
          nextButton={
            <Button size="small" onClick={activeStep === maxSteps - 1 ? handleFinish : handleNext} disabled={false}>
              {activeStep === maxSteps - 1 ? 'Finish' : 'Next'}
              <KeyboardArrowRight />
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