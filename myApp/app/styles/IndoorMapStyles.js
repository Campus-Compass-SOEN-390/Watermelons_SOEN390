import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  floorButtonContainer: {
    backgroundColor: "#ffffff",
    position: "absolute",
    right: 20,
    bottom: 340,
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buildingsContainer: {
    backgroundColor: "#ffffff",
    position: "absolute",
    left: 20,
    bottom: 340,
    borderRadius: 20,
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 11,
    minWidth: 50,
    minHeight: 50
  },
  expandedBuildingsContainer: {
    width: 170,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
  },
  expandedButton: {
    width: 70,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  switchCampusButton: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    bottom: 115,
    left: 20,
    padding: 10,
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 20,
  },
  // Position button styles
  positionButtonsContainer: {
    position: "absolute",
    left: 20,
    bottom: 390, // Position above floor button container
    flexDirection: "column",
    alignItems: "center",
  },
  positionButton: {
    backgroundColor: "#ffffff",
    width: 50,
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  campusButtonText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelPOIText: {
    textField: ["coalesce", ["get", "name"], "Unnamed"],
    textSize: 14,
    textColor: "black",
    textHaloColor: "white",
    textHaloWidth: 1,
  },
  lineWall: {
    lineColor: "#922338",
    lineWidth: 2,
    lineOpacity: 1.0,
  },
  linePath: {
    lineColor: "black",
    lineWidth: 2,
    lineOpacity: 0.5,
  },
  roomLayer: {
    lineColor: "#922338",
    lineWidth: 2,
    lineOpacity: 1.0,
  },
  fillLayer: {
    fillColor: "#922338",
    fillOpacity: 0.2,
  }
});

export default styles;
