import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './core/Welcome';
import PokerTable from './core/PokerTable';
import ProfileContextProvider from './contexts/ProfileContextProvider';

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
