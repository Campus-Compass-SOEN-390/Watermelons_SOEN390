import { StyleSheet } from "react-native";
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM, FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_5, FONT_SIZE_1 } from "./constants";

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
    nextClassContainer: {
        marginVertical: 12,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        alignItems: 'center',
    },
    nextClassInfoText: {
        fontSize: FONT_SIZE_2,
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500',
    },
    nextClassDirections: {
        backgroundColor: '#800020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 8,
    },
    nextClassDetailsText: {
        color: 'white',
        fontSize: FONT_SIZE_1,
        marginTop: 6,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    nextClassButtonText: {
        color: 'white',
        fontSize: FONT_SIZE_3,
        fontWeight: 'bold',
    },
    noClassText: {
        fontSize: FONT_SIZE_3,
        color: '#666',
        textAlign: 'center',
        padding: 20,
        fontStyle: 'italic'
    }
});

export default styles;