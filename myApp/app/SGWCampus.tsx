import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SGWOutdoorMap from "./components/SGWOutdoorMap";
import styles from "./styles/OutdoorMapStyles"

type NavigationProp = {
    navigate: (screen: string) => void;
  };
  
export default function SGWCampus() {

  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("LoyolaCampus");
  };

    return (
        <View style={styles.containerForMap}>
            <Text style={styles.titleForMap}>Welcome to SGW Campus</Text>
            <SGWOutdoorMap />
            <Button title="Loyola Campus" onPress={handlePress} color= "#922338"/>
        </View>
    );
}