import React, { useState } from "react";
import Weather from "./components/Weather";
import "./App.css";

const App = () => {
  const [cityTabs, setCityTabs] = useState([
    { name: "Current Location", value: "current" }
  ]);
  const [selectedCity, setSelectedCity] = useState("current");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCity, setNewCity] = useState("");

  const addCityTab = (e) => {
    e.preventDefault();
    const trimmedCity = newCity.trim();
    if (trimmedCity && !cityTabs.find(tab => tab.value.toLowerCase() === trimmedCity.toLowerCase())) {
      setCityTabs([...cityTabs, { name: trimmedCity, value: trimmedCity }]);
      setSelectedCity(trimmedCity);
      setNewCity("");
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <h3>City Tabs</h3>
        {cityTabs.map((tab, index) => (
          <button
            key={index}
            className={`sidebar-tab ${tab.value === selectedCity ? "active" : ""}`}
            onClick={() => {
              setSelectedCity(tab.value);
              setSidebarOpen(false);
            }}
          >
            {tab.name}
          </button>
        ))}
        <form onSubmit={addCityTab} className="add-city-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="city-input"
          />
          <button type="submit" className="add-btn">➕ Add City</button>
        </form>
      </div>

      <div className="main-content">
        <Weather city={selectedCity} />
      </div>
    </div>
  );
};

export default App;
