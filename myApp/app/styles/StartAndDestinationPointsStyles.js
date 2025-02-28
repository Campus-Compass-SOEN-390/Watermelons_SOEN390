import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
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
        position: "relative",
    },
    dropdownFrom: {
        position: 'absolute',
        top: 93,
        width: '125.8%',
        left: -65,
        backgroundColor: 'white',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 28,
        borderBottomLeftRadius: 28,
        elevation: 5,
        maxHeight: 150,
        zIndex: 10,
    },

    dropdownTo: {
        position: 'absolute',
        top: 40,
        width: '125.8%',
        left: -65,
        backgroundColor: 'white',
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
    },
    buttonContainer: {
        flexDirection: 'row',       
        justifyContent: 'space-between',
        paddingHorizontal: 10,          
        marginTop: 10,                 
    },
    footerContainer: {
        position: "absolute",
        
        bottom: -575, 
        left: -12,   
        right: 0,   
        height: 80,
        marginHorizontal: "auto",  
        width: 375, 
        backgroundColor: "#ffffff",
        borderRadius: 20, 
        shadowColor: "#000",
        flexDirection: "row",  
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, 
        shadowRadius: 10,
        paddingVertical: 12, 
        paddingHorizontal: 18,
        justifyContent: "space-between", 
        alignItems: "center",
        elevation: 5, 
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
          transition: "background-color 0.3s ease", 
        },
        
        goButton: {
          fontSize: 8,
          backgroundColor: "#0FA958",  
          padding:10,
          paddingHorizontal: 20, 
          borderRadius: 10, 
      
        },
    
        
        stepsButton: {
          backgroundColor: "#393a41", 
          padding:10,
          paddingHorizontal: 20, 
          borderRadius: 10, 
      
      
        },
        
        favoriteButton: {
          backgroundColor: "#393a41", 
          padding:10,
          paddingHorizontal: 20, 
          borderRadius: 10,  
      
      
        },
        
        footerButtonText: {
          color: "white",
          fontSize: 13,
          fontWeight: "bold",
        },
          // Modal styles remain the same:
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
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
        },
        modalText: {
            fontSize: 14,
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
            fontSize: 16,
          },
});