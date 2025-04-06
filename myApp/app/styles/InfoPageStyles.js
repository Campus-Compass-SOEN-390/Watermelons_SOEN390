import { StyleSheet } from 'react-native';
import { COLORS } from './constants';

export const infoPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.OFF_WHITE,
    paddingTop: 60,
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
    paddingTop: 40
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
    color: COLORS.DARK_GREY_TITLE,
  },
  subBullet: {
    fontSize: 15,
    marginLeft: 16,
    marginBottom: 8, 
    lineHeight: 20,
    color: COLORS.DARK_MODE_GREY,
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
    backgroundColor: COLORS.CONCORDIA_RED,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  pageName: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: 17,
  },
  //InforPage2 styles
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.DARK_GREY_TITLE,
    textAlign: 'center',
  },

  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  
  image: {
    width: '90%',
    maxWidth: 350,
    height: undefined,        // <-- Let aspect ratio determine height
    aspectRatio: 9 / 16,      // <-- Portrait screenshot
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY_INPUT_BOXES,
    backgroundColor: COLORS.WHITE,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  
  description: {
    fontSize: 18,                 // back to original size for clarity
    fontWeight: '600',           // make it bold
    textAlign: 'center',
    color: COLORS.DARK_MODE_DEEP_GREY,               // stronger contrast than #444
    lineHeight: 22,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
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
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.BLACK_OR_SHADOW,
  },
  //InfoPage 4 styles
  extraInfo: {
    marginTop: 20,
    marginBottom: 40,  // to give some spacing before the footer
    backgroundColor: COLORS.OFF_WHITE,
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
    aspectRatio: 284 / 598, 
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
    shadowColor: COLORS.BLACK_OR_SHADOW,
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
  backgroundColor: COLORS.WHITE,
  borderRadius: 10,
  overflow: 'hidden',
  elevation: 3,
  shadowColor: COLORS.BLACK_OR_SHADOW,
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
  color: COLORS.DARK_GREY_TITLE,
},
});