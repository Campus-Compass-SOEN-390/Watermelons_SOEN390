import React, { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

// Using JavaScript default parameters instead of defaultProps
const MonthPicker = ({
  monthsAhead,
  setMonthsAhead,
  styles,
  isDarkMode = false,
  theme = {
    darkText: "#ffffff",
    darkInput: "rgba(0, 0, 0, 0.1)",
    darkBorder: "rgba(0, 0, 0, 0.3)",
    darkCard: "#333333",
  },
}) => {
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

  // Determine colors based on the theme
  const textColor = isDarkMode ? "#FFFFFF" : "#333";
  const backgroundColor = isDarkMode ? "rgba(51, 51, 51, 0.8)" : "#fff";
  const borderColor = isDarkMode ? "rgba(80, 80, 80, 0.8)" : "#ccc";
  const labelColor = isDarkMode ? "#FFFFFF" : "#000";
  const dropdownTextColor = isDarkMode ? "#FFFFFF" : "#000";
  const tickColor = isDarkMode ? "#fff" : "#000";
  const arrowColor = isDarkMode ? "#FFFFFF" : "black";
  const listItemBgColor = isDarkMode ? "rgba(51, 51, 51, 0.9)" : "#fff";
  const listItemSelectedBgColor = isDarkMode
    ? "rgba(80, 80, 80, 0.9)"
    : "rgba(0, 0, 0, 0.1)";

  return (
    <View style={{ zIndex: 1000, marginBottom: open ? 160 : 30 }}>
      <Text style={[styles.subtitle, { color: textColor }]}>
        Show events for the upcoming:
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select a time range"
        style={{
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        }}
        textStyle={{
          color: dropdownTextColor,
        }}
        dropDownContainerStyle={{
          borderColor: borderColor,
          backgroundColor: listItemBgColor,
        }}
        labelStyle={{
          color: labelColor,
        }}
        arrowIconStyle={{
          tintColor: arrowColor,
        }}
        tickIconStyle={{
          tintColor: tickColor,
        }}
        selectedItemContainerStyle={{
          backgroundColor: listItemSelectedBgColor,
        }}
        placeholderStyle={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
        }}
      />
    </View>
  );
};

MonthPicker.propTypes = {
  monthsAhead: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setMonthsAhead: PropTypes.func.isRequired,
  styles: PropTypes.object,
  isDarkMode: PropTypes.bool,
  theme: PropTypes.object,
};

export default MonthPicker;
