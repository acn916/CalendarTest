import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const CustomStyledLayout = (props) => {
  const { appointmentData, onFieldChange, ...restProps } = props;

  return (
    <Box>
      <div>
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          fullWidth
          value={appointmentData.title || ''}
          onChange={(e) => onFieldChange({ title: e.target.value })}
        />
      </div>

      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={appointmentData.startDate || null}
            onChange={(date) => onFieldChange({ startDate: date })}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
        </LocalizationProvider>
      </div>

      <div>
        {/* Add other fields as needed */}
      </div>
    </Box>
  );
};

export default CustomStyledLayout;
