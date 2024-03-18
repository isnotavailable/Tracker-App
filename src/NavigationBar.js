// NavigationBar.js
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);

    };
  
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search form submitted');
        console.log('Searching for:', searchTerm);
        onSearch(searchTerm);
      };
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            Device List
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/add" className="navbar-link">
            Add Device
          </Link>
        </li>
        <li className="navbar-item">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
