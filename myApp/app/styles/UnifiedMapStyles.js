import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Adjustable safe area parameter for bottom buttons
const SAFE_AREA_BOTTOM = 90;

const styles = StyleSheet.create({
  // Main container (map occupies full space)
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },

  // Mode toggle at the top remains unchanged
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

  // Floating buttons (other than update) now adhere to the safe area
  buttonContainer: {
    position: "absolute",
    bottom: SAFE_AREA_BOTTOM + 20,
    right: 20,
    flexDirection: "column",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#1E88E5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  debugText: {
    color: "white",
    fontSize: 10,
  },

  // Switch campus button adjusted for safe area
  switchButtonContainer: {
    position: "absolute",
    bottom: SAFE_AREA_BOTTOM + 20,
    left: 20,
    zIndex: 10,
  },
  switchButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  switchButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // List view button adjusted for safe area
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

  // Update button container adjusted for safe area (with extra offset)
  updateButtonContainer: {
    position: "absolute",
    bottom: SAFE_AREA_BOTTOM + 85, // extra offset above safe area
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

  // Loading indicator remains unchanged
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

  // Modal styles remain unchanged
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: width * 0.8,
    maxHeight: height * 0.7,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Filter styles remain unchanged
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

  // List view styles remain unchanged
  listViewContainer: {
    flex: 1,
    marginTop: 100,
  },
  listContent: {
    padding: 10,
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
    backgroundColor: "#1E88E5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  directionsButtonText: {
    color: "white",
    fontSize: 12,
  },
});

export default styles;
