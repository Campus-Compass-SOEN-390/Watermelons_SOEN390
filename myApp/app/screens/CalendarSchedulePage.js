import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from '../styles/GoogleScheduleStyles';

export default function CalendarSchedulePage() {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedDayIndex = selectedDate.getDay(); // Sunday = 0

    // Example courses to design UI, will be fetched from calendar once connection is established
    const schedule = [
        { course: "SOEN 357 LEC", location: "MB3.330", time: "11:45–13:00" },
        { course: "SOEN 331 TUT", location: "H553", time: "2:45–4:05" },
        { course: "COMP 228 TUT", location: "H411", time: "4:15–5:30" },
    ];

    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <View style={styles.container}>
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButtons}>
                    <Ionicons name="home" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButtons}>
                    <Ionicons name="settings" size={28} color="black" />
                </TouchableOpacity>
            </View>

            {/* Days Navigation */}
            <View style={styles.daysRow}>
                {days.map((day, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.dayText,
                            index === selectedDayIndex && styles.highlightedDay,
                        ]}
                    >
                        {day}
                    </Text>
                ))}
            </View>

            {/* Schedule Header */}
            <Text style={styles.scheduleTitle}>Schedule</Text>

            {/* Schedule Cards */}
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {schedule.map((item, idx) => (
                    <View key={idx} style={styles.card}>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.courseText}>{item.course}</Text>
                            <Text>{item.location}</Text>
                            <Text>{item.time}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="directions" size={28} color="white" />
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation Buttons */}
            <View style={styles.todayButtonContainer}>
                <TouchableOpacity
                    style={styles.todayNavButton}
                    onPress={() =>
                        setSelectedDate(
                            new Date(selectedDate.setDate(selectedDate.getDate() - 1))
                        )
                    }
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.todayLabelWrapper}
                    onPress={() => setSelectedDate(new Date())}
                >
                    <Text style={styles.todayText}>
                        {selectedDate.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.todayNavButton}
                    onPress={() =>
                        setSelectedDate(
                            new Date(selectedDate.setDate(selectedDate.getDate() + 1))
                        )
                    }
                >
                    <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

