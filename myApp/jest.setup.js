// jest.setup.js
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

global.FormData = require('form-data');

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: () => null,
  }));
  
  jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
  }));
  