import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import './App.css';
import GSAPAnimations from './utils/gsapAnimations';
import LandingPage from './components/LandingPage';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import TextToVideo from './components/TextToVideo';
import FreeTools from './components/FreeTools';

function AppContent() {
  const location = useLocation();
  
  useGSAP(() => {
    // Initialize smooth scrolling for all pages
    GSAPAnimations.initSmoother();
    
    // Page transition on route change
    const mainContent = document.querySelector('.app-content');
    if (mainContent) {
      GSAPAnimations.pageEnter(mainContent);
    }

    return () => {
      GSAPAnimations.cleanup();
    };
  }, [location.pathname]);

  return (
    <div className="app-content min-h-screen animated-bg">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/video-generator" element={<VideoGenerator />} />
        <Route path="/text-to-video" element={<TextToVideo />} />
        <Route path="/free-tools" element={<FreeTools />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;