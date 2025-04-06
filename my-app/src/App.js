import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatComponent from './components/ChatComponent';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatComponent />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
