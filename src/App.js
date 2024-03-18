import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeviceList from './DeviceList';
import AddDeviceForm from './AddDeviceForm';
import NavigationBar from './NavigationBar';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedDevices, setSearchedDevices] = useState([]);
  const [error, setError] = useState(null);

  
  const fetchDevicesBySearch = async (query) => {
    try {
      console.log('fetchDevicesBySearch called with query:', query);

      const response = await fetch(`http://localhost:8080/api/devices/search?keyword=${query}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch devices. Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchedDevices(data);
      setError(null); // Reset error state if there was a previous error
    } catch (error) {
      console.error('Error fetching devices:', error.message);
      setSearchedDevices([]); // Set an empty array in case of an error
      setError(error.message);
    }
  };

  return (
    <Router>
      <div>
      <NavigationBar onSearch={fetchDevicesBySearch} />
        <Routes>
          <Route path="/add" element={<AddDeviceForm />} />
          <Route
            path="/"
            element={<DeviceList devices={searchedDevices} searchQuery={searchQuery} error={error} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
