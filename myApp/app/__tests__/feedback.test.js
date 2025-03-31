import {
    setVibrationEnabled,
    triggerVibration,
    setSoundEnabled,
    triggerSound,
    preloadSound,
    setSpeechEnabled,
    triggerSpeech,
    __resetSoundCache
} from '../utils/feedback';
  
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

// Add Toast mock
jest.mock('react-native-toast-message', () => ({
    show: jest.fn()
}));
  
jest.mock('react-native', () => ({
    Vibration: { vibrate: jest.fn() },
}));
  
jest.mock('../../assets/sounds/click.wav', () => 'mocked-sound-file'); 

jest.mock('expo-av', () => ({
    Audio: {
        Sound: {
            createAsync: jest.fn(() =>
                Promise.resolve({
                    sound: {
                        replayAsync: jest.fn(() => Promise.resolve()),
                    },
                })
            ),
        },
    },
}));

jest.mock('expo-speech', () => ({
    speak: jest.fn(),
}));
  
describe('Feedback Utility Functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
});
  
    // Vibration Tests
    test('should trigger vibration when enabled', () => {
        setVibrationEnabled(true);
        triggerVibration();
        expect(Vibration.vibrate).toHaveBeenCalled();
    });
    
    test('should not trigger vibration when disabled', () => {
        setVibrationEnabled(false);
        triggerVibration();
        expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
    
    test('should show toast when vibration is triggered', () => {
        const Toast = require('react-native-toast-message');
        setVibrationEnabled(true);
        triggerVibration();
        expect(Toast.show).toHaveBeenCalled();
    });
    
        // Sound Tests
    test('should preload sound without error', async () => {
        await preloadSound();
        expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
            expect.anything() // we can't test require() path directly in Jest
        );
    });
    
    test('should trigger sound when enabled', async () => {
        setSoundEnabled(true);
        __resetSoundCache(); 
        await triggerSound();
        expect(Audio.Sound.createAsync).toHaveBeenCalled();
      });
      
    
    test('should not trigger sound when disabled', async () => {
        setSoundEnabled(false);
        await triggerSound();
        expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
    });
    
    test('should show toast when sound is triggered', async () => {
        const Toast = require('react-native-toast-message');
        setSoundEnabled(true);
        await triggerSound();
        expect(Toast.show).toHaveBeenCalled();
    });
    
        // Speech Tests
    test('should speak when speech is enabled and text is provided', () => {
        setSpeechEnabled(true);
        triggerSpeech('Testing');
        expect(Speech.speak).toHaveBeenCalledWith('Testing');
    });
    
    test('should not speak when speech is disabled', () => {
        setSpeechEnabled(false);
        triggerSpeech('Should not speak');
        expect(Speech.speak).not.toHaveBeenCalled();
    });
    
    test('should not speak when no text is given', () => {
        setSpeechEnabled(true);
        triggerSpeech('');
        expect(Speech.speak).not.toHaveBeenCalled();
    });
    
    test('should show toast when speech is triggered', () => {
        const Toast = require('react-native-toast-message');
        setSpeechEnabled(true);
        triggerSpeech('test');
        expect(Toast.show).toHaveBeenCalled();
    });
});
