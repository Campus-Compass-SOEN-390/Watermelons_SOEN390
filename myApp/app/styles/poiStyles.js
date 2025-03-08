// src/styles/poiStyles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1E88E5",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
  },
  filterButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "white",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
  },
  button: {
    marginVertical: 5,
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 5,
  },
  updateButtonContainer: {
    position: "absolute",
    bottom: 320,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 5,
  },
  updateButton: {
    padding: 10,
  },
  updateButtonText: {
    color: "#1E88E5",
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
  },
});
