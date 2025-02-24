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
  titleForMap: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
footerContainer: {
  position: "absolute",
  bottom: 0,  // Align the container to the bottom of the screen
  left: -10,    // Ensure the container starts from the left edge
  right: 0,   // Ensure the container ends at the right edge
  height: 110,
  marginHorizontal: "auto",  // This ensures the container is centered horizontally
  width: 410, // Set the width of the container (optional for a fixed width)
  backgroundColor: "#ffffff", // Cleaner white background
  borderRadius: 20,  // Softer rounded corners
  shadowColor: "#000",
  flexDirection: "row",  // Align buttons in a row
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1, // Lighter shadow for a subtler effect
  // shadowRadius: 10,
  paddingVertical: 12, // Adjust padding for better balance
  paddingHorizontal: 18,
  justifyContent: "space-between", // Space between buttons
  alignItems: "center",
  elevation: 5, // Add elevation for Android devices
},
  
  footerButton: {
    flex: 1,
    marginHorizontal: 10,  // Added horizontal margin for spacing between buttons
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Slight elevation on buttons for better depth
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    transition: "background-color 0.3s ease", // Smooth transition effect on hover
  },
  
  goButton: {
    fontSize: 8,
    backgroundColor: "#0FA958",  // Green button for "GO"
    padding:10,
    paddingHorizontal: 20, // Added horizontal padding for better button width
    borderRadius: 10,  // Round edges of the button

  },
  
  stepsButton: {
    backgroundColor: "#393a41", // Dark gray for routes
    padding:10,
    paddingHorizontal: 20, // Added horizontal padding for better button width
    borderRadius: 10,  // Round edges of the button


  },
  
  favoriteButton: {
    backgroundColor: "#393a41", // Subtle yellow for favorite (different from steps
    padding:10,
    paddingHorizontal: 20, // Added horizontal padding for better button width
    borderRadius: 10,  // Round edges of the button


  },
  
  footerButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  
});
