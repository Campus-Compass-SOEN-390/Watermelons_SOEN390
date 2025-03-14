const fetchCalendars = async (accessToken) => {
    try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        console.log('Calendars:', data);
    } catch (error) {
        console.error(error);
    }
};
