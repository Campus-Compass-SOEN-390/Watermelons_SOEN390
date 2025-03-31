import { Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Toast from 'react-native-toast-message';

//SETTINGS
let vibrationEnabled = true;
let soundEnabled = true;
let speechEnabled = true;

//SETTERS
export const setVibrationEnabled = (enabled) => {
  vibrationEnabled = enabled;
};

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
};

export const setSpeechEnabled = (enabled) => {
  speechEnabled = enabled;
};

//TRIGGERS
export const triggerVibration = (duration = 50) => {
  if (vibrationEnabled) {
    Vibration.vibrate(duration);
    console.log(`[FEEDBACK] Vibrating for ${duration}ms`);
    Toast.show({
      type: 'info',
      position: 'top',
      text1: 'Feedback',
      text2: 'Vibration triggered',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50
    });
  } else {
    console.log('[FEEDBACK] Vibration disabled');
  }
};

let loadedSound = null;

export const preloadSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/click.wav')
    );
    loadedSound = sound;
    console.log('[FEEDBACK] Sound preloaded');
  } catch (error) {
    console.log('[FEEDBACK] Failed to preload sound:', error);
  }
};

export const triggerSound = async () => {
  if (!soundEnabled) {
    console.log('[FEEDBACK] Sound feedback disabled');
    return;
  }

  try {
    if (!loadedSound) {
      await preloadSound();
    }
    await loadedSound?.replayAsync(); // Use replayAsync to quickly play again
    console.log('[FEEDBACK] Played click sound');
    Toast.show({
      type: 'info',
      position: 'center',
      text1: 'Feedback',
      text2: 'Sound played',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 100
    });
  } catch (error) {
    console.log('[FEEDBACK] Error playing sound:', error);
  }
};

export const triggerSpeech = (text) => {
  if (speechEnabled && text) {
    Speech.speak(text);
    console.log(`[FEEDBACK] Speaking: "${text}"`);
    Toast.show({
      type: 'info',
      position: 'bottom',
      text1: 'Feedback',
      text2: `Speech: "${text}"`,
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 50
    });
  } else {
    console.log('[FEEDBACK] Speech disabled or no text');
  }
};

// For testing purposes only
export const __resetSoundCache = () => { loadedSound = null };

