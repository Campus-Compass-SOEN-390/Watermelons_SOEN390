import { Text, View } from "react-native";
import { useEffect, React } from "react";
// import RNUxcam from "react-native-ux-cam";

export default function Favorites() {
  // Add this useEffect hook for UXCam screen tagging
  // useEffect(() => {
  //   // Tag this screen in UXCam
  //   RNUxcam.tagScreenName("FavoritesPage");
  // }, []);

  return (
    <View>
      <Text> This is the Favorites page </Text>
    </View>
  );
}
