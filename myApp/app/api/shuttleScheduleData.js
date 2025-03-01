import React from "react";

export const shuttleSchedule = {
    "Monday": {
      LOY: ["9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"],
      SGW: ["9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30","12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "16:00", "16:15", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"]
    },
    
    "Tuesday": {
      LOY: ["9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"],
      SGW: ["9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30","12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "16:00", "16:15", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"]
    }, 
    
    "Wednesday": {
      LOY: ["9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"],
      SGW: ["9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30","12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "16:00", "16:15", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"]
    },

    "Thursday": {
      LOY: ["9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"],
      SGW: ["9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30","12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "16:00", "16:15", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"]
    },

    "Friday": {
      LOY: ["9:15", "9:30", "9:45", "10:15", "10:45", "11:00", "11:15", "12:00", "12:15", "12:45", "13:00", "13:15", "13:45", "14:15", "14:30", "14:45", "15:15", "15:30", "15:45", "16:45", "17:15", "17:45", "18:15"],
      SGW: ["9:45", "10:00", "10:15", "10:45", "11:15", "11:30", "12:15", "12:30", "12:45", "13:15", "13:45", "14:00", "14:15", "14:45", "15:00", "15:15", "15:45", "16:00", "16:45", "17:15", "17:45", "18:15"]
    }
  };

  // Fetch all schedule
export const getAllShuttleSchedules = () => {
  if (!shuttleSchedule || Object.keys(shuttleSchedule).length === 0) {
    throw new Error("Shuttle schedule data is empty.");
  }
  return shuttleSchedule; 
};

// Fetch a specific day's schedule
export const getShuttleScheduleByDay = (day) => {
  if (!day || typeof day !== "string" || day.trim() === "") {
      console.error("Invalid day format received:", day);
      return null;
  }

  const normalizedDay = day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase();
  
  if (!shuttleSchedule[normalizedDay]) {
      console.error(`No schedule available for: ${day}`);
      return null; // Prevent crashing if the day is not found.
  }

  return shuttleSchedule[normalizedDay];
};

// Default export
export default shuttleSchedule;