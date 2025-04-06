import fetchMock from "jest-fetch-mock";
import "setimmediate";

// Enable mocks globally
fetchMock.enableMocks();
global.fetch = fetchMock;

// Ensure API key is correctly set in Jest tests
process.env.GOOGLE_MAPS_API_KEY = "TEST_API_KEY";

global.FormData = require("form-data");

// Mock AsyncStorage globally
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  multiMerge: jest.fn(() => Promise.resolve()),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name }) => <div>{`MockIcon: ${name}`}</div>,
  MaterialIcons: () => null,
}));

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
}));
