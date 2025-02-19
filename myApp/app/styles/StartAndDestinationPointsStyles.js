import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        position: 'absolute',
        top: 140,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 3,
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 50,
        textAlign: 'right',
        position: "relative",
        right: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#eee',
        borderRadius: 7,
        paddingHorizontal: 10,
        height: 40,
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        width: '125.8%',
        left: '-65',
        backgroundColor: 'white',
        borderRadius: 28,
        elevation: 5,
        maxHeight: 150,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    button: {
        backgroundColor: '#eee',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 7,
        alignSelf: 'flex-start',
        marginTop: 5,
        position: "absolute",
        top: 120,
        left: 10,
        elevation: 40,
        shadowColor: "black",
    },
    buttonText: {
        fontSize: 14,
        color: 'black',
        
    }
});