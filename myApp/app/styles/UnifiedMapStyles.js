import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const SAFE_AREA_BOTTOM = 90;

export default StyleSheet.create({
  // Entire screen container for map
  containerForMap: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // The actual container for the map
  container: {
    flex: 1,
    width: width,
    height: height,
  },

  // The map should fill its container
  map: {
    flex: 1,
  },

  // Mode toggle container (if used)
  modeToggleContainer: {
    position: "absolute",
    top: 70,
    left: 50,
    right: 10,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 10,
  },
  modeButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeMode: {
    backgroundColor: "#1E88E5",
  },
  modeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Floating buttons container (new style)
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 100, // Adjusted to leave room above the tab bar
    alignItems: "center",
  },
  button: {
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
  debugText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },

  // Switch campus button (new style)
  switchButtonContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    zIndex: 2,
  },
  switchButton: {
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
  },
  switchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  // Shuttle button styles (new additions)
  shuttleButtonContainer: {
    position: "absolute",
    bottom: 120,
    left: 150,
    zIndex: 2,

  },
  shuttleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
  },
  shuttleIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },

  // Title for the map (if needed)
  titleForMap: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },

  // List view and update button styles from the old design (if still used)
  listButton: {
    position: "absolute",
    bottom: SAFE_AREA_BOTTOM + 20,
    left: 20,
    backgroundColor: "#1E88E5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  updateButtonContainer: {
    position: "absolute",
    bottom: SAFE_AREA_BOTTOM + 85,
    alignSelf: "center",
    zIndex: 10,
  },
  updateButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Loading overlay
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 20,
  },

  // Modal styles
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

  // Filter button styles (if used)
  filterButton: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 10,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
  },

  // List view styles (if using a list view)
  listViewContainer: {
    flex: 1,
    marginTop: 100,
    marginBottom: SAFE_AREA_BOTTOM + 30,
  },
  listContent: {
    padding: 10,
  },
  listViewOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5",
    zIndex: 5,
  },
  listItem: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listItemText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  listItemDistance: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  directionsButton: {
    backgroundColor: "#922338",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  // Error container styles
  errorContainer: {
    position: "absolute",
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: "#ffeded",
    borderRadius: 5,
    padding: 15,
    zIndex: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 10,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  
});
