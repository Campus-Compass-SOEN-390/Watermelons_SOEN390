// outdoorMapStyles.js
import { StyleSheet, Dimensions } from "react-native";
import {FONT_SIZE_1, FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4, FONT_SIZE_5} from './constants';

// Set these variables as needed (or import them from a config)
const safeAreaTop = 20;
const safeAreaBottom = 20;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  // Container that wraps the whole screen, now accounting for safe areas
  containerForMap: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: safeAreaTop,
    paddingBottom: 0,
  },

  // The actual map container – note that its size remains the full screen dimensions.
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Floating buttons container: Moved to bottom-right
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 95, // Position above tab bar
    alignItems: "center",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: 50,
    height: 50,
  },
  debugText: {
    color: "white",
    fontSize: FONT_SIZE_1,
    marginTop: 2,
  },

  // Modal styles adjusted for safe areas
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: safeAreaTop,
    paddingBottom: safeAreaBottom,
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
    fontSize: FONT_SIZE_3,
  },

  // Switch Button Container now placed above the bottom safe area
  switchButtonContainer: {
    position: "absolute",
    bottom: safeAreaBottom + 15,
    left: 20,
    zIndex: 2,
  },
  switchButton: {
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  switchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  // Shuttle button styled and positioned similar to other buttons
  shuttleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#922338",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  shuttleButtonContainer: {
    position: "absolute",
    bottom: safeAreaBottom + 85,
    left: 150,
    zIndex: 2,
  },
  shuttleIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  titleForMap: {
    fontSize: FONT_SIZE_5,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  annotationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 10,
  },
  annotationText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    fontSize: 24,
    fontFamily: "Arial",
  },

  // Action button (Filter button) - repositioned to bottom right
  actionButton: {
    position: "absolute",
    bottom: 180, // Position above the POI toggle button
    right: 20,
    backgroundColor: "#922338",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },

  // Loading indicato
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "#922338",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 20,
  },

  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Space out children
    alignItems: "center", // Center children vertically
  },
  
  footerText: {
    marginLeft: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepsButton: {
    backgroundColor: "#393a41",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
  stepsList: {
    maxHeight: 300,
    padding: 10,
  },
  stepItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepDistance: {
    fontSize: 14,
    color: "gray",
  },
  closeButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelButtonContainer:{
    position: "absolute",
    bottom: safeAreaBottom + 85,
    left:'80%',
    zIndex: 2,
  }

  
});
