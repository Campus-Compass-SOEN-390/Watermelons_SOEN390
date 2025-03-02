import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  // Entire screen container
  containerForMap: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // The actual map should fill the available space
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  map: {
    flex: 1,
  },

  // Floating buttons container: positioned near bottom-right
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 100, // Enough space above the tab bar
    alignItems: "center",
  },
  // Redesigned modern floating button
  button: {
    backgroundColor: "#1E88E5", // Modern blue shade
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  debugText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },

  // Modal styles remain the same:
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#ff5252",
    padding: 8,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Switch Button Container is now positioned on the left
  switchButtonContainer: {
    position: "absolute",
    bottom: 65,
    left: 20,
    zIndex: 2,
  },
  switchButton: {
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
    bottom: 50,
  },
  // Switch Button Text: white, bold, and easily readable
  switchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  shuttleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
    bottom: 50,
  },
  shuttleButtonContainer: {
    position: "absolute",
    bottom: 65,
    left: 150,
    zIndex: 2,
  },
  shuttleIcon: {
    width: 15,  // Adjust width as needed (smaller size)
    height: 15, // Adjust height as needed (smaller size)
    marginRight: 8, // Space between image and text (optional)
  },
  titleForMap: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
});
