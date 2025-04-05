import fetchMock from "jest-fetch-mock";
import 'setimmediate';


// Enable mocks globally
fetchMock.enableMocks();
global.fetch = fetchMock;

// Ensure API key is correctly set in Jest tests
process.env.GOOGLE_MAPS_API_KEY = "TEST_API_KEY"; 

global.FormData = require('form-data');

jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name }) => <div>{`MockIcon: ${name}`}</div>,
    MaterialIcons: () => null,
}));

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
}));

