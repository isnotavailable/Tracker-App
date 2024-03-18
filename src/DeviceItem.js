import React, { useState, useEffect } from 'react';
import { TaskStatus } from './TaskStatus';
import './DeviceItem.css';

const DeviceItem = ({ device, onDelete, onEdit }) => {
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  

  const [editedDevice, setEditedDevice] = useState({
    deviceName: '',
    userName: '',
    taskStatus: '',
    location: '', // Assuming you want to update location
    startTime: '',
    endTime: '',
    categoryName: '',
    description:'',
  });

  // Static array of task status options
  const taskStatusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'FINISHED'];

  useEffect(() => {
    // Set initial state when device data is available
    if (device) {
      setEditedDevice((prev) => ({
        ...prev,
        deviceName: device.deviceName,
        userName: device.user ? device.user.username : '',
        taskStatus: device.taskStatus || '',
        location: device.locations && device.locations.length > 0 ? device.locations[0].location : '',
        startTime: device.activities && device.activities.length > 0 ? device.activities[0].startTime : '',
        endTime: device.activities && device.activities.length > 0 ? device.activities[0].endTime : '',
        categoryName: device.activities && device.activities.length > 0 ? device.activities[0].category.categoryName : '',
        description:device.description || '',
      }));
    }
  }, [device]);


  const handleEdit = () => {
    setEditFormOpen(true);
  };

  const handleEditCancel = () => {
    setEditFormOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!device || !device.id) {
      console.error('Invalid device data');
      return;
    }
    console.log('Submitting edit form with editedDevice:', editedDevice);
    try {
      console.log('Submitting edit form...');

      const response = await fetch(`http://localhost:8080/api/devices/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: device.id,
          deviceName: editedDevice.deviceName,
          description:editedDevice.description,
          taskStatus: editedDevice.taskStatus.toUpperCase(),
          user: {
            id: device.user.id,
            username: editedDevice.userName,
          },
          locations: editedDevice.location
            ? [
                {
                  id: device.locations[0]?.id || null,
                  location: editedDevice.location || '',
                  timestamp: device.locations[0]?.timestamp || null,
                },
              ]
            : [],
          activities: editedDevice.startTime && editedDevice.endTime && editedDevice.categoryName
            ? [
                {
                  id: device.activities[0]?.id || null,
                  startTime: editedDevice.startTime || '',
                  endTime: editedDevice.endTime || '',
                  device: device.id,
                  category: {
                    id: device.activities[0]?.category.id || null,
                    categoryName: editedDevice.categoryName || '',
                  },
                },
              ]
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update device. Status: ${response.status}`);
      }

      const updatedDevice = await response.json();
      console.log('Updated device data:', updatedDevice);

      onEdit(device.id, updatedDevice);
      
      setEditFormOpen(false);
    } catch (error) {
      console.error('Error editing device:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Setting ${name} to:`, value);

    setEditedDevice((prev) => ({
      ...prev,
      [name]: name === 'taskStatus' ? value.toUpperCase() : value,
    }));

  };

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this device?');

    if (confirmDelete) {
      onDelete(device.id);
    }
  };

  return (
    <div className="device-card">
      {!isEditFormOpen && (
        <div className="device-card__header">
          <h3>{device.deviceName}</h3>
          <div className="device-card__actions">
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
            <button type="button" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="device-card__details">
        <p>
          <strong>User:</strong> {device.user ? device.user.username : 'N/A'}
        </p>
        <p>
          <strong>Task Status:</strong> {device.taskStatus || 'N/A'}
        </p>
        <p>
          <strong>Description:</strong> {device.description || 'N/A'}
        </p>
        <div>
          <p>
            <strong>Locations:</strong>
          </p>
          <ul>
            {device.locations.map((location) => (
              <li key={location.id}>{location.location}</li>
            ))}
          </ul>
        </div>

        <div>
          <p>
            <strong>Activities:</strong>
          </p>
          <ul>
            {device.activities.map((activity) => (
              <li key={activity.id}>
                <strong>Start Time:</strong> {activity.startTime}, <strong>End Time:</strong> {activity.endTime},{' '}
                <strong>Category:</strong> {activity.category.categoryName}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isEditFormOpen && (
        <form className="device-card__edit-form" onSubmit={handleEditSubmit}>
          <label>
            Device Name:
            <input
              type="text"
              name="deviceName"
              value={editedDevice.deviceName}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <label>
            User Name:
            <input
              type="text"
              name="userName"
              value={editedDevice.userName}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

            <label>
            Task Status:
            <select
              name="taskStatus"
              value={editedDevice.taskStatus}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select Task Status</option>
              {taskStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={editedDevice.description}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={editedDevice.location}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <label>
            Start Time:
            <input
              type="text"
              name="startTime"
              value={editedDevice.startTime}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <label>
            End Time:
            <input
              type="text"
              name="endTime"
              value={editedDevice.endTime}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <label>
            Category Name:
            <input
              type="text"
              name="categoryName"
              value={editedDevice.categoryName}
              onChange={handleInputChange}
              className="input-field"
            />
          </label>

          <div className="button-group">
            <button type="button" onClick={handleEditCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DeviceItem;
