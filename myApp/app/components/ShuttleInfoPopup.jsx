// import React from "react";
// import { View, Text, Modal, TouchableOpacity } from "react-native";
// import { shuttlePopupStyles as styles } from "../styles/shuttlePopupStyles"; // ✅ Corrected Import

// const ShuttleInfoPopup = ({ visible, onClose, shuttleTime, nextShuttle }) => {
//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent
//       onRequestClose={onClose} // Close when clicking outside (Android back button)
//     >
//       <View style={styles.overlay}>
//         <View style={styles.popup}>
//           <Text style={styles.title}>🚍 Shuttle Information</Text>

//           {nextShuttle !== "No buses available" ? (
//             <>
//               <Text style={styles.text}>⏳ Next Shuttle: {nextShuttle}</Text>
//               <Text style={styles.text}>🚌 Estimated Travel Time: {shuttleTime} min</Text>
//             </>
//           ) : (
//             <Text style={styles.alertText}>❌ No shuttle available at this time.</Text>
//           )}

//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ShuttleInfoPopup;
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import { shuttlePopupStyles } from "../styles/shuttlePopupStyles";





export const ShuttleInfoPopup = ({ visible, onClose, shuttleDetails }) => {
    console.log("ShuttleInfoPopup received visible:", visible);
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose} // Handles Android back button
        >
            <View style={shuttlePopupStyles .overlay}>
                <View style={shuttlePopupStyles.popup}>
                    <Text style={shuttlePopupStyles.title}>Shuttle Information</Text>
                    
                    {shuttleDetails ? (
                        <>
                            <Text style={shuttlePopupStyles.text}>⏳ Wait Time: {shuttleDetails.waitTime} min</Text>
                            <Text style={shuttlePopupStyles.text}>🚌 Travel Time: {shuttleDetails.shuttleRideTime} min</Text>
                            <Text style={shuttlePopupStyles.text}>⏱ Total Time: {shuttleDetails.totalTime} min</Text>
                        </>
                    ) : (
                        <Text style={shuttlePopupStyles.alertText}>No bus available.</Text>
                    )}

                    {/* Close Button */}
                    <TouchableOpacity
                        style={shuttlePopupStyles.closeButton}
                        onPress={onClose}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                        <Text style={shuttlePopupStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default ShuttleInfoPopup;
