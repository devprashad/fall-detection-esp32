import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import DataAnalytics from './DataAnalytics';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/data-analytics">Data Analytics</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-analytics" element={<DataAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
