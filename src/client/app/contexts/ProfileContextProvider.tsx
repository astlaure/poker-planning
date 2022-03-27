import React, { useState } from 'react';
import ProfileContext, { initialState } from './ProfileContext';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

function ProfileContextProvider(props: Props): React.ReactElement {
  const [profile, setProfile] = useState(initialState);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {props.children}
    </ProfileContext.Provider>
  );
}

export default ProfileContextProvider;
