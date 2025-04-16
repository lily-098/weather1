import { LocationProvider } from './components/location';
import React from 'react'
import Weather from './components/Weather'

const App = () => {
  return (
    <div className='app'>
      <LocationProvider>
      <Weather/>
      </LocationProvider>
    </div>
  )
}

export default App
