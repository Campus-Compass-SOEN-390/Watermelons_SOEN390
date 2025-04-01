import { StyleSheet } from 'react-native';
// import { Dimensions } from 'react-native';
// const { width, height } = Dimensions.get('window');

export const infoPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 30,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignSelf: 'stretch',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  }, 
  welcome: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  featureTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bullets: {
    paddingLeft: 6,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    color: '#333',
  },
  subBullet: {
    fontSize: 15,
    marginLeft: 16,
    marginBottom: 8, 
    lineHeight: 20,
    color: '#444',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#800020',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  pageName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
  },
  //InforPage2 styles
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  
  // image: {
  //   width: '100%',
  //   height: 300,
  //   borderRadius: 12,
  //   marginBottom: 20,
  // },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  
  image: {
    width: '90%',
    maxWidth: 350,
    height: undefined,        // <-- Let aspect ratio determine height
    aspectRatio: 9 / 16,      // <-- Portrait screenshot
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  
  description: {
    fontSize: 18,                 // back to original size for clarity
    fontWeight: '600',           // make it bold
    textAlign: 'center',
    color: '#222',               // stronger contrast than #444
    lineHeight: 22,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },

  //InfoPage 3 / video styles
  videoWrapper: {
    width: '90%',
    aspectRatio: 372 / 658,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  //InfoPage 4 styles
  extraInfo: {
    marginTop: 20,
    marginBottom: 40,  // to give some spacing before the footer
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  
    // NEW style for second video with different dimensions
  videoWrapper2: {
    width: '90%',
    // For example, if you want a 16:9 aspect ratio:
    aspectRatio: 16 / 9,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

    // NEW style for second video with different dimensions
  videoWrapper2: {
    width: '90%',
    aspectRatio: 284 / 598, 
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
},


horizontalImageRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 16,
  gap: 8,
},

squareImageWrapper: {
  width: '48%',
  aspectRatio: 3 / 4,
  backgroundColor: '#fff',
  borderRadius: 10,
  overflow: 'hidden',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

squareImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},

horizontalButtonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 10,
  gap: 10,
},

squareButton: {
  backgroundColor: '#eee',
  width: '48%',
  aspectRatio: 1,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
},

buttonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},

  
  
});
