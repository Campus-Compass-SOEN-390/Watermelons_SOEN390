import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

const OutdoorMap = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to interest points screen
    router.replace('/interest-points');
  }, []);

  return (
    <View>
      {/* This view will only be displayed briefly before redirection */}
    </View>
  );
};

export default OutdoorMap;