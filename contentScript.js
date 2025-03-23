console.log("Content script running...");

// ✅ Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from background:", message);

    if (message.type === "KEEP_ALIVE") {
        sendResponse({ status: "Content script is active" });
    }
});

// ✅ Detect explicit content (example detection)
document.addEventListener("DOMContentLoaded", () => {
    let detectedKeywords = ["DIE"]; // Replace with real detection logic

    if (detectedKeywords.length > 0) {
        console.log("Explicit content detected:", detectedKeywords);

        chrome.runtime.sendMessage({ 
            type: "EXPLICIT_CONTENT_DETECTED", 
            data: detectedKeywords 
        }, (response) => {
            console.log("Background response:", response);
        });
    }
});
