'use client';
import { useState, useEffect } from 'react';
import ArtScanner from './components/ArtScanner';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modelPreloaded, setModelPreloaded] = useState(false);

  // Preload model in background while user sees landing page
  useEffect(() => {
    const preloadModel = async () => {
      try {
        console.log('🔄 Preloading AI model in background...');
        await tf.setBackend('webgl');
        await tf.ready();
        await mobilenet.load();
        setModelPreloaded(true);
        console.log('✅ Model preloaded and ready!');
      } catch (error) {
        console.error('❌ Preload error:', error);
      }
    };
    preloadModel();
  }, []);

  const handleEnterLab = () => {
    setShowScanner(true);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Landing Page
  if (!showScanner && !isAuthenticated) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 800px 1000px at center center,
            #B8FF3C 0%,
            #95E030 10%,
            #6FB828 20%,
            #4A8428 30%,
            #2D4D1A 40%,
            #1A2D14 50%,
            #1B1034 65%,
            #110822 80%,
            #0A0416 100%)`,
        }}
      >
        {/* Content Container */}
        <div className="flex flex-col items-center justify-center">
          {/* Title */}
          <h1 
            className="text-white text-[60px] font-bold text-center mb-8"
            style={{ 
              fontFamily: 'Orbitron, system-ui, sans-serif', 
              letterSpacing: '0.01em',
              lineHeight: '1.1'
            }}
          >
            Talk to Rick<br />Sanchez
          </h1>

          {/* Button */}
          <button 
            onClick={handleEnterLab}
            className="bg-[#00FFFF] text-black text-[20px] font-semibold py-4 px-16 mb-6 hover:bg-[#00E0E7] active:scale-95 transition-all"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              borderRadius: '25px'
            }}
          >
            Enter Rick's Lab
          </button>

          {/* Subtitle */}
          <p 
            className="text-white text-[18px] text-center font-semibold"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '0.01em'
            }}
          >
            Enable camera & grant mic access
          </p>
        </div>
      </div>
    );
  }

  // Scanner Page
  if (showScanner && !isAuthenticated) {
    return <ArtScanner onAuthenticated={handleAuthenticated} />;
  }

  // Success Page (After Authentication)
  if (isAuthenticated) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 800px 1000px at center center,
            #B8FF3C 0%,
            #95E030 10%,
            #6FB828 20%,
            #4A8428 30%,
            #2D4D1A 40%,
            #1A2D14 50%,
            #1B1034 65%,
            #110822 80%,
            #0A0416 100%)`,
        }}
      >
        <div className="flex flex-col items-center justify-center max-w-2xl px-6">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 rounded-full bg-[#00FFFF] flex items-center justify-center">
              <svg 
                className="w-20 h-20 text-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-[#00FFFF] blur-2xl opacity-50 animate-pulse"></div>
          </div>

          {/* Success Message */}
          <h1 
            className="text-white text-[48px] font-bold text-center mb-4"
            style={{ 
              fontFamily: 'Orbitron, system-ui, sans-serif', 
              letterSpacing: '0.01em',
              lineHeight: '1.1'
            }}
          >
            Access Granted!
          </h1>

          <p 
            className="text-white text-[24px] text-center mb-8"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '0.01em'
            }}
          >
            Welcome to Rick's Lab
          </p>

          {/* Placeholder for chatbot */}
          <div className="w-full bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-[#00FFFF]/30">
            <p 
              className="text-white text-center text-lg"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              🤖 Chatbot interface will be integrated here
            </p>
            <p 
              className="text-white/60 text-center text-sm mt-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              This is where your Rick Sanchez chatbot will appear
            </p>
          </div>

          {/* Reset button for testing */}
          <button
            onClick={() => {
              setShowScanner(false);
              setIsAuthenticated(false);
            }}
            className="mt-6 text-white/60 hover:text-white text-sm underline"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Back to start (for testing)
          </button>
        </div>
      </div>
    );
  }

  return null;
}