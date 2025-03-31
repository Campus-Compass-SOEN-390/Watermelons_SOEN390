import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function UpcomingClass() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/screens/CalendarFetching");
  }, []);

  return null;
}
