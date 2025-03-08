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

  // Enhanced Filter Modal Styles
  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Position from bottom
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  filterModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    bottom: -40,
  },
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  filterModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  filterSection: {
    marginVertical: 12,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#922338", // App's primary color
    textAlign: "center",
    marginTop: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  customSlider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#922338", // App's primary color
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  closeModalButton: {
    backgroundColor: "rgba(0,0,0,0.05)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeModalIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
});
