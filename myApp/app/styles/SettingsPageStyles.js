import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
    padding: 20,
    paddingTop: 100,
    gap: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subtitle: {
    color: "#666",
    fontSize: 20,
    marginBottom: 10
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,  // Add shadow effect for elevation
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: "#333"
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    right: 10,
  },
  vibration_image: {
    width: 30,
    height: 30,
    marginRight: 12,
  }
});

export default styles;