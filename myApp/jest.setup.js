// jest.setup.js
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
process.env.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "test_api_key";
// Ensure mock is applied globally
global.fetch = fetchMock;

global.FormData = require('form-data');

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: () => null,
}));

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
}));
