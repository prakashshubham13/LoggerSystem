import { useEffect, useState } from "react";

const channel = "2"; // Change this to any channel

function New() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8098/logs/${channel}/subscribe`);
    
        eventSource.onmessage = (event) => {
            console.log("Received message", event.data);
            let parsedData = JSON.parse(event.data);
            console.log("Parsed data", parsedData);
            console.log();
            
            
            setNotifications((prev) => [...prev, event.data]);
        };
    
        // eventSource.onerror = () => {
        //     console.error("SSE connection lost. Reconnecting...");
        //     setTimeout(() => {
        //         window.location.reload();
        //     }, 5000);
        // };
    
        return () => eventSource.close();
    }, []);
    
    return (
        <div>
            <h2>Notifications for {channel}</h2>
            <ul>
                {notifications.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

export default New;
