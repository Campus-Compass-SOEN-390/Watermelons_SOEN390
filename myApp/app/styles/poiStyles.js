// poiStyles.js
import { StyleSheet, Dimensions } from "react-native";

// Set safe area variables (adjust as needed)
const safeAreaTop = 20;
const safeAreaBottom = 20;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  // Modal styles for POI components, including safe area padding
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: safeAreaTop,
    paddingBottom: safeAreaBottom,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    marginTop: 20,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Updated POI button styled to match the team theme.
  // Repositioned near top for easier access
  updateButtonContainer: {
    position: "absolute",
    top: safeAreaTop + 230, // Positioned below other top buttons
    alignSelf: "center",
    backgroundColor: "#922338", // Team's primary color
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
});
