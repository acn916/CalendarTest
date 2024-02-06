import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {
  EditingState,
  IntegratedEditing,
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  ViewSwitcher,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';
import { appointments as demoAppointments } from './demo-data/month-appointments';
import CustomBasicLayout from './CustomAppointmentForm';



const Demo = () => {
  const [currentDate, setCurrentDate] = useState('2023-12-01');
  const [stylist, setStylist] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStylist, setCurrentStylist] = useState(null);

  useEffect(() => {
    axios.get('https://f3lmrt7u96.execute-api.us-west-1.amazonaws.com/appointments')
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          const [year, month, day, hour, minute] = appointment.scheduled_at
            .match(/\d+/g)
            .map(Number);
  
          return {
            id: appointment.id,
            startDate: new Date(year, month - 1, day, hour, minute),
            endDate: new Date(year, month - 1, day, hour + 1, minute),
            title: `Client ID: ${appointment.client_id}`,
          };
        });
  
        setAppointments(formattedAppointments);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    axios.get('https://f3lmrt7u96.execute-api.us-west-1.amazonaws.com/get_all_staff')
      .then(response => {
        setStylist(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
    });

    console.log(appointments);
    console.log(stylist);

  }, []);

  const Content = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <div style={{ marginLeft: '20px' }}>
        <strong>Client ID:</strong> {appointmentData.client_id}<br />
        <strong>Staff ID:</strong> {appointmentData.staff_id}<br />
        <strong>Service ID:</strong> {appointmentData.service_id}<br />
        <strong>Scheduled At:</strong> {appointmentData.scheduled_at}<br />
      </div>
    </AppointmentTooltip.Content>
  );

  const commitChanges = ({ added, changed, deleted }) => {
    setAppointments((prevData) => {
      let updatedData = [...prevData];

      if (added) {
        console.log("Added!");
        const startingAddedId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
        updatedData = [...prevData, { id: startingAddedId, ...added }];
      }

      if (changed) {
        console.log("Changed!");
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        );
      }

      if (deleted !== undefined) {
        console.log("Deleted!");
        updatedData = updatedData.filter((appointment) => appointment.id !== deleted);
      }

      return updatedData;
    });
  };


  const handleStylistChange = (event) => {
    const selectedStylistId = event.target.value;
    // You can perform any additional actions when a stylist is selected
    setCurrentStylist(selectedStylistId);
  };



  const CustomToolbar = () => (
    <Toolbar.FlexibleSpace style={{ display: 'flex', alignItems: 'center' }}>
      <FormControl style={{ marginRight: '20px', width: '150px' }}>
        <Select
          labelId="stylist-select-label"
          id="stylist-select"
          value={currentStylist || 'All'}  // Set initial value to 'All'
          onChange={handleStylistChange}
        >
          <MenuItem value="All">
            <em>All</em>
          </MenuItem>
          {stylist.map((stylistItem) => (
            <MenuItem key={stylistItem.id} value={stylistItem.id}>
              {stylistItem.first_name + " "  + stylistItem.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Toolbar.FlexibleSpace>
  );
  

  return (
    <Paper style={{marginTop:'20px'}}>

      <Scheduler 
        data={appointments} 
        height={660}
      >
        <ViewState             
          defaultCurrentDate={currentDate}
          defaultCurrentViewName="Week" />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView startDayHour={9} endDayHour={18} />
        <WeekView startDayHour={9} endDayHour={19} />
        <MonthView startDayHour={12} endDayHour={20} />

        <Toolbar flexibleSpaceComponent={CustomToolbar}/>
        
        <ViewSwitcher />
        <Appointments />
        <AppointmentTooltip 
          showCloseButton 
          showOpenButton 
          showDeleteButton 
          contentComponent={Content}
        />
        <AppointmentForm basicLayoutComponent={CustomBasicLayout} />
        <DateNavigator />
      </Scheduler>
      
    </Paper>
  );
};

export default Demo;
