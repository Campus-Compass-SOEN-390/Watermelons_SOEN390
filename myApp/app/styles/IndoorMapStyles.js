import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
    },
    floorButtonContainer: {
        backgroundColor: "#ffffff",
        position: "absolute",
        left: 20,
        bottom: 225, 
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
        bottom: 165,
        borderRadius: 20,
        shadowColor: "#000",
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 11,
        minWidth: 50,
        minHeight: 50,
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
    },
});

export default styles;