import React, { createContext, useContext, useState } from "react";

const TravelContext = createContext();

export const useTravel = () => {
  return useContext(TravelContext);
};

export const TravelProvider = ({ children }) => {
  const [travelLogs, setTravelLogs] = useState([]);

  const value = {
    travelLogs,
    setTravelLogs,
  };

  return (
    <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
  );
};
