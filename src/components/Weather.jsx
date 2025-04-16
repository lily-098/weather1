import React, { useEffect, useState ,useRef} from 'react'
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
import { useLocation } from './location'

const Weather = () => {
  const location = useLocation();
    const inputRef=useRef()

    const[weatherData,setWeatherData]=useState(false);


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
    
            const daily = data.timelines.daily[0].values;
    
            // WeatherCode icon mapping
            const weatherCodeIcons = {
                1000: sunny,
                1100: sunny,
                1101: cloudy,
                1102: cloudy,
                2000: snowflake,
                4000: drizzle,
                4200: rainy,
                5000: snowflake,
                8000: storm
            };
    
            const icon = weatherCodeIcons[daily.weatherCode] || sunny ;
    
            setWeatherData({
                humidity: daily.humidityAvg,
                windSpeed: daily.windSpeedAvg,
                temperature: Math.floor(daily.temperatureMax),
                location: data.location.name,
                icon: icon
            });
        } catch (error) {
            console.error("Error fetching Tomorrow.io data:", error);
            setWeatherData(false);
        }
    }
    useEffect(()=>{
       if(location && location.city){
        search(location.city);
       }
    },[location]);
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Search'/>
            <img src={serch_icon} alt='' height='50' width={50} onClick={()=>
                search(inputRef.current.value)
            }/>
        </div>
        {weatherData ? (
  <>
    <img src={weatherData.icon} alt='' className='weather-icon' />
    <p className='temperature'>{weatherData.temperature}°C</p>
    <p className='location'>{weatherData.location}</p>
    <div className='weather-data'>
      <div className='col'>
        <img src={humidity} alt="" width={50} height={50} />
        <div>
          <p>{weatherData.humidity} %</p>
          <span>Humidity</span>
        </div>
      </div>
      <div className='col'>
        <img src={wind} alt="" width={50} height={50} />
        <div>
          <p>{weatherData.windSpeed} Km/hr</p>
          <span>Wind Speed</span>
        </div>
      </div>
    </div>
  </>
) : (
  <p>Loading weather data...</p>
)}

    </div>
  )
}

export default Weather
