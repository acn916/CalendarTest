import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import axios from "axios";

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
import { appointments as demoAppointments } from './demo-data/month-appointments';
import CustomBasicLayout from './CustomAppointmentForm';




const Demo = () => {
  const [currentDate, setCurrentDate] = useState('2023-12-01');
 
  const[appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://f3lmrt7u96.execute-api.us-west-1.amazonaws.com/appointments')
      .then(response => {

        console.log(response);

        const formattedAppointments = response.data.map(appointment => {
          const [year, month, day, hour, minute] = appointment.scheduled_at
            .match(/\d+/g) // Extract numerical parts
            .map(Number); // Convert them to numbers
  
          return {
            id: appointment.id,
            startDate: new Date(year, month - 1, day, hour, minute), // Adjust month since it's zero-based
            endDate: new Date(year, month - 1, day, hour + 1, minute), // Assuming each appointment lasts 1 hour
            title: `Client ID: ${appointment.client_id}`, // Add more details as needed
            
          };
        });
  
        setAppointments(formattedAppointments);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  
  console.log(appointments);
  

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
        const startingAddedId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
        updatedData = [...prevData, { id: startingAddedId, ...added }];
      }

      if (changed) {
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        );
      }

      if (deleted !== undefined) {
        updatedData = updatedData.filter((appointment) => appointment.id !== deleted);
      }

      return updatedData;
    });
  };

  return (
    <Paper>
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

        <Toolbar />
        <ViewSwitcher />
        <Appointments />
        <AppointmentTooltip 
          showCloseButton 
          showOpenButton 
          showDeleteButton 
          contentComponent={Content}
        
        />
        <AppointmentForm basicLayoutComponent={CustomBasicLayout}
/>
        <DateNavigator />
      </Scheduler>
    </Paper>
  );
};

export default Demo;

