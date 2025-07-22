import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import TextToVideo from './components/TextToVideo';
import FreeTools from './components/FreeTools';

function App() {
  return (
    <Router>
      <div className="App min-h-screen animated-bg">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/video-generator" element={<VideoGenerator />} />
          <Route path="/text-to-video" element={<TextToVideo />} />
          <Route path="/free-tools" element={<FreeTools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;