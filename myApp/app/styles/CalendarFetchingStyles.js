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
    alignItems: 'center',
    marginBottom: 20,
    width: 100,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#922338',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
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
});

export default calendarFetchingStyles;
