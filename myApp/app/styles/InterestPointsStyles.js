import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  // Container for the entire screen
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#1E88E5", 
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
  // Container for the zoom buttons 
  zoomContainer: {
    flexDirection: "column",
    backgroundColor: "#1E88E5",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
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
    borderColor: "#fff",
    elevation: 4,
  },
  // Custom marker style for coffee shops
  coffeeMarker: {
    backgroundColor: "black", 
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
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
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 6,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Toggle button (for switching between map and list views)
  listButton: {
    backgroundColor: "#1E88E5",
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
  // List view container (full screen within the tab)
  listViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 70,
    marginBottom: 90,
  },
  listContent: {
    padding: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItemDistance: {
    fontSize: 14,
    color: "#666",
  },

  filterButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 15, // Increased margin to push it down
    marginHorizontal: 20, // Added some spacing from edges
    alignSelf: "center", // Centering the button
    width: "50%",
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
