// Backend API URL
const API_URL = "https://ai-reading-assistant.onrender.com/api";

// Handle messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "summarize":
            summarizeText(request.text, request.mode, sendResponse);
            break;
        case "keypoints":
            extractKeyPoints(request.text, sendResponse);
            break;
        case "explain":
            explainTerm(request.term, request.context, sendResponse);
            break;
        case "openPopup":
            chrome.action.openPopup();
            break;
        default:
            sendResponse({ error: "Unknown action" });
    }

    // Return true to indicate that we will send a response asynchronously
    return true;
});

// Summarize text
function summarizeText(text, mode, callback) {
    fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mode }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to summarize text");
            }
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.error("Error summarizing text:", error);
            callback({ error: error.message });
        });
}

// Extract key points
function extractKeyPoints(text, callback) {
    fetch(`${API_URL}/keypoints`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to extract key points");
            }
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.error("Error extracting key points:", error);
            callback({ error: error.message });
        });
}

// Explain term
function explainTerm(term, context, callback) {
    fetch(`${API_URL}/explain`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ term, context }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to explain term");
            }
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.error("Error explaining term:", error);
            callback({ error: error.message });
        });
}
