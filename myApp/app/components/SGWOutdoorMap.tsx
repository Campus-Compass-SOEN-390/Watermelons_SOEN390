// import React, { useRef, useState, useEffect, Fragment } from "react";
// import { View, TouchableOpacity, Text, Modal } from "react-native";
// import MapView, { Marker, Polygon } from "react-native-maps";
// import { MaterialIcons } from "@expo/vector-icons";
// import { isPointInPolygon } from "geolib";
// import useLocation from "../hooks/useLocation";
// import styles from "../styles/OutdoorMapStyles";
// import { buildings, Campus, getBuildingById, Building } from "../api/buildingData";
// import { BuildingPopup } from "../components/BuildingPopUp";

// const SGWOutdoorMap = () => {
//   const { location, hasPermission } = useLocation();
//   const mapRef = useRef<MapView | null>(null);
//   const [showLocating, setShowLocating] = useState(true);
//   const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
//   const [highlightedBuilding, setHighlightedBuilding] = useState<string | null>(null);
//   const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
//   const [popupVisible, setPopupVisible] = useState(false);

//   // Default region for SGW Campus
//   const campusRegion = {
//     latitude: 45.4951962,
//     longitude: -73.5792229,
//     latitudeDelta: 0.005,
//     longitudeDelta: 0.005,
//   };

//   useEffect(() => {
//     if (location) {
//       setShowLocating(false);
//       // Filter only SGW buildings that have coordinates
//       const sgwBuildings = buildings.filter(
//         (b) =>
//           b.campus === Campus.SGW &&
//           b.coordinates &&
//           b.coordinates.length > 0
//       );
//       let found = false;
//       sgwBuildings.forEach((building) => {
//         if (isPointInPolygon(location, building.coordinates!)) {
//           console.log("User is inside building:", building.name);
//           setHighlightedBuilding(building.name);
//           found = true;
//         }
//       });
//       if (!found) {
//         setHighlightedBuilding(null);
//       }
//     }
//     if (!hasPermission) {
//       setShowPermissionPopup(true);
//     }
//   }, [location, hasPermission]);

//   const centerMapOnUser = () => {
//     if (location && mapRef.current) {
//       mapRef.current.animateToRegion(
//         {
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         },
//         1000
//       );
//     }
//   };

//   const centerMapOnCampus = () => {
//     if (mapRef.current) {
//       mapRef.current.animateToRegion(campusRegion, 1000);
//     }
//   };

//   const handleBuildingPress = (building: Building) => {
//     console.log("Polygon pressed for building:", building.name);
//     const fullBuilding = getBuildingById(building.id);
//     if (fullBuilding) {
//       console.log("Setting popup for building:", fullBuilding.name);
//       setSelectedBuilding(fullBuilding);
//       setPopupVisible(true);
//     } else {
//       console.error("Building data is incomplete!", building);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={(ref) => (mapRef.current = ref)}
//         style={styles.map}
//         initialRegion={campusRegion}
//         showsUserLocation={true}
//       >
//         {/* SGW Campus Marker */}
//         <Marker
//           coordinate={{
//             latitude: campusRegion.latitude,
//             longitude: campusRegion.longitude,
//           }}
//           title="SGW Campus"
//           description="Outdoor Map Location"
//         />

//         {/* User Location Marker */}
//         {location && (
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title="You Are Here"
//             pinColor="blue"
//           />
//         )}

//         {/* Render SGW building polygons with fallback invisible markers */}
//         {buildings
//           .filter(
//             (building) =>
//               building.campus === Campus.SGW &&
//               building.coordinates &&
//               building.coordinates.length > 0
//           )
//           .map((building) => {
//             // Use the first coordinate as a fallback "center"
//             const center = building.coordinates![0];
//             return (
//               <Fragment key={building.id}>
//                 <Polygon
//                   coordinates={building.coordinates!}
//                   fillColor={
//                     highlightedBuilding === building.name
//                       ? "rgba(0, 0, 255, 0.4)"
//                       : "rgba(255, 0, 0, 0.4)"
//                   }
//                   strokeColor={
//                     highlightedBuilding === building.name ? "blue" : "red"
//                   }
//                   strokeWidth={5} // increased for better tap area
//                   tappable
//                   onPress={() => handleBuildingPress(building)}
//                 />
//                 {/* Invisible marker fallback */}
//                 <Marker
//                   coordinate={center}
//                   opacity={0}
//                   onPress={() => handleBuildingPress(building)}
//                 />
//               </Fragment>
//             );
//           })}
//       </MapView>

//       {/* Floating Buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
//           <MaterialIcons name="my-location" size={24} color="white" />
//           {showLocating && <Text style={styles.debugText}>Locating...</Text>}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
//           <MaterialIcons name="place" size={24} color="white" />
//           <Text style={styles.debugText}>SGW</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal for Location Permission Denial */}
//       <Modal visible={showPermissionPopup} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Location Permission Denied</Text>
//             <Text style={styles.modalText}>
//               Location access is required to show your current location on the map.
//               Please enable location permissions in your settings.
//             </Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setShowPermissionPopup(false)}
//             >
//               <Text style={styles.closeButtonText}>X</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Building Popup */}
//       <BuildingPopup
//         visible={popupVisible}
//         onClose={() => {
//           setPopupVisible(false);
//           setSelectedBuilding(null);
//         }}
//         building={selectedBuilding}
//       />
//     </View>
//   );
// };

// export default SGWOutdoorMap;
