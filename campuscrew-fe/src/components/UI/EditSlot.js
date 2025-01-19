// src/components/EditSlotDialog.js
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { editSlotTiming } from '../redux/slices/serviceSlice';

const EditSlotDialog = ({ open, onClose, availabilityId, currentSlot }) => {
  const [slot, setSlot] = useState(currentSlot);
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(editSlotTiming({ availabilityId, updatedSlot: { avail_slots: slot } }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Slot</DialogTitle>
      <DialogContent>
        <TextField
          label="Slot Timing"
          type="datetime-local"
          fullWidth
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSlotDialog;
