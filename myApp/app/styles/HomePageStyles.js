import { StyleSheet, Platform } from 'react-native';
import { FONT_SIZE_4 } from './constants';

export const homepageStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    logo:{
        width: 150, 
        height: 150 , 
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: Platform.OS === 'android' ? 0 : 70,
    },
    button: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row', // aligns item in a row
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        flex: 1,
        padding: 10,
        borderRadius: 20,
        margin: 10,
        //Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Blur radius of the shadow
        // Shadow for android
        elevation: 5,
    },
    buttonOrange: {
        backgroundColor: '#EE9479',
        flexDirection: 'row', // aligns item in a row
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        flex: 1,
        padding: 10,
        borderRadius: 20,
        margin: 10,
        //Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Blur radius of the shadow
        // Shadow for android
        elevation: 5,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row', // Align google logo and text in a row
        alignItems: 'center', // Align items vertically
        padding: 10,
        borderRadius: 20,
        margin: 10,
        height: 60,
        flex: 1,
        //Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Shadow for android
        elevation: 5, // Android shadow
    },
    buttonContainer: {
        flexDirection: 'row', // Align in a row
        justifyContent: 'space-evenly',
        width: '100%', 
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonsContainer: {
        backgroundColor: '#922338', 
        paddingVertical: 20,
        borderRadius: 20,    
        padding: 15,    
        marginVertical: 10,  
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Blur radius of the shadow
        // Shadow for android
        elevation: 5, // Android shadow
    },
    infoButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
        
    buttonText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: FONT_SIZE_4,
        flex: 1
    },
    googleButtonText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: FONT_SIZE_4,
        marginLeft: 8, // Adds space between google icon and text
        flex: 1
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    icon: {
        width: 30,
        height: 30, 
    }
});

export default homepageStyles;
