import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'
import serch_icon from '../assets/search.png'
import drizzle from '../assets/cloudy (1).png'
import sunny from '../assets/sun.png'
import rainy from '../assets/rainy.png'
import humidity from '../assets/humidity.png'
import cloudy from '../assets/cloudy.png'
import storm from '../assets/storm.png'
import wind from '../assets/wind.png'
import snowflake from '../assets/snowflake.png'
import uv from '../assets/uv.png'
import wd from '../assets/windy.png'
import ap from '../assets/pressure-gauge.png'
import vv from '../assets/visibility.png'
import { useLocation } from './location'
import Modal from './Modal';
import './Modal.css';


const Weather = ({city}) => {
  const location = useLocation();
  const inputRef = useRef();
  const [darkMode, setDarkMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [hourStartIndex, setHourStartIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const handleDataClick = () => {
    setShowModal(true);
  };
 const handleCloseModal = () => {
    setShowModal(false);
  };

const hoursPerSlide = 4;
const visibleHourly = hourlyForecast.slice(hourStartIndex, hourStartIndex + hoursPerSlide);
const handleNext = () => {
  if (hourStartIndex + hoursPerSlide < hourlyForecast.length) {
    setHourStartIndex(hourStartIndex + hoursPerSlide);
  }
};
const handlePrev = () => {
  if (hourStartIndex - hoursPerSlide >= 0) {
    setHourStartIndex(hourStartIndex - hoursPerSlide);
  }
};

const weatherCodeIcons = {
    1000: sunny,
    1100: sunny,
    1101: cloudy,
    1102: cloudy,
    2000: snowflake,
    4000: drizzle,
    4200: rainy,
    5000: snowflake,
    5100: snowflake,
    8000: storm
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=RLGsncXIlOr1wv2lhEtFgfuzhygl3Zup&units=metric`;
      const response = await fetch(url);
      const data = await response.json();


      if (!response.ok || !data.timelines) {
        alert("Unable to fetch weather data");
        return;
      }

      // Current Weather (from hourly[0])
      const current = data.timelines.hourly[0].values;
      const today = data.timelines.daily?.[0]?.values;
      const currentIcon = weatherCodeIcons[current.weatherCode] || sunny;


      //hourly forcecast
      const hourlyData = data.timelines.hourly.slice(0, 12).map(hour => {
        const values = hour.values;
        const icon = weatherCodeIcons[values.weatherCode] || sunny;
      
        return {
          time: new Date(hour.time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
          temperature: Math.floor(values.temperature),
          icon: icon,
          humidity: values.humidity,
          windSpeed: values.windSpeed,
        };
      });

      //current data
      setCurrentData({
        temperature: Math.floor(current.temperature),
        temperatureMin: Math.floor(today.temperatureMin), 
        temperatureMax: Math.floor(today.temperatureMax),
        humidity: current.humidity,
        windSpeed: current.windSpeed,
        windDirection: current.windDirection, 
        uvIndex: current.uvIndex,
        pressure: current.pressureSurfaceLevel, 
        visibility: current.visibility, 
        icon: currentIcon,
        location: data.location.name
      });

      // 5-day forecast
      const dailyData = data.timelines.daily.slice(0, 5).map(day => {
        const values = day.values;
        const icon = weatherCodeIcons[values.weatherCodeMax] || sunny;
        return {
          date: new Date(day.time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: Math.floor(values.temperatureMax),
          humidity: values.humidityAvg,
          windSpeed: values.windSpeedAvg,
          icon: icon
        };
      });
      setHourlyForecast(hourlyData);
      setForecastData(dailyData);
    } catch (error) {
      console.error("Error fetching Tomorrow.io data:", error);
      setCurrentData(null);
      setForecastData([]);
      setHourlyForecast([]);
    }
  }

  useEffect(() => {
    if (!city) return;
  
    if (city === "current") {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const loc = `${position.coords.latitude},${position.coords.longitude}`;
        await search(loc);
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to access location. Please allow location access or search manually.");
      });
    } else {
      search(city);
    }
  }, [city]);
  

  return (
    <div className={darkMode ? 'weather dark' : 'weather light'}>
    <div className='weather'>
      <div className='search-bar'>
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              search(inputRef.current.value);
            }
          }}
          ref={inputRef}
          type="text"
          placeholder='Search'
        />
        <img
          src={serch_icon}
          alt=''
          height='50'
          width={50}
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {currentData ? (
        <>
        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

          <div className='current-weather'>
            <h2>{currentData.location}</h2>
            <img src={currentData.icon} alt='Current' className='weather-icon'width={60} height={60} />
            <p className='temperature'>{currentData.temperature}°C</p>
            <div className='temp'>
            <div>Max: {currentData.temperatureMax}°C</div>
            <div>Min: {currentData.temperatureMin}°C</div>
            </div></div>

            <h3>Hourly Forecast</h3>
           <div className="hourly-tab-wrapper">
           <button onClick={handlePrev} disabled={hourStartIndex === 0}>‹</button>
           <div className="hourly-tab-table">
           {visibleHourly.map((hour, index) => (
           <div className="hour-tab-cell" key={index}>
           <p>{hour.time}</p>
           <img src={hour.icon} alt="weather" width={40} />
           <p>{hour.temperature}°C</p>
           </div>
          ))}
            </div>
          <button onClick={handleNext} disabled={hourStartIndex + hoursPerSlide >= hourlyForecast.length}>›</button>
          </div>

            {/*weather data oclick display method */}
            <div className='weather-data' onClick={handleDataClick} style={{ cursor: 'pointer' }}>
              < div className='col'>
              <h4>Humidity</h4>
             <img src={humidity} alt="" width={30} />
                <p>{currentData.humidity}%</p>
              </div>
              <div className='col'>
              <h4>Wind Speed</h4>
                <img src={wind} alt="" width={30} />
                <p>{currentData.windSpeed} Km/h</p>
              </div>
              <div className='col'>
              <h4>UV Index</h4>
              <img src={uv} alt="" width={30} />
              <p>{currentData.uvIndex}</p>
               </div>
               <div className='col'>
               <h4>Wind Direc.</h4>
               <img src={wd} alt="" width={30} />
               <p>{currentData.windDirection}°</p>
              </div>
              <div className='col'>
              <h4>Pressure</h4>
              <img src={ap} alt="" width={30} />
              <p>{currentData.pressure} hPa</p>
              </div>
              <div className='col'>
              <h4>Visibility</h4>
              <img src={vv} alt="" width={30} />
              <p>{currentData.visibility} km</p>
              </div></div>

          <Modal show={showModal} onClose={handleCloseModal}>
        <h2>Detailed Weather for {city}</h2>
        <p>Temperature: 25°C</p>
        <p>Humidity: 60%</p>
        <p>Wind Speed: 10 km/h</p>
      </Modal>
          {/*end of weather data display */}

          <h3>5-Day Forecast</h3>
          <div className='forecast-container'>
            {forecastData.map((day, index) => (
              <div className='forecast-card' key={index}>
                <p className='forecast-date'>{day.date}</p>
                <img src={day.icon} alt='' className='forecast-icon' />
                <p className='temperature'>{day.temperature}°C</p>
                <div className='weather-f'>
                  <div className='col'>
                    <img src={humidity} alt="" width={30} />
                    <p>{day.humidity}%</p>
                  </div>
                  <div className='col'>
                    <img src={wind} alt="" width={30} />
                    <p>{day.windSpeed} Km/h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div></div>
  );
}

export default Weather;
