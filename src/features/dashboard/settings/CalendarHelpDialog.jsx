import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, Alert, AlertTitle 
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const CalendarHelpDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Setup Google Calendar</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>Instructions:</Typography>
            <Typography variant="body2" paragraph>
              1. Open <b>Google Calendar</b> on a computer.
            </Typography>
            <Typography variant="body2" paragraph>
              2. Click the <b>Settings icon (gear)</b> {'>'} <b>Settings</b>.
            </Typography>
            <Typography variant="body2" paragraph>
              3. On the left sidebar, under <b>Settings for my calendars</b>, select the calendar you want to display.
            </Typography>
            <Typography variant="body2" paragraph>
              4. Scroll down to the <b>"Integrate calendar"</b> section.
            </Typography>
            <Typography variant="body2">
              5. Copy the code inside the box labeled <b>"Public URL to this calendar"</b> and paste it into the field in settings.
            </Typography>
          </Box>

          <Divider />

          <Alert severity="info" icon={<SecurityIcon fontSize="inherit" />} sx={{ alignItems: 'center' }}>
            <AlertTitle>Privacy & Security</AlertTitle>
            Your Calendar URL is stored <b>locally on this device</b>. It is never sent to any external server (other than Google's standard request to load the calendar). If you use this dashboard on another device, you will need to re-enter it.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" disableElevation>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarHelpDialog;