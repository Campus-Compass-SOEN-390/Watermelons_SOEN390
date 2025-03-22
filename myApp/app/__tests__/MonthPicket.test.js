import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Or 'react-native' if you're using the old version
import { render, fireEvent } from '@testing-library/react-native';

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