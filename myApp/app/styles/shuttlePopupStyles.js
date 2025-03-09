import { StyleSheet } from 'react-native';

export const shuttlePopupStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.8)", // Increase opacity to check if it's hidden
    },
    
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    elevation: 6, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF", // Blue for shuttle theme
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  alertText: {
    fontSize: 18,
    color: "#FF3B30", // Red if no shuttle available
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "60%",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default shuttlePopupStyles;
