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
