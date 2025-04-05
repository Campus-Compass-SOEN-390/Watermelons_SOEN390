import { StyleSheet } from "react-native";

const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "95%",
    maxHeight: "85%",
    maxWidth: 400,
    position: "relative",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 300,      
    width: "100%", 
  },
  infoSection: {
    gap: 10,
    width: "100%",  
  },
  buildingName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subName: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap", 
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
    color: "#333",
    flexShrink: 0,
  },
  text: {
    flex: 1,    
    flexShrink: 1,
    flexGrow: 1,             
    fontSize: 14,
    color: "#333",
    textAlign: "left",
  },
  
  boldLabel: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly", // better spacing across devices
    flexWrap: "wrap",               // allow wrapping on smaller screens
    marginTop: 20,
    gap: 10,
  
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,          // slightly less to avoid overflow
    borderRadius: 30,
    flexGrow: 1,                    // let buttons stretch evenly
    flexBasis: "48%",              // responsive two-column layout
    flexWrap: "nowrap",
    minWidth: 140,                 // slightly smaller for narrow screens
    maxWidth: "100%",
  },
  redButton: {
    backgroundColor: "#8b0000",
  },
  grayButton: {
    backgroundColor: "#4a4a4a",
  },
  buttonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 15,
  },
  alertText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  iconCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
});

export default popupStyles;
