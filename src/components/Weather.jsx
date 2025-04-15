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

const Weather = () => {

    const inputRef=useRef()

    const[weatherData,setWeatherData]=useState(false);

    const allicons={
        "01d":sunny,
    "01n ":sunny,
    "02d" :cloudy,
    "02n" :cloudy,
    "03d" :storm,
    "03n" :storm,
    "04d" :drizzle,
    "04n" :drizzle,
    "09d" :rainy,
    "09d" :rainy,
     "10d" :rainy,
    "10d" :rainy,
     "13d" :snowflake,
    "13d" :snowflake,}

    const search =async(city) =>{
        if(city === ""){
            alert ("Enter City Name");
            return ;
        }
        try{
            const url=`https://api.openweathermap.org/data/2.5/weather?q=${city} &units=metric & appid=${import.meta.env.VITE_APP_ID}`;

            const response=await fetch(url);
              
            const data=await response.json();

            if(!response.ok){
                alert(data.message);
                return;
            }
            console.log(data);
            const icon=allicons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity:data.main.humidity,
                windSpeed : data.wind.speed,
                temperature:Math.floor(data.main.temp),
                location:data.name,
                icon: icon

            })
        }catch(error){
      setWeatherData(false)
      console.error("Error in fetching weather data");
        }
    }

    useEffect(()=>{
        search("Gorakhpur")
    },[])
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Search'/>
            <img src={serch_icon} alt='' height='50' width={50} onClick={()=>
                search(inputRef.current.value)
            }/>
        </div>
     <img src={weatherData.icon} alt='' className='weather-icon'/>
     <p className='temperature'>{weatherData.temperature}</p>
     <p className='location'>{weatherData.location}</p>
     <div className='weather-data'>
        <div className='col'>
            <img src={humidity} alt="" width={50} height={50}/>
            <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
            </div>
        </div>
        <div className='col'>
            <img src={wind} alt="" width={50} height={50}/>
            <div>
                <p>{weatherData.windSpeed} Km/hr</p>
                <span>windSpeed</span>
            </div>
        </div>
     </div>
    </div>
  )
}

export default Weather
