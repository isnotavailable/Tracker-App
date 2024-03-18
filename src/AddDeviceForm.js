// AddDeviceForm.js

import React, { useState } from 'react';
import { TaskStatus } from './TaskStatus';
import { Link , useNavigate } from 'react-router-dom';
import './AddDeviceForm.css'; // Import the CSS file

const AddDeviceForm = ({ onAddDevice }) => {
  const [deviceName, setDeviceName] = useState('');
  const [userName, setUserName] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState(''); // Added description state

  const navigate = useNavigate();
 
  

  const handleSubmit = async (e) => {

   
    e.preventDefault();
    if (!deviceName || !userName || !taskStatus) {
      alert('Please fill in all required fields.');
      return;
    }


    try {
      const response = await fetch('http://localhost:8080/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceName,
          user: { username: userName },
          taskStatus,
          locations: [{ location }],
          activities: [
            {
              startTime,
              endTime,
              category: { categoryName },
            },
          ],
          description,
        }),
      });
      if (response.ok) {
        // Redirect to the device list page after successfully adding a device
        navigate('/'); // Assuming your device list is at the root path
      } else {
        console.error('Error adding device:', response.statusText);
      }
      
    } 
   
    catch (error) {
      console.error('Error adding device:', error.message);
    }

  };

  return (
    <div className="add-device-form">
      <h2>Add Device</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Device Name:
          <input type="text" className="form-input" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
        </label>

        <label className="form-label">
          User Name:
          <input type="text" className="form-input" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>

        <label className="form-label">
          Task Status:
          <select className="form-select" value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
            <option value="">Select Task Status</option>
            <option value={TaskStatus.NOT_STARTED}>NOT_STARTED</option>
            <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={TaskStatus.FINISHED}>FINISHED</option>
          </select>
        </label>
        <label className="form-label">
          Description:
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="form-label">
          Location:
          <input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label className="form-label">
          Start Time:
          <input type="text" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>

        <label className="form-label">
          End Time:
          <input type="text" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>

        <label className="form-label">
          Category Name:
          <input type="text" className="form-input" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        </label>

        
      
        <button type="submit" className="form-button">
          Add Device
        </button>


      
      </form>
     
    </div>
  );
};

export default AddDeviceForm;
