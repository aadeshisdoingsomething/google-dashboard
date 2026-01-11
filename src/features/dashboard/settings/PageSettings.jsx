import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Paper 
} from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';

import { useSettings } from '../../../context/SettingsContext';

// Import the separated files
import PageEditor from './PageEditor';
import { INITIAL_LAYOUTS, INITIAL_WIDGETS, ICONS } from './layoutDefaults';

const PageSettings = () => {
  const { pages, addPage, updatePage, deletePage, activePageId } = useSettings();
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Track page count for auto-navigation
  const prevCount = useRef(pages.length);

  // --- 1. HANDLE NEW PAGE CREATION ---
  const handleAdd = () => {
    // Attempt to pass the "Nice Layout" directly to addPage
    addPage('New Page', 'General', {
      layouts: INITIAL_LAYOUTS,
      widgets: INITIAL_WIDGETS
    });
  };

  // --- 2. AUTO-OPEN NEW PAGES & SAFETY CHECK ---
  useEffect(() => {
    if (pages.length > prevCount.current) {
      const newPage = pages[pages.length - 1];
      if (newPage) {
        setEditingId(newPage.id);

        // Safety Net: If addPage didn't accept the 3rd arg, patch it now.
        const hasLayouts = newPage.layouts && Object.keys(newPage.layouts).length > 0;
        if (!hasLayouts) {
           updatePage(newPage.id, { 
             layouts: INITIAL_LAYOUTS, 
             widgets: INITIAL_WIDGETS 
           });
        }
      }
    }
    prevCount.current = pages.length;
  }, [pages, updatePage]);

  // --- 3. DELETE LOGIC ---
  const confirmDelete = () => {
    if (deleteConfirmId) {
      deletePage(deleteConfirmId);
      if (editingId === deleteConfirmId) setEditingId(null);
      setDeleteConfirmId(null);
    }
  };

  // --- 4. RENDER: EDITOR VIEW ---
  if (editingId) return (
    <>
      <PageEditor 
        pageId={editingId} 
        onBack={() => setEditingId(null)} 
        onDeleteRequest={setDeleteConfirmId} 
      />
      
      {/* Delete Dialog (Shared) */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Page?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this page? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disableElevation>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // --- 5. RENDER: LIST VIEW ---
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="primary" fontWeight={700}>My Pages</Typography>
        <Button size="small" startIcon={<AddCircleOutlineRoundedIcon />} onClick={handleAdd} sx={{ textTransform: 'none' }}>Add Page</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {pages.map((page) => {
          const Icon = ICONS.find(i => i.id === page.icon)?.icon || <WidgetsRoundedIcon />;
          const isActive = page.id === activePageId;

          return (
            <Paper 
              key={page.id}
              elevation={0}
              onClick={() => setEditingId(page.id)}
              sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 2,
                borderRadius: 3, border: `1px solid ${isActive ? 'transparent' : 'rgba(128,128,128,0.2)'}`,
                bgcolor: isActive ? 'primary.main' : 'background.paper',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
              }}
            >
              {React.cloneElement(Icon, { color: 'inherit' })}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>{page.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {isActive ? 'Active Page' : 'Tap to edit'}
                </Typography>
              </Box>
              <EditRoundedIcon fontSize="small" sx={{ opacity: 0.7 }} />
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default PageSettings;