import React, { useContext, useEffect, useState } from 'react';
import { Switch, View } from 'react-native';
import { AuthContext } from '../Providers/AuthProvider';

const TripSwitch = ({ headerTitle, status }) => {
  const [isEnabled, setIsEnabled] = useState(status == '1');
  const { setOnlineStatus } = useContext(AuthContext);
  const toggleSwitch = () => {
    setOnlineStatus(isEnabled ? '0' : '1').then(json => !json ? setIsEnabled(false) : null);
    setIsEnabled(previousState => !previousState);
  };

  useEffect(() => setIsEnabled(status == '1'), [status]);

  if (headerTitle == 'WELCOME' || headerTitle == 'EARNING' || headerTitle == undefined)
    return (
      <Switch
        style={{ marginRight: 10 }}
        trackColor={{ false: '#777', true: '#fa5' }}
        thumbColor={isEnabled == 0 ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    );
  else return null;
};

export default TripSwitch;
