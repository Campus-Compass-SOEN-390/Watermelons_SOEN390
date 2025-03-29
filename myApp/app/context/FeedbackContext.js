import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

  const value = useMemo(() => ({
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech
  }), [
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech
  ]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

FeedbackProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useFeedback = () => useContext(FeedbackContext);