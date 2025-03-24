import fetchMock from "jest-fetch-mock";

// Enable mocks globally
fetchMock.enableMocks();
global.fetch = fetchMock;

// Ensure API key is correctly set in Jest tests
process.env.GOOGLE_MAPS_API_KEY = "TEST_API_KEY"; 

global.FormData = require('form-data');

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: () => null,
}));

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
}));

