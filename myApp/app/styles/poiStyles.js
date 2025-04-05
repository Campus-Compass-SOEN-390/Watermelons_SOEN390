// poiStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4, FONT_SIZE_5, COLORS } from "./constants";

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
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: COLORS.BLACK_OR_SHADOW,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: FONT_SIZE_4,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: FONT_SIZE_2,
    textAlign: "center",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: COLORS.RED_CLOSE_BUTTON,
    padding: 8,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: FONT_SIZE_3,
  },

  // Updated POI button styled to match the team theme.
  // Repositioned near top for easier access
  updateButtonContainer: {
    position: "absolute",
    top: safeAreaTop + 230, // Positioned below other top buttons
    alignSelf: "center",
    backgroundColor: COLORS.CONCORDIA_RED, // Team's primary color
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  updateButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE_2,
    fontWeight: "bold",
  },

  // Enhanced Filter Modal Styles
  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Position from bottom
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  filterModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    shadowColor: COLORS.BLACK_OR_SHADOW,
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
    color: COLORS.DARK_GREY_TITLE,
  },
  filterSection: {
    marginVertical: 12,
  },
  filterSectionTitle: {
    fontSize: FONT_SIZE_4,
    fontWeight: "600",
    color: COLORS.DARK_MODE_LIGHT_GREY,
    marginBottom: 8,
  },
  distanceValue: {
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
    color: COLORS.CONCORDIA_RED, // App's primary color
    textAlign: "center",
    marginTop: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.OFF_WHITE,
  },
  filterOptionText: {
    fontSize: FONT_SIZE_3,
    color: COLORS.DARK_GREY_TITLE,
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
    backgroundColor: COLORS.CONCORDIA_RED, // App's primary color
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE_4,
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
    fontSize: FONT_SIZE_5,
    fontWeight: "bold",
    color: COLORS.DARK_MODE_LIGHT_GREY,
  },
  distanceSliderContainer: {
    marginTop: 10,
    backgroundColor: COLORS.OFF_WHITE,
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  distanceRangeLabel: {
    fontSize: FONT_SIZE_3,
    fontWeight: "500",
    color: COLORS.DARK_MODE_LIGHT_GREY,
    marginBottom: 10,
    textAlign: "center",
  },
});