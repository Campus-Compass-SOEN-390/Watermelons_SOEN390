import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

// Tab bar transparency - adjust this value between 0 and 1
const tabBarTransparency = 1;

export default StyleSheet.create({
  tabBarStyle: {
    height: 80,
    backgroundColor: `rgba(255, 255, 255, ${tabBarTransparency})`,
    borderRadius: 30,
    borderTopWidth: 0,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    marginHorizontal: 15,
  },
  tabBarItemStyle: {
    paddingVertical: 10,
    borderRadius: 40,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabBackground: {
    backgroundColor: "grey",
    borderRadius: 20,
    width: 80,
    height: 60,
    position: "relative",
    top: 11,
  },
  homeButton: {
    position: "absolute",
    top: 50,
    left: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 25,
    zIndex: 100,
  },
});