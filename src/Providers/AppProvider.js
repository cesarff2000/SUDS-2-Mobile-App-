import React, { useState } from 'react';


export const AppContext = React.createContext();
export const GOOGLE_MAPS_APIKEY = 'AIzaSyDC6TqkoPpjdfWkfkfe641ITSW6C9VSKDM';

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [notificationPopup, setNotificationPopup] = useState(false)
  const [newJobRequestId, setNewJobRequestId] = useState(false)

  return <AppContext.Provider value={
    {
      loading,
      setLoading,
      notificationPopup,
      setNotificationPopup,
      newJobRequestId,
      setNewJobRequestId
    }
  }>{children}</AppContext.Provider>;
};

export default AppProvider;
