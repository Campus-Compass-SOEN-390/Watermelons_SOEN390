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
      throw new Error("Received empty response from the server."); 
    }

    return response.data;
  } catch (error) {
    
    if (error.message !== "Received empty response from the server.") {
      throw new Error("Could not retrieve shuttle data."); 
    }

    throw error; // Re-throw the empty response error
  }

  
};

// Step 3: Extract relevant shuttle data
export const extractShuttleInfo = async () => {
  try {
    // Fetch the raw shuttle data first
    const rawData = await getRealTimeShuttleData();

    // Check if the expected structure is present
    if (!Array.isArray(rawData?.d?.Points)) {
      throw new Error("Invalid data format received.");
    }

    // Extract the shuttle information
    return rawData.d.Points
      .filter(point => point.ID?.startsWith("BUS")) // Using optional chaining
      .map(bus => ({
        id: bus.ID,
        latitude: bus.Latitude || 0, // Default to 0 if undefined
        longitude: bus.Longitude || 0, // Default to 0 if undefined
        timestamp: new Date().toISOString(), // Add timestamp
      }));
     

  } catch (error) {
    throw new Error("Error processing shuttle data.");
  }
};


export default { getRealTimeShuttleData, extractShuttleInfo };

