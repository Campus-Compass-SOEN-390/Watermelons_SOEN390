import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

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

// Add PropTypes validation
FeedbackProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useFeedback = () => useContext(FeedbackContext);