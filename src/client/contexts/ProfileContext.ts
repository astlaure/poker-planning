import React from 'react';

export interface ProfileState {
  planning: string;
  displayName: string;
}

export const initialState: ProfileState = {
  planning: '',
  displayName: '',
}

type ReactContext = { profile: ProfileState, setProfile: React.Dispatch<React.SetStateAction<any>> };
const ProfileContext = React.createContext<ReactContext>({ profile: initialState, setProfile: () => {} });

export default ProfileContext;
