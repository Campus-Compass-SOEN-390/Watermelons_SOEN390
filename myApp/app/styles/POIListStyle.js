import { StyleSheet } from "react-native";
import { FONT_SIZE_1, FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4 } from "./constants";

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
    fontSize: FONT_SIZE_3,
    marginTop: 8,
  },
  poiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  poiName: {
    fontSize: FONT_SIZE_4,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  poiDistance: {
    fontSize: FONT_SIZE_2,
    color: "#666",
    marginLeft: 10,
    fontWeight: "500",
  },
  poiAddress: {
    fontSize: FONT_SIZE_2,
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
    fontSize: FONT_SIZE_1,
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
    fontSize: FONT_SIZE_3,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: FONT_SIZE_3,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  errorText: {
    fontSize: FONT_SIZE_3,
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
    fontSize: FONT_SIZE_1,
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
    fontSize: FONT_SIZE_2,
  },
  // Footer component styles
  footerContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: FONT_SIZE_2,
    color: "#666",
  },
  // Scroll to top button styles
  scrollTopButton: {
    position: 'absolute',
    bottom: 90, // Position above tab bar
    right: 20,
    backgroundColor: '#922338', // Match app's primary color
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  scrollTopButtonTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
