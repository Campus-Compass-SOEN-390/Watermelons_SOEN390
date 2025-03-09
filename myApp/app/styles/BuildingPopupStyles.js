import { StyleSheet } from 'react-native';

export const buildingPopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center", // Ensures everything inside is centered
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: 250, // Allow scrolling if content overflows
  },
  buildingContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // Makes buttons equal width
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  directionButton: {
    backgroundColor: "#007AFF",
  },
  startPointButton: {
    backgroundColor: "#34C759",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    width: "100%", // Full width
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "600",
  },
  buttonContent: {
  flexDirection: "row",
  alignItems: "center",
  }
});

export default buildingPopupStyles;