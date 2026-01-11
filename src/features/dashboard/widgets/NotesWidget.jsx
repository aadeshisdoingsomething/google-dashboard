import React, { useState } from 'react';
import { 
  Box, IconButton, Fab, useTheme, Fade, Stack, Typography, Paper, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button 
} from '@mui/material';
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import { useSettings } from '../../../context/SettingsContext';

import TextBlock from './components/TextBlock';
import TableBlock from './components/TableBlock';

const NotesWidget = () => {
  const theme = useTheme();
  const { notesBlocks, setNotesBlocks } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  
  // State for Deletion Confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const addBlock = (type) => {
    const newBlock = type === 'text' 
      ? { id: Date.now(), type: 'text', content: '' }
      : { id: Date.now(), type: 'table', colCount: 2, rows: [{ id: 'r1', c1: '', c2: '' }] };
    setNotesBlocks([...notesBlocks, newBlock]);
    setFabOpen(false);
    handleSave();
  };

  const updateBlock = (id, newData) => {
    setNotesBlocks(notesBlocks.map(b => b.id === id ? { ...b, ...newData } : b));
    handleSave();
  };

  const requestDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      setNotesBlocks(notesBlocks.filter(b => b.id !== confirmDeleteId));
      handleSave();
      setConfirmDeleteId(null);
    }
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...notesBlocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setNotesBlocks(newBlocks);
    handleSave();
  };

  const FabAction = ({ label, icon, onClick }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
      <Paper sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: 2 }}>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
      </Paper>
      <Fab size="small" onClick={onClick} sx={{ bgcolor: theme.palette.background.paper }}>
        {icon}
      </Fab>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, pb: 12 }}>
        {notesBlocks.map((block, index) => (
          <Box key={block.id} sx={{ position: 'relative', mb: 1, pr: 0 }}>
            {/* Block Controls */}
            <Box sx={{ 
                position: 'absolute', right: 0, top: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5,
                zIndex: 10, px: 0.5
              }}>
              <IconButton size="small" onClick={() => moveBlock(index, -1)} disabled={index === 0} 
                sx={{ bgcolor: 'background.paper', boxShadow: 1, width: 32, height: 32, opacity: index === 0 ? 0 : 1, border: `1px solid ${theme.palette.divider}` }}>
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
              
              <IconButton size="small" onClick={() => requestDelete(block.id)} 
                sx={{ bgcolor: 'background.paper', boxShadow: 1, width: 32, height: 32, color: 'error.main', border: `1px solid ${theme.palette.divider}` }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
              
              <IconButton size="small" onClick={() => moveBlock(index, 1)} disabled={index === notesBlocks.length - 1} 
                sx={{ bgcolor: 'background.paper', boxShadow: 1, width: 32, height: 32, opacity: index === notesBlocks.length - 1 ? 0 : 1, border: `1px solid ${theme.palette.divider}` }}>
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ pr: 6 }}> 
              {block.type === 'text' 
                ? <TextBlock block={block} updateBlock={updateBlock} />
                : <TableBlock block={block} updateBlock={updateBlock} />
              }
            </Box>
          </Box>
        ))}
        
        {notesBlocks.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, fontStyle: 'italic' }}>
            Empty note. Tap + to add content.
          </Typography>
        )}
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', px: 3, zIndex: 10 }}>
        <Fade in={true}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: isSaving ? 'primary.main' : 'text.disabled' }}>
            <CloudDoneRoundedIcon sx={{ fontSize: 16, opacity: isSaving ? 1 : 0.5 }} />
            <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
              {isSaving ? 'SYNCING...' : 'SAVED'}
            </Typography>
          </Box>
        </Fade>
      </Box>

      <Stack direction="column" alignItems="flex-end" spacing={2} sx={{ position: 'absolute', bottom: 56, right: 24, zIndex: 20 }}>
        <Fade in={fabOpen} unmountOnExit>
          <Stack spacing={2} alignItems="flex-end" sx={{ mb: 1 }}>
            <FabAction label="Add Table" icon={<TableViewRoundedIcon color="primary" />} onClick={() => addBlock('table')} />
            <FabAction label="Add Text" icon={<TextFieldsRoundedIcon color="primary" />} onClick={() => addBlock('text')} />
          </Stack>
        </Fade>
        <Fab color="primary" onClick={() => setFabOpen(!fabOpen)} sx={{ boxShadow: theme.shadows[4], transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: '0.2s' }}>
          <AddRoundedIcon />
        </Fab>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Delete this block?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disableElevation>Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default NotesWidget;