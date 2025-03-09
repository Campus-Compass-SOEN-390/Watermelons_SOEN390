import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#922338", // Updated to app's primary color
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#922338",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120, // Extra space for tab bar
  },
  poiItem: {
    backgroundColor: "white",
    borderRadius: 28, // Increased to match app's rounded corners
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Increased to match app's elevation
    overflow: "hidden",
  },
  poiContent: {
    padding: 15,
  },
  poiImage: {
    height: 180, // Increased image height
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#f0f0f0", // Background color while image loads
  },
  noImagePlaceholder: {
    height: 120,
    width: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  noImageText: {
    color: "#888",
    fontSize: 16,
    marginTop: 8,
  },
  poiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  poiName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  poiDistance: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    fontWeight: "500",
  },
  poiAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  cafeBadge: {
    backgroundColor: "#FFCDD2", // Light red
  },
  restaurantBadge: {
    backgroundColor: "#C8E6C9", // Light green
  },
  activityBadge: {
    backgroundColor: "#BBDEFB", // Light blue
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80, // Account for tab bar
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: "#922338", // Updated to app's theme
    textAlign: "center",
    padding: 20,
    lineHeight: 22,
  },
  // Rating badge
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
    color: "#FF8F00",
  },
  // Get Directions Button
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#922338", // App's primary color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  directionsButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
});
