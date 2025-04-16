import { useState, useEffect, useContext, createContext } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocation(data);
        }
      })
      .catch(error => console.error("Fetch nhi ho raha", error));
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};
