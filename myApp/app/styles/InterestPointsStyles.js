import { StyleSheet, Dimensions } from "react-native";
import { FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4, COLORS } from "./constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  // Container for the entire screen
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  // Map fills the entire container
  map: {
    flex: 1,
  },
  // Loading indicator overlay
  loadingContainer: {
    position: "absolute",
    top: screenHeight / 2 - 20,
    left: screenWidth / 2 - 20,
  },
  // Floating buttons container 
  floatingButtonsContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  // Center on user location button
  centerButton: {
    backgroundColor: COLORS.BLUE_BUTTONS, 
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  // Container for the zoom buttons 
  zoomContainer: {
    flexDirection: "column",
    backgroundColor: COLORS.BLUE_BUTTONS,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 8,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 16,
  },
  // Each zoom button (top: zoom in, bottom: zoom out)
  zoomButton: {
    width: 56,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  // Custom marker style for restaurants
  restaurantMarker: {
    backgroundColor: "orange", 
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    elevation: 4,
  },
  // Custom marker style for coffee shops
  coffeeMarker: {
    backgroundColor: COLORS.BLACK_OR_SHADOW, 
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    elevation: 4,
  },
  // Update Results button container (placed at top center under the notch)
  updateButtonContainer: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
  },
  // Update Results button styling
  updateButton: {
    backgroundColor: COLORS.BLUE_BUTTONS,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 6,
  },
  updateButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
  },
  // Modal styles (for permission denial)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: FONT_SIZE_3,
  },
  // Toggle button (for switching between map and list views)
  listButton: {
    backgroundColor: COLORS.BLUE_BUTTONS,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  // List view container (full screen within the tab)
  listViewContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: 70,
    marginBottom: 90,
  },
  listContent: {
    padding: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_INPUT_BOXES,
  },
  listItemText: {
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
  },
  listItemDistance: {
    fontSize: FONT_SIZE_2,
    color: COLORS.DARK_MODE_LIGHT_GREY,
  },

  filterButton: {
    backgroundColor: COLORS.BLUE_BUTTONS,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 15, // Increased margin to push it down
    marginHorizontal: 20, // Added some spacing from edges
    alignSelf: "center", // Centering the button
    width: "50%",
  },
  filterButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  }
});