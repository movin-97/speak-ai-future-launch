
import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceTrackerProps {
  isActive: boolean;
  volume?: number;
}

export const VoiceTracker: React.FC<VoiceTrackerProps> = ({ isActive, volume = 0 }) => {
  const [animationIntensity, setAnimationIntensity] = useState(0);

  useEffect(() => {
    if (isActive && volume > 0) {
      setAnimationIntensity(Math.min(volume * 10, 5));
    } else {
      setAnimationIntensity(0);
    }
  }, [isActive, volume]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Outer pulse rings */}
        {isActive && (
          <>
            <div 
              className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"
              style={{ 
                transform: `scale(${1 + animationIntensity * 0.2})`,
                animationDuration: '1s'
              }}
            />
            <div 
              className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"
              style={{ 
                transform: `scale(${1 + animationIntensity * 0.4})`,
                animationDuration: '1.5s'
              }}
            />
          </>
        )}
        
        {/* Central microphone */}
        <div 
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50' 
              : 'bg-gray-600'
          }`}
          style={{ 
            transform: `scale(${1 + animationIntensity * 0.1})`,
          }}
        >
          {isActive ? (
            <Mic className="w-8 h-8 text-white" />
          ) : (
            <MicOff className="w-8 h-8 text-gray-300" />
          )}
        </div>
      </div>
      
      {/* Volume bars */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 rounded-full transition-all duration-100 ${
              i < animationIntensity 
                ? 'bg-gradient-to-t from-purple-500 to-pink-500 h-8' 
                : 'bg-gray-600 h-4'
            }`}
          />
        ))}
      </div>
      
      <p className="text-white text-sm">
        {isActive ? 'Speaking...' : 'Silent'}
      </p>
    </div>
  );
};
