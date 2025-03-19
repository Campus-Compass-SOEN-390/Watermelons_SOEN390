import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    topNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerButtons: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    logoutButton: {
        backgroundColor: "#d3d3d3",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
    },
    logoutText: {
        fontWeight: "bold",
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
    },
    dayText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "gray",
    },
    highlightedDay: {
        color: "#800020",
        textDecorationLine: "underline",
        fontWeight: "bold",
    },
    scheduleTitle: {
        fontSize: 20,
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
        fontSize: 16,
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
        borderRadius: 20,
    },
    todayLabelWrapper: {
        backgroundColor: "#800020",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 8,
    },
    todayText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});

export default styles;