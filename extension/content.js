// Import TTS functionality
let ttsModule;

// Create and inject the floating toolbar
function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "ai-reading-assistant-toolbar";
    toolbar.innerHTML = `
    <div class="toolbar-buttons">
      <button id="ai-summarize" title="Summarize Article">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="17" y1="12" x2="3" y2="12"></line>
          <line x1="13" y1="18" x2="3" y2="18"></line>
        </svg>
        Summarize
      </button>
      <button id="ai-keypoints" title="Extract Key Points">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        Key Points
      </button>
      <button id="ai-explain" title="Explain Selection">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        Explain
      </button>
      <button id="ai-tts" title="Text to Speech">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        Read Aloud
      </button>
      <button id="ai-settings" title="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
      <button id="ai-toggle" title="Toggle Toolbar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

    document.body.appendChild(toolbar);

    // Add event listeners to toolbar buttons
    document
        .getElementById("ai-summarize")
        .addEventListener("click", summarizeArticle);
    document
        .getElementById("ai-keypoints")
        .addEventListener("click", extractKeyPoints);
    document
        .getElementById("ai-explain")
        .addEventListener("click", explainSelection);
    document.getElementById("ai-tts").addEventListener("click", readAloud);
    document
        .getElementById("ai-settings")
        .addEventListener("click", openSettings);
    document
        .getElementById("ai-toggle")
        .addEventListener("click", toggleToolbar);

    // Load TTS module
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("tts.js");
    script.onload = function () {
        ttsModule = window.AIReadingAssistantTTS;
    };
    document.head.appendChild(script);
}

// Create popup container for results
function createPopupContainer() {
    let container = document.getElementById("ai-reading-assistant-popup");

    if (!container) {
        container = document.createElement("div");
        container.id = "ai-reading-assistant-popup";
        container.className = "ai-reading-assistant-popup";
        container.innerHTML = `
      <div class="popup-header">
        <h2>AI Reading Assistant</h2>
        <div class="popup-controls">
          <button id="ai-popup-tts" title="Read Aloud">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
          <button id="ai-popup-close" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="popup-content">
        <div class="loading-spinner">Loading...</div>
      </div>
    `;
        document.body.appendChild(container);

        // Make popup draggable
        makeDraggable(container);

        // Add event listeners
        document
            .getElementById("ai-popup-close")
            .addEventListener("click", () => {
                container.classList.remove("active");
            });

        document
            .getElementById("ai-popup-tts")
            .addEventListener("click", () => {
                const content =
                    document.querySelector(".popup-content").textContent;
                if (ttsModule && content) {
                    ttsModule.speak(content);
                }
            });
    }

    return container;
}

// Get main content from the page
function getPageContent() {
    // Try to get the main content
    const article = document.querySelector("article");
    if (article) return article.innerText;

    // If no article tag, try common content selectors
    const mainContent = document.querySelector(
        "main, #content, .content, .article, .post"
    );
    if (mainContent) return mainContent.innerText;

    // Fallback to body text, excluding scripts and styles
    const bodyText = Array.from(
        document.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li")
    )
        .map((el) => el.innerText)
        .join("\n\n");

    return bodyText || document.body.innerText;
}

// Summarize article
function summarizeArticle() {
    const popup = createPopupContainer();
    popup.classList.add("active");

    const content = getPageContent();

    // Get summary mode from settings
    chrome.storage.sync.get({ summaryMode: "brief" }, function (items) {
        // Send message to background script to get summary
        chrome.runtime.sendMessage(
            {
                action: "summarize",
                text: content,
                mode: items.summaryMode,
            },
            function (response) {
                const popupContent = document.querySelector(".popup-content");

                if (response && response.summary) {
                    popupContent.innerHTML = `
          <div class="summary-container">
            <h3>Summary (${items.summaryMode})</h3>
            <div class="summary-text">${response.summary}</div>
          </div>
        `;
                } else {
                    popupContent.innerHTML = `
          <div class="error-message">
            Failed to generate summary. Please try again.
          </div>
        `;
                }
            }
        );
    });
}

// Extract key points
function extractKeyPoints() {
    const popup = createPopupContainer();
    popup.classList.add("active");

    const content = getPageContent();

    // Send message to background script to get key points
    chrome.runtime.sendMessage(
        {
            action: "keypoints",
            text: content,
        },
        function (response) {
            const popupContent = document.querySelector(".popup-content");

            if (
                response &&
                response.keyPoints &&
                response.keyPoints.length > 0
            ) {
                const keyPointsHTML = response.keyPoints
                    .map((point) => `<li>${point}</li>`)
                    .join("");

                popupContent.innerHTML = `
        <div class="keypoints-container">
          <h3>Key Points</h3>
          <ul class="keypoints-list">
            ${keyPointsHTML}
          </ul>
        </div>
      `;
            } else {
                popupContent.innerHTML = `
        <div class="error-message">
          Failed to extract key points. Please try again.
        </div>
      `;
            }
        }
    );
}

// Explain selected text
function explainSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
        alert("Please select text to explain.");
        return;
    }

    // Get surrounding context
    let context = "";
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        // Get paragraph or nearest block element
        const contextElement =
            container.nodeType === Node.TEXT_NODE
                ? container.parentElement
                : container;

        if (contextElement) {
            context = contextElement.innerText;
        }
    }

    // Create explanation popup
    const popup = document.createElement("div");
    popup.className = "ai-reading-assistant-explanation";
    popup.innerHTML = `
    <div class="explanation-content">
      <div class="loading-spinner">Loading...</div>
    </div>
    <button class="explanation-close">×</button>
  `;

    // Position popup near selection
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;

    document.body.appendChild(popup);

    // Make explanation popup draggable
    makeDraggable(popup);

    // Add close button event listener
    popup.querySelector(".explanation-close").addEventListener("click", () => {
        popup.remove();
    });

    // Send message to background script to get explanation
    chrome.runtime.sendMessage(
        {
            action: "explain",
            term: selectedText,
            context: context,
        },
        function (response) {
            const explanationContent = popup.querySelector(
                ".explanation-content"
            );

            if (response && response.explanation) {
                explanationContent.innerHTML = `
        <div class="term">${selectedText}</div>
        <div class="explanation">${response.explanation}</div>
      `;
            } else {
                explanationContent.innerHTML = `
        <div class="error-message">
          Failed to explain term. Please try again.
        </div>
      `;
            }
        }
    );
}

// Read aloud
function readAloud() {
    if (!ttsModule) {
        alert("Text-to-speech module is not loaded. Please refresh the page.");
        return;
    }

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Get settings
    chrome.storage.sync.get(
        {
            speechRate: 1.0,
            speechPitch: 1.0,
            speechVoice: "",
        },
        function (items) {
            // Configure TTS
            ttsModule.setRate(items.speechRate);
            ttsModule.setPitch(items.speechPitch);

            if (items.speechVoice) {
                ttsModule.setVoice(items.speechVoice);
            }

            // Read selected text or page content
            if (selectedText) {
                ttsModule.speak(selectedText);
            } else {
                ttsModule.speak(getPageContent());
            }
        }
    );
}

// Open settings popup
function openSettings() {
    chrome.runtime.sendMessage({ action: "openPopup" });
}

// Toggle toolbar visibility
function toggleToolbar() {
    const toolbar = document.querySelector(".ai-reading-assistant-toolbar");
    toolbar.classList.toggle("collapsed");

    // Save state
    chrome.storage.sync.set({
        toolbarCollapsed: toolbar.classList.contains("collapsed"),
    });
}

// Initialize extension
function init() {
    createToolbar();

    // Check if toolbar should be collapsed
    chrome.storage.sync.get({ toolbarCollapsed: false }, function (items) {
        if (items.toolbarCollapsed) {
            document
                .querySelector(".ai-reading-assistant-toolbar")
                .classList.add("collapsed");
        }
    });

    // Check if auto-popup should be shown
    chrome.storage.sync.get({ autoPopup: false }, function (items) {
        if (items.autoPopup) {
            // Check if current page is a news/blog site
            const isNewsOrBlog =
                /news|blog|article/i.test(window.location.href) ||
                document.querySelector("article, .article, .post, .blog-post");

            if (isNewsOrBlog) {
                // Auto-summarize after a delay
                setTimeout(summarizeArticle, 2000);
            }
        }
    });
}

// Make an element draggable
function makeDraggable(element) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    // Add a draggable handle if it's the toolbar
    if (element.classList.contains("ai-reading-assistant-toolbar")) {
        // Use the entire toolbar as the drag handle
        element.onmousedown = dragMouseDown;
    } else if (element.classList.contains("ai-reading-assistant-popup")) {
        // Use the header as the drag handle for popups
        const header = element.querySelector(".popup-header");
        if (header) {
            header.style.cursor = "move";
            header.onmousedown = dragMouseDown;
        }
    } else if (element.classList.contains("ai-reading-assistant-explanation")) {
        // Use the entire explanation popup as the drag handle
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
