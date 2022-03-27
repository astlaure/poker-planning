import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './app/core/Welcome';
import PokerTable from './app/core/PokerTable';
import ProfileContextProvider from './app/contexts/ProfileContextProvider';

export default function App(): React.ReactElement {
  return (
    <ProfileContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Welcome />} />
          <Route path="poker" element={<PokerTable />} />
        </Routes>
      </BrowserRouter>
    </ProfileContextProvider>
  );
}
