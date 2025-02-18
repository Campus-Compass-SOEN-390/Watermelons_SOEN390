import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import LoyolaOutdoorMap from "./components/LoyolaOutdoorMap";
import styles from "./styles/OutdoorMapStyles"
import { useNavigation } from "@react-navigation/native";

type NavigationProp = {
    navigate: (screen: string) => void;
  };

export default function LoyolaCampus() {

    const navigation = useNavigation<NavigationProp>();
    
      const handlePress = () => {
        navigation.navigate("SGWCampus");
      };

    return (
        <View style={styles.containerForMap}>
            <Text style={styles.titleForMap}>Welcome to Loyola Campus</Text>
            <LoyolaOutdoorMap />
            <Button title="SGW Campus" onPress={handlePress} color= "#922338" />
        </View>
    );
}

