import React from "react";
import axios from "axios";

// Step 1: Function to get session cookies
const getSessionCookies = async () => { 
  const session = axios.create({
    withCredentials: true, // Ensures cookies are stored
    headers: { "Host": "shuttle.concordia.ca" }
  });

  await session.get("https://shuttle.concordia.ca/concordiabusmap/Map.aspx");
  return session;
};

// Step 2: Fetch real-time shuttle locations
export const getRealTimeShuttleData = async () => {
  try {
    // Get session cookies
    const session = await getSessionCookies();

    // Make the POST request
    const response = await session.post(
      "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
      {},
      {
        headers: {
          "Host": "shuttle.concordia.ca",
          "Content-Length": "0",
          "Content-Type": "application/json; charset=UTF-8"
        }
      }
    );

    // In case the response is empty 
    if (!response.data) {
      //console.error("Error fetching real-time shuttle data: Received empty response from the server.");
      throw new Error("Received empty response from the server."); 
    }

    return response.data;
  } catch (error) {
    
    if (error.message !== "Received empty response from the server.") {
      //console.error("Error fetching real-time shuttle data:", error.message);
      throw new Error("Could not retrieve shuttle data."); 
    }

    throw error; // Re-throw the empty response error
  }
};
