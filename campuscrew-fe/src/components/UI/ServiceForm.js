import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, MenuItem, Select, InputLabel,
  FormControl, IconButton, Stack, FormHelperText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { createServiceAsync } from '../../redux/slices/serviceSlice';

const AddServiceForm = () => {
  const dispatch = useDispatch();
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [category, setCategory] = useState('');
  const [imageURLs, setImageURLs] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);
  const [availability, setAvailability] = useState([{ hours: 0, minutes: 0, slots: [null] }]);

  const resetForm = () => {
    setServiceName('');
    setDescription('');
    setRate('');
    setCategory('');
    setImageURLs([]);
    setUploadImages([]);
    setAvailability([{ hours: 0, minutes: 0, slots: [null] }]);
  };

  const isDuplicateStartTime = (slots) => {
    const uniqueTimes = new Set(slots.map(slot => slot?.toISO()));
    return uniqueTimes.size !== slots.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!serviceName) {
      toast.error("Service Name is required.");
      return;
    }
    if (!description) {
      toast.error("Description is required.");
      return;
    }
    if (!rate) {
      toast.error("Rate is required.");
      return;
    }
    if (!category) {
      toast.error("Category is required.");
      return;
    }
    if (imageURLs.length === 0 && uploadImages.length === 0) {
      toast.error("Please provide at least one image URL or upload one image.");
      return;
    }

    for (const a of availability) {
      const max_hrs = parseFloat(a.hours) + parseFloat(a.minutes) / 60;
      if (!max_hrs) {
        toast.error("Max hours is required for all availability slots.");
        return;
      }
      if (isDuplicateStartTime(a.slots)) {
        toast.error("Duplicate start times found. Please ensure all start times are unique.");
        return;
      }
      for (const slot of a.slots) {
        if (!slot) {
          toast.error("Start time is required for all slots.");
          return;
        }
        if (slot < DateTime.now()) {
          toast.error("Start time cannot be earlier than today's date.");
          return;
        }
      }
    }

    // Data preparation
    const serviceData = {
      name: serviceName,
      description,
      rate: parseFloat(rate),
      category_id: parseInt(category),
      user_id: localStorage.getItem('user_id'),
      image_urls: imageURLs,
      availability: availability.map(a => ({
        max_hrs: parseFloat(`${a.hours}.${a.minutes.toString().padStart(2, '0')}`),
        avail_slots: a.slots.map(slot => slot.toFormat('yyyy-MM-dd HH:mm:ss'))
      }))
    };

    // Dispatch the async action
    try {
      await dispatch(createServiceAsync(serviceData)).unwrap();
      toast.success("Service created successfully!");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 900, mx: 'auto' }}>
        <ToastContainer />
        <Typography variant="h5" align="center">Add New Service</Typography>

        <TextField
          data-test="add-service-name"
          label="Service Name"
          variant="outlined"
          fullWidth
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <TextField
          data-test="add-service-description"
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          data-test="add-service-rate"
          label="Rate/hr"
          variant="outlined"
          type="number"
          fullWidth
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            data-test="add-service-category"
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="1">Photography</MenuItem>
            <MenuItem value="2">Catering</MenuItem>
            <MenuItem value="3">Carpooling</MenuItem>
            <MenuItem value="4">Plumbing</MenuItem>
            <MenuItem value="5">Gardening</MenuItem>
            <MenuItem value="6">Babysitting</MenuItem>
            <MenuItem value="7">Haircut and Makeup</MenuItem>
            <MenuItem value="8">Academics</MenuItem>
          </Select>
        </FormControl>

        <TextField
          data-test="add-service-image-urls"
          label="Image URLs"
          variant="outlined"
          fullWidth
          value={imageURLs.join(', ')}
          onChange={(e) => setImageURLs(e.target.value.split(',').map(url => url.trim()))}
          helperText="Enter comma-separated URLs"
        />

        {availability.map((a, index) => (
          <Box key={index}>
            <FormHelperText sx={{ mb: 1 }}>Enter time it takes for one session</FormHelperText>
            <Stack direction="row" spacing={3} alignItems="center">
              <TextField
                label="Hours"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={a.hours}
                data-test={`add-service-hours-${index}`}
                onChange={(e) => {
                  const updated = [...availability];
                  updated[index].hours = e.target.value;
                  setAvailability(updated);
                }}
              />
              <TextField
                label="Minutes"
                type="number"
                inputProps={{ min: 0, max: 59 }}
                value={a.minutes}
                data-test={`add-service-minutes-${index}`}
                onChange={(e) => {
                  const updated = [...availability];
                  updated[index].minutes = e.target.value;
                  setAvailability(updated);
                }}
              />
            </Stack>

            <FormHelperText sx={{ mb: 1, mt: 2 }}>Enter your available slots</FormHelperText>
            {a.slots.map((slot, slotIndex) => (
              <Stack key={slotIndex} id="slot-date" direction="row" spacing={1} alignItems="center">
                <DateTimePicker
                  label="Start Time"
                  
                  value={slot}
                  minDateTime={DateTime.now()} // Restrict past times
                  onChange={(date) => {
                    const updated = [...availability];
                    updated[index].slots[slotIndex] = date;
                    setAvailability(updated);
                  }}
                />
                {a.slots.length > 1 && (
                  <IconButton onClick={() => {
                    const updated = [...availability];
                    updated[index].slots.splice(slotIndex, 1);
                    setAvailability(updated);
                  }} 
                  data-test={`remove-slot-${index}-${slotIndex}`}
                  color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
            <IconButton onClick={() => {
              const updated = [...availability];
              updated[index].slots.push(null);
              setAvailability(updated);
            }}
            data-test={`add-slot-${index}`}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}

        <Button data-test={`submit-service-form`} variant="contained" color="primary" type="submit" fullWidth>Add Service</Button>
      </Box>
    </LocalizationProvider>
  );
};

export default AddServiceForm;
