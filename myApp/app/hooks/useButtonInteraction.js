import { useRouter } from 'expo-router';
import { useFeedback } from '../context/FeedbackContext';
import { triggerVibration, triggerSound, triggerSpeech } from '../utils/feedback';

export const useButtonInteraction = () => {
  const router = useRouter();
  const { vibrationEnabled, soundEnabled, speechEnabled } = useFeedback();

  const handleButtonPress = (route, buttonText) => {
    if (vibrationEnabled) {
      triggerVibration();
    }
    if (soundEnabled) {
      triggerSound();
    }
    if (speechEnabled) {
      triggerSpeech(buttonText);
    }
    if (route) {
      router.push(route);
    }
  };

  return { handleButtonPress };
};