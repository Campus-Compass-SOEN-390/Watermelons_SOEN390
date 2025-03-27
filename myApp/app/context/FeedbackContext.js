import React, { createContext, useContext, useState, useCallback } from 'react';
import { setVibrationEnabled, setSoundEnabled, setSpeechEnabled } from '../utils/feedback';

const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);

  const toggleFeedback = useCallback(() => {
    setFeedbackEnabled(prev => {
      const newState = !prev;
      setVibrationEnabled(newState);
      setSoundEnabled(newState);
      setSpeechEnabled(newState);
      alert(`Feedback ${newState ? "enabled" : "disabled"}`);
      return newState;
    });
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbackEnabled, toggleFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);