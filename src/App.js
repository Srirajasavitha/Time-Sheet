import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimeSheetForm from './components/TimeSheetForm';
import TimeSheetDashboard from './components/TimeSheetDashboard';
// import TimeSheetProfile from './components/TimeSheetProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TimeSheetForm />} />
        <Route path="/dashboard" element={<TimeSheetDashboard />} />
        {/* <Route path="/profile" element={<TimeSheetProfile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
