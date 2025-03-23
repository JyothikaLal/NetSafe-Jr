console.log("Background script activated!");

// ✅ Keep service worker alive
chrome.alarms.create("keepAlive", { periodInMinutes: 4 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Keeping service worker alive...");
    }
});

// ✅ Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "EXPLICIT_CONTENT_DETECTED") {
        fetch("http://localhost:3000/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: message.data })
        })
        .then(response => response.json())
        .then(data => console.log("Server response:", data))
        .catch(error => console.error("Fetch error:", error));

        sendResponse({ received: true });
    }

    return true; // Ensures async sendResponse works
});

// ✅ Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

// ✅ Log when extension starts
chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started, service worker running...");
});
