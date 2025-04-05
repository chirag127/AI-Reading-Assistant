// Text-to-Speech Module for AI Reading Assistant
window.AIReadingAssistantTTS = (function () {
    // Initialize speech synthesis
    const synth = window.speechSynthesis;
    let utterance = null;
    let currentElement = null;
    let highlightedElements = [];
    let currentWordIndex = 0;

    // Default settings
    let settings = {
        rate: 1.0,
        pitch: 1.0,
        voice: null,
        highlightEnabled: true,
    };

    // Get available voices
    function getVoices() {
        return synth.getVoices();
    }

    // Set speech rate (0.5 to 32)
    function setRate(rate) {
        settings.rate = parseFloat(rate);
        if (utterance) {
            utterance.rate = settings.rate;
        }
    }

    // Set speech pitch (0.5 to 2)
    function setPitch(pitch) {
        settings.pitch = parseFloat(pitch);
        if (utterance) {
            utterance.pitch = settings.pitch;
        }
    }

    // Set voice by name
    function setVoice(voiceName) {
        const voices = getVoices();
        const voice = voices.find((v) => v.name === voiceName);

        if (voice) {
            settings.voice = voice;
            if (utterance) {
                utterance.voice = settings.voice;
            }
        }
    }

    // Enable or disable text highlighting
    function setHighlighting(enabled) {
        settings.highlightEnabled = enabled;
    }

    // Clear any existing highlights
    function clearHighlights() {
        if (highlightedElements.length > 0) {
            highlightedElements.forEach(el => {
                if (el && el.classList) {
                    el.classList.remove('tts-highlight');
                }
            });
            highlightedElements = [];
        }
    }

    // Speak text
    function speak(text, element) {
        // Cancel any ongoing speech
        stop();

        // Store the element for highlighting
        currentElement = element || document.querySelector('.popup-content') || document.body;
        currentWordIndex = 0;

        // Create new utterance
        utterance = new SpeechSynthesisUtterance(text);

        // Apply settings
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;

        if (settings.voice) {
            utterance.voice = settings.voice;
        }

        // Add event listeners
        utterance.onend = function () {
            clearHighlights();
            utterance = null;
            currentElement = null;
        };

        utterance.onerror = function (event) {
            console.error("Speech synthesis error:", event);
            clearHighlights();
            utterance = null;
            currentElement = null;
        };

        // Add boundary event for word highlighting
        if (settings.highlightEnabled) {
            utterance.onboundary = function(event) {
                if (event.name === 'word') {
                    highlightCurrentWord(text, event.charIndex, event.charLength);
                }
            };
        }

        // Start speaking
        synth.speak(utterance);
    }

    // Pause speech
    function pause() {
        if (synth.speaking) {
            synth.pause();
        }
    }

    // Resume speech
    function resume() {
        if (synth.paused) {
            synth.resume();
        }
    }

    // Stop speech
    function stop() {
        synth.cancel();
        clearHighlights();
        utterance = null;
        currentElement = null;
    }

    // Highlight the current word being spoken
    function highlightCurrentWord(text, charIndex, charLength) {
        // Clear previous highlights
        clearHighlights();

        if (!currentElement) return;

        // If the element is a simple text container
        if (currentElement.nodeType === Node.ELEMENT_NODE) {
            // Try to find the text nodes and create spans for highlighting
            const textContent = currentElement.textContent;
            if (textContent === text) {
                // Simple case: the entire element contains our text
                highlightInElement(currentElement, text, charIndex, charLength);
            } else {
                // More complex case: find the text within child nodes
                highlightInChildren(currentElement, text, charIndex, charLength);
            }
        }
    }

    // Highlight text within an element by wrapping words in spans
    function highlightInElement(element, text, charIndex, charLength) {
        // Get the word being spoken
        const word = text.substring(charIndex, charIndex + charLength);
        
        // Create a temporary div to hold the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        
        // Find all text nodes
        const textNodes = [];
        findTextNodes(tempDiv, textNodes);
        
        // Try to find and highlight the word
        let found = false;
        for (const node of textNodes) {
            const nodeText = node.textContent;
            const wordIndex = nodeText.indexOf(word);
            
            if (wordIndex >= 0) {
                // Create a span for the highlighted word
                const span = document.createElement('span');
                span.className = 'tts-highlight';
                span.textContent = word;
                
                // Replace the text node with three parts: before, highlight, after
                const before = document.createTextNode(nodeText.substring(0, wordIndex));
                const after = document.createTextNode(nodeText.substring(wordIndex + word.length));
                
                const parent = node.parentNode;
                parent.insertBefore(before, node);
                parent.insertBefore(span, node);
                parent.insertBefore(after, node);
                parent.removeChild(node);
                
                highlightedElements.push(span);
                found = true;
                break;
            }
        }
        
        if (found) {
            // Update the original element with our modified content
            element.innerHTML = tempDiv.innerHTML;
        }
    }

    // Find all text nodes in an element
    function findTextNodes(element, result) {
        if (element.nodeType === Node.TEXT_NODE && element.textContent.trim() !== '') {
            result.push(element);
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            for (const child of element.childNodes) {
                findTextNodes(child, result);
            }
        }
    }

    // Highlight text within child nodes
    function highlightInChildren(element, text, charIndex, charLength) {
        // This is a simplified approach - for complex documents, a more sophisticated
        // algorithm would be needed to map the utterance position to DOM position
        const words = text.split(/\\s+/);
        const wordIndex = getWordIndexFromCharIndex(text, charIndex);
        
        if (wordIndex >= 0 && wordIndex < words.length) {
            const word = words[wordIndex];
            const textNodes = [];
            findTextNodes(element, textNodes);
            
            // Try to find the word in any text node
            for (const node of textNodes) {
                if (node.textContent.includes(word)) {
                    const parent = node.parentNode;
                    const html = parent.innerHTML;
                    const regex = new RegExp(`(\\b${word}\\b)`, 'i');
                    parent.innerHTML = html.replace(regex, '<span class="tts-highlight">$1</span>');
                    
                    // Store the newly created span
                    const spans = parent.querySelectorAll('.tts-highlight');
                    if (spans.length > 0) {
                        highlightedElements.push(spans[spans.length - 1]);
                        // Scroll the highlighted word into view if needed
                        spans[spans.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        break;
                    }
                }
            }
        }
    }

    // Get word index from character index
    function getWordIndexFromCharIndex(text, charIndex) {
        const textBeforeIndex = text.substring(0, charIndex);
        return textBeforeIndex.split(/\\s+/).length - 1;
    }

    // Check if speaking
    function isSpeaking() {
        return synth.speaking;
    }

    // Check if paused
    function isPaused() {
        return synth.paused;
    }

    // Public API
    return {
        getVoices,
        setRate,
        setPitch,
        setVoice,
        setHighlighting,
        speak,
        pause,
        resume,
        stop,
        isSpeaking,
        isPaused,
        clearHighlights,
    };
})();
