import React, { createContext, useContext, useState, useCallback } from 'react';

const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const toggleVibration = useCallback(() => {
    setVibrationEnabled(prev => {
      const newState = !prev;
      setVibrationEnabled(newState);
      return newState;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newState = !prev;
      setSoundEnabled(newState);
      return newState;
    });
  }, []);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled(prev => {
      const newState = !prev;
      setSpeechEnabled(newState);
      return newState;
    });
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