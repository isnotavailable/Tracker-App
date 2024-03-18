import React, { useState, useEffect } from 'react';
import DeviceItem from './DeviceItem';
import { TaskStatus } from './TaskStatus';

const DeviceList = ( {searchQuery}) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filteredDevices = devices.filter((device) =>
  device.deviceName.toLowerCase().includes(searchQuery)
);
  
  // Group devices by task status
const groupedDevices = devices.reduce((acc, device) => {
  const status = device.taskStatus || 'N/A';
  if (!acc[status]) {
    acc[status] = [];
  }
  acc[status].push(device);
  return acc;
}, {});
const fetchDevicesBySearch = async (query) => {
  try {
    const response = await fetch(`http://localhost:8080/api/devices/search?keyword=${query}`);
    console.log('Fetching devices with query:', query); // Log the query

    if (!response.ok) {
      throw new Error(`Failed to fetch devices. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Log the response
    setDevices(data);
  } catch (error) {
    console.error('Error fetching devices:', error.message);
    setError(error.message);
  }
};
useEffect(() => {
  const fetchData = async () => {
    try {
      const url = searchQuery
        ? `http://localhost:8080/api/devices/search?keyword=${searchQuery}`
        : 'http://localhost:8080/api/devices';

      console.log('Fetching from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch devices. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Log the fetched data
      setDevices(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [searchQuery]);


const handleDelete = async (deviceId) => {
    try {
      await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
        method: 'DELETE',
      });

      // Update the state after successful deletion
      setDevices(devices.filter((device) => device.id !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error.message);
    }
  };

  const handleEdit = async (deviceId, editedDevice) => {
    try {
      await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDevice),
      });

      // Update the state after successful edit
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === deviceId ? { ...device, ...editedDevice } : device
        )
      );
    } catch (error) {
      console.error('Error editing device:', error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(groupedDevices).map((status) => (
        <div key={status} style={{ marginRight: '20px' }}>
          <h2>{status}</h2>
          <ul>
            {groupedDevices[status].map((device) => (
              <DeviceItem
                key={device.id}
                device={device}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
