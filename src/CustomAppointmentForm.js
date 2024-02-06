//Laura made changes to all of
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const CustomStyledLayout = (props) => {
  const { appointmentData, onFieldChange, ...restProps } = props;
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);

  const handleServiceChange = (event) => {
    setSelectedServices(event.target.value);
  };
/*
  const services = [
    'Haircut',
    'Coloring',
    'Styling',
    'Extensions',
    'Perm',
    // Add more services as needed
  ];

  */
  useEffect(() => {

    axios.get('https://f3lmrt7u96.execute-api.us-west-1.amazonaws.com/service')
      .then(response => {
        console.log(response);
        setServices(response.data);
        setLoading(false);
        console.log('Services:', response.data);
      })
      .catch(error => {
        console.error('Error Fetching Data', error);
        setLoading(false);
      })


  }, []);
  

  return (
    <Box marginLeft={'20px'}>
       <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '16px', marginTop: '16px' }}>
        Details
      </Typography>
      <div style={{ marginBottom: '16px', marginTop: "16px" }}>
        <TextField
          id="title"
          label="Name"
          variant="outlined"
          fullWidth
          value={appointmentData.title || ''}
          onChange={(e) => onFieldChange({ title: e.target.value })}
        />
      </div>

      <Box display="flex" alignItems="center">
        <div style={{ marginRight: '16px', flex: '1' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Date"
              value={appointmentData.startDate || null}
              onChange={(date) => onFieldChange({ startDate: date })}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </LocalizationProvider>
        </div>

        <div style={{ flex: '1' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Date"
              value={appointmentData.endDate || null}
              onChange={(date) => onFieldChange({ endDate: date })}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </LocalizationProvider>
        </div>
      </Box>

      <div style={{ marginTop: '16px' }}>
        <FormControl fullWidth>
          <InputLabel id="services-label">Select Services</InputLabel>
          <Select
            labelId="services-label"
            id="services"
            multiple
            value={selectedServices}
            onChange={handleServiceChange}
            label="Select Services"
          >
          {services.map((service) => (
            <MenuItem key={String(service.id)} value={String(service.name)}>
              {String(service.name)}
            </MenuItem>
          ))}


          </Select>
        </FormControl>
      </div>
    </Box>
  );
};

export default CustomStyledLayout;
