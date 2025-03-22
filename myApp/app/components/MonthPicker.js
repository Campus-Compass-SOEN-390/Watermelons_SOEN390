import { Picker } from '@react-native-picker/picker';
// components/MonthPicker.js
import React from 'react';
import { View, Text } from 'react-native';

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

export default MonthPicker;
