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
                const contentElement = document.querySelector(".popup-content");
                const content = contentElement.textContent;
                if (ttsModule && content) {
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

                            // Read the content with highlighting
                            ttsModule.speak(content, contentElement);
                        }
                    );
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

    // Fallback to body content, excluding scripts, styles, etc.
    const bodyText = Array.from(document.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li"))
        .map((el) => el.innerText)
        .join("\n\n");

    return bodyText || document.body.innerText;
}

// Make an element draggable
function makeDraggable(element) {
    const header = element.querySelector(".popup-header, .explanation-header");
    if (!header) return;

    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.transform = "none";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "";
    });
}

// Summarize article
function summarizeArticle() {
    const popup = createPopupContainer();
    popup.classList.add("active");

    // Get page content
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

    // Get page content
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

    // Create explanation popup
    let popup = document.querySelector(".ai-reading-assistant-explanation");

    if (!popup) {
        popup = document.createElement("div");
        popup.className = "ai-reading-assistant-explanation";
        popup.innerHTML = `
      <button class="explanation-close">&times;</button>
      <div class="explanation-content">
        <div class="loading-spinner">Loading...</div>
      </div>
    `;
        document.body.appendChild(popup);

        // Make popup draggable
        makeDraggable(popup);

        // Add close button event listener
        popup.querySelector(".explanation-close").addEventListener("click", () => {
            popup.remove();
        });
    }

    // Position popup near the selection
    const selectionRect = selection.getRangeAt(0).getBoundingClientRect();
    popup.style.left = `${selectionRect.left + window.scrollX}px`;
    popup.style.top = `${selectionRect.bottom + window.scrollY + 10}px`;

    // Get surrounding context
    const context = getSelectionContext(selection);

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
    let textToRead;
    let elementToHighlight;

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
                textToRead = selectedText;
                // Get the element containing the selection
                const range = selection.getRangeAt(0);
                elementToHighlight = range.commonAncestorContainer;
                
                // If it's a text node, use its parent
                if (elementToHighlight.nodeType === Node.TEXT_NODE) {
                    elementToHighlight = elementToHighlight.parentNode;
                }
            } else {
                // Try to get the main content element
                const article = document.querySelector("article");
                const mainContent = document.querySelector(
                    "main, #content, .content, .article, .post"
                );
                
                if (article) {
                    textToRead = article.innerText;
                    elementToHighlight = article;
                } else if (mainContent) {
                    textToRead = mainContent.innerText;
                    elementToHighlight = mainContent;
                } else {
                    textToRead = getPageContent();
                    elementToHighlight = document.body;
                }
            }

            // Read the text with highlighting
            ttsModule.speak(textToRead, elementToHighlight);
        }
    );
}

// Get context around the selection
function getSelectionContext(selection) {
    if (!selection.rangeCount) return "";

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;

    // Try to get the paragraph or nearest block element
    let contextNode = startNode;
    while (
        contextNode &&
        contextNode.nodeType !== Node.ELEMENT_NODE &&
        contextNode !== document.body
    ) {
        contextNode = contextNode.parentNode;
    }

    // Get text from the context node
    return contextNode ? contextNode.textContent.trim() : "";
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
                setTimeout(summarizeArticle, 1500);
            }
        }
    });
}

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getPageContent") {
        sendResponse({ content: getPageContent() });
    }
});
