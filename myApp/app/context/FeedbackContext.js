import React, { createContext, useContext, useState, useCallback } from 'react';

const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

const toggleVibration = useCallback(() => {
  setVibrationEnabled(prev => !prev);
}, []);

const toggleSound = useCallback(() => {
  setSoundEnabled(prev => !prev);
}, []);

const toggleSpeech = useCallback(() => {
  setSpeechEnabled(prev => !prev);
}, []);

  return (
    <FeedbackContext.Provider value={{ 
      vibrationEnabled, 
      soundEnabled, 
      speechEnabled,
      toggleVibration,
      toggleSound,
      toggleSpeech
    }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);