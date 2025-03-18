import { StyleSheet } from 'react-native';

export const calendarFetchingStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    flex: 1, // You may want this if you need the full screen
  },
  redContainer: {
    backgroundColor: '#922338',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 100,
  },
  whiteContainer: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: '90%',
    padding: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  connectButton: {
    backgroundColor: '#922338',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center', 
    minWidth: 100, 
    paddingHorizontal: 20, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- Success Screen Styles ---
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 20,
  },
  successSubtitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },

  // --- Event Item Styles ---
  eventItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  // --- Back Button Styles ---
backButton: {
    alignSelf: 'flex-start',
    marginTop: 40,  // Adjust this value to position it a bit lower
    marginLeft: 20, // Adjust as needed
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#922338',
    fontWeight: 'bold',
  },
  
});

export default calendarFetchingStyles;
