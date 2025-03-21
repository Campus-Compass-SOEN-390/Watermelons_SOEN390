import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(),
  documentDirectory: 'mockedDir/',
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { apiKey: 'mocked-api-key' } },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Correctly mock LayoutWrapper
jest.mock('../components/LayoutWrapper.js', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, null, children);
});

// Correctly mock HeaderButtons
jest.mock('../components/HeaderButtons.js', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'HeaderButtons Mock'));
});

// Correctly mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: () => React.createElement(View),
  };
});

// Import after mocking
import CalendarFetching from '../screens/calendarFetching';

// Render helper
const renderWithNav = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching Component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders correctly with inputs and buttons', async () => {
    const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

    expect(getByPlaceholderText('Paste Calendar ID here')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
    expect(getByText('Clear History')).toBeTruthy();
  });

  test('shows alert when trying to connect with empty input', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderWithNav(<CalendarFetching />);

    fireEvent.press(getByText('Connect'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'Invalid',
        'Please enter a valid Calendar ID'
      )
    );
  });

  test('clears calendar history when pressing Clear History', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const { getByText } = renderWithNav(<CalendarFetching />);

    fireEvent.press(getByText('Clear History'));

    await waitFor(() =>
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('calendarIds')
    );
  });

  test('fetches and displays calendar events successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              { summary: 'Meeting', start: { dateTime: '2025-03-21T10:00:00Z' }, end: { dateTime: '2025-03-21T11:00:00Z' } },
            ],
          }),
      })
    );

  });

  test('loads stored calendar IDs on mount', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'saved-id', name: 'Saved Calendar' }])
    );

    const { findByText } = renderWithNav(<CalendarFetching />);

    expect(await findByText('Saved Calendar')).toBeTruthy();
  });
  test('allows selecting a stored calendar ID', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'stored-calendar', name: 'Stored Calendar' }])
    );

    const { findByText, getByPlaceholderText } = renderWithNav(<CalendarFetching />);

    const storedCalendar = await findByText('Stored Calendar');
    fireEvent.press(storedCalendar);

    expect(getByPlaceholderText('Paste Calendar ID here').props.value).toBe('stored-calendar');
  });


});

const MonthPicker = ({ monthsAhead, setMonthsAhead, styles }) => (
  <View style={{ marginTop: 10 }}>
    <Text style={styles.subtitle}>Show events for the upcoming:</Text>
    <View
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 10,
      }}
    >
      <Picker
        selectedValue={monthsAhead}
        onValueChange={(itemValue) => setMonthsAhead(itemValue)}
        style={{ height: 50 }}
        testID="month-picker"
      >
        <Picker.Item label="1 Month" value="1" />
        <Picker.Item label="2 Months" value="2" />
        <Picker.Item label="3 Months" value="3" />
        <Picker.Item label="4 Months" value="4" />
        <Picker.Item label="5 Months" value="5" />
        <Picker.Item label="6 Months" value="6" />
        <Picker.Item label="All Events" value="all" />
      </Picker>
    </View>
  </View>
);

describe('MonthPicker Component', () => {
  const styles = {
    subtitle: { fontSize: 16, fontWeight: 'bold' }
  };

  it('renders the subtitle text', () => {
    const { getByText } = render(
      <MonthPicker monthsAhead="1" setMonthsAhead={() => { }} styles={styles} />
    );
    expect(getByText('Show events for the upcoming:')).toBeTruthy();
  });

  // Checks that all options are rendering
  // DOES NOT test the presence of each Picker.Item in isolation
  
  // Bellow are the values assigned to each option in the dropdown
  const options = ['1', '2', '3', '4', '5', '6', 'all'];

  options.forEach(value => {
    it(`calls setMonthsAhead on value change to "${value}"`, () => {
      const mockSetMonthsAhead = jest.fn();
      const { getByTestId } = render(
        <MonthPicker monthsAhead="1" setMonthsAhead={mockSetMonthsAhead} styles={styles} />
      );
      fireEvent(getByTestId('month-picker'), 'valueChange', value);
      expect(mockSetMonthsAhead).toHaveBeenCalledWith(value);
    });
  });

  it('calls setMonthsAhead on value change', () => {
    const mockSetMonthsAhead = jest.fn();
    const { getByTestId } = render(
      <MonthPicker monthsAhead="1" setMonthsAhead={mockSetMonthsAhead} styles={styles} />
    );

    fireEvent(getByTestId('month-picker'), 'valueChange', '3');
    expect(mockSetMonthsAhead).toHaveBeenCalledWith('3');
  });
});