// jest.setup.js
global.FormData = require('form-data');

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: () => null,
  }));
  
  jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
  }));
  