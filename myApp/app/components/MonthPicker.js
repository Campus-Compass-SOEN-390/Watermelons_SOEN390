// import { Picker } from '@react-native-picker/picker';
// import React from 'react';
// import { View, Text } from 'react-native';

// const MonthPicker = ({ monthsAhead, setMonthsAhead, styles }) => (
//   <View style={{ marginTop: 10 }}>
//     <Text style={styles.subtitle}>Show events for the upcoming:</Text>
//     <View
//       style={{
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 6,
//         overflow: 'hidden',
//         marginBottom: 10,
//       }}
//     >
//       <Picker
//         selectedValue={monthsAhead}
//         onValueChange={(itemValue) => setMonthsAhead(itemValue)}
//         style={{ height: 50 }}
//         testID="month-picker"
//       >
//         <Picker.Item label="1 Month" value="1" />
//         <Picker.Item label="2 Months" value="2" />
//         <Picker.Item label="3 Months" value="3" />
//         <Picker.Item label="4 Months" value="4" />
//         <Picker.Item label="5 Months" value="5" />
//         <Picker.Item label="6 Months" value="6" />
//         <Picker.Item label="All Events" value="all" />
//       </Picker>
//     </View>
//   </View>
// );

// export default MonthPicker;
import React, { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View, Text } from "react-native";

const MonthPicker = ({ monthsAhead, setMonthsAhead, styles }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(monthsAhead);
  const [items, setItems] = useState([
    { label: "1 Month", value: "1" },
    { label: "2 Months", value: "2" },
    { label: "3 Months", value: "3" },
    { label: "4 Months", value: "4" },
    { label: "5 Months", value: "5" },
    { label: "6 Months", value: "6" },
    { label: "All Events", value: "all" },
  ]);

  // Update parent state when dropdown changes
  useEffect(() => {
    setMonthsAhead(value);
  }, [value]);

  return (
    <View style={{ zIndex: 1000, marginBottom: open ? 160 : 30 }}>
      <Text style={styles.subtitle}>Show events for the upcoming:</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select a time range"
        style={{
          borderColor: "#ccc",
          backgroundColor: "#fff",
        }}
        dropDownContainerStyle={{
          borderColor: "#ccc",
        }}
      />
    </View>
  );
};

export default MonthPicker;
