import { StyleSheet } from "react-native";
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM, FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_5 } from "./constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
    },
    dayText: {
        fontSize: FONT_SIZE_2,
        fontWeight: "bold",
        color: "gray",
    },
    highlightedDay: {
        color: "#800020",
        textDecorationLine: "underline",
        fontWeight: "bold",
    },
    scheduleTitle: {
        fontSize: FONT_SIZE_5,
        fontWeight: "bold",
        marginBottom: 8,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#E5E5E5",
        borderRadius: 16,
        padding: 16,
        marginVertical: 6,
        alignItems: "center",
    },
    cardTextContainer: {
        flex: 1,
    },
    courseText: {
        fontWeight: "bold",
        fontSize: FONT_SIZE_3,
        marginBottom: 4,
    },
    iconContainer: {
        backgroundColor: "#800020",
        padding: 10,
        borderRadius: 12,
        marginLeft: 8,
    },
    todayButtonContainer: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    todayNavButton: {
        backgroundColor: "#800020",
        padding: 10,
        borderRadius: 20
    },
    todayLabelWrapper: {
        backgroundColor: "#800020",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 8,
        width: 150,
    },
    todayText: {
        color: "white",
        fontWeight: "bold",
        fontSize: FONT_SIZE_3,
        textAlign: "center",
    },
    nextClassDirections: {
        backgroundColor: "#800020",
        padding: 10,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12,
    },
    nextClassButtonText: {
        color: "white",
    }
});

export default styles;