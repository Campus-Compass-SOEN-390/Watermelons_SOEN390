import { StyleSheet, Dimensions } from "react-native";
import { FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4 } from "./constants";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  tabBarStyle: {
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    marginHorizontal: 15,
  },
  container: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 3,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
    width: 50,
    textAlign: "right",
    position: "relative",
    right: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 40,
    position: "relative",
  },
  dropdownFrom: {
    position: "absolute",
    top: 93,
    width: "125.8%",
    left: -65,
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    elevation: 5,
    maxHeight: 150,
    zIndex: 10,
  },
  dropdownTo: {
    position: "absolute",
    top: 40,
    width: "125.8%",
    left: -65,
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    elevation: 5,
    maxHeight: 150,
    zIndex: 11,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  button: {
    backgroundColor: "#eee",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    alignSelf: "flex-start",
    marginTop: 5,
    position: "absolute",
    top: 120,
    left: 10,
    elevation: 40,
    shadowColor: "black",
  },
  buttonText: {
    fontSize: FONT_SIZE_2,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  footerContainer: {
    position: "absolute",
    flexDirection: "column", // Align items vertically
    alignItems: "center", // Center items horizontally
    justifyContent: "flex-start", // Start from the top
    bottom:
      Dimensions.get("window").height > 945
        ? -705
        : height > 870
        ? -675
        : -600,
    left: -30,
    right: 0,
    height: 350,
    width: width * 1,
    marginHorizontal: "2.5%",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: "flex-start", // Ensure content starts from top
    elevation: 5,
    zIndex: 999, // Ensures it's on top of other elements
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  footerButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  goButton: {
    fontSize: 8,
    backgroundColor: "#0FA958",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  stepsButton: {
    backgroundColor: "#393a41",
    padding: 10,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 10,
  },
  favoriteButton: {
    backgroundColor: "#393a41",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  etaText: {
    fontSize: FONT_SIZE_3,
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 26,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    // Optionally remove width so it sizes to its content:
    // width: "auto",
    // Adjust margin if needed:
    marginTop: 0,
  },
  
   
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
  transportButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#922338",
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
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
  },
  stepDistance: {
    fontSize: FONT_SIZE_2,
    color: "gray",
  },


    modeText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333",
    },

    routesContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      marginBottom: 10,
      width: "100%",
    },
    routeCard: {
      backgroundColor: "#f9f9f9",
      padding: 12,
      marginVertical: 5,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // for Android shadow
      width: "100%",
      flexDirection: 'row',  // Align items horizontally
      justifyContent: 'space-between', // Space between button and text
      alignItems: 'center',  // Align items in the center
    },
    routeTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    routeDetails: {
      fontSize: 14,
      color: "#555",
      marginBottom: 3,
    },
  
  
});
