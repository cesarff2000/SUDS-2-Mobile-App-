import React, { useState } from 'react';


export const AppContext = React.createContext();
export const GOOGLE_MAPS_APIKEY = 'AIzaSyB7qa8Uk4xxkHnrV6mGUCJrte7g9WH_hPA';

const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [notificationPopup, setNotificationPopup] = useState(false)
    const [newJobRequestId, setNewJobRequestId] = useState(false)
    const [changeNewJobfun, setchangeNewJobfun] = useState(false)

    return <AppContext.Provider value={
        {
            loading,
            setLoading,
            notificationPopup,
            setNotificationPopup,
            newJobRequestId,
            setNewJobRequestId,
            changeNewJobfun
        }
    }>{children}</AppContext.Provider>;
};

export default AppProvider;
