document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const summaryModeSelect = document.getElementById('summary-mode');
  const autoPopupCheckbox = document.getElementById('auto-popup');
  const speechRateInput = document.getElementById('speech-rate');
  const speechRateValue = document.getElementById('speech-rate-value');
  const speechPitchInput = document.getElementById('speech-pitch');
  const speechPitchValue = document.getElementById('speech-pitch-value');
  const speechVoiceSelect = document.getElementById('speech-voice');
  const saveSettingsButton = document.getElementById('save-settings');
  
  // Initialize TTS module
  let ttsModule = window.AIReadingAssistantTTS;
  
  // Load available voices for TTS
  function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    speechVoiceSelect.innerHTML = '';
    
    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      speechVoiceSelect.appendChild(option);
    });
  }
  
  // Load voices when available
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();
  
  // Update range input values and apply immediately for testing
  speechRateInput.addEventListener('input', function() {
    const rate = parseFloat(this.value);
    speechRateValue.textContent = rate;
    
    // Apply rate to TTS module if available
    if (ttsModule) {
      ttsModule.setRate(rate);
    }
  });
  
  speechPitchInput.addEventListener('input', function() {
    const pitch = parseFloat(this.value);
    speechPitchValue.textContent = pitch;
    
    // Apply pitch to TTS module if available
    if (ttsModule) {
      ttsModule.setPitch(pitch);
    }
  });
  
  // Load saved settings
  chrome.storage.sync.get({
    summaryMode: 'brief',
    autoPopup: false,
    speechRate: 1.0,
    speechPitch: 1.0,
    speechVoice: ''
  }, function(items) {
    summaryModeSelect.value = items.summaryMode;
    autoPopupCheckbox.checked = items.autoPopup;
    speechRateInput.value = items.speechRate;
    speechRateValue.textContent = items.speechRate;
    speechPitchInput.value = items.speechPitch;
    speechPitchValue.textContent = items.speechPitch;
    
    // Apply settings to TTS module if available
    if (ttsModule) {
      ttsModule.setRate(items.speechRate);
      ttsModule.setPitch(items.speechPitch);
    }
    
    // Set voice if available
    if (items.speechVoice) {
      setTimeout(() => {
        if (speechVoiceSelect.querySelector(`option[value="${items.speechVoice}"]`)) {
          speechVoiceSelect.value = items.speechVoice;
          
          // Apply voice to TTS module if available
          if (ttsModule) {
            ttsModule.setVoice(items.speechVoice);
          }
        }
      }, 100);
    }
  });
  
  // Add a test button for TTS
  const testButton = document.createElement('button');
  testButton.id = 'test-tts';
  testButton.textContent = 'Test Speech';
  testButton.style.marginTop = '10px';
  testButton.style.backgroundColor = '#4285f4';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.padding = '8px 16px';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  // Add test button to the page
  const buttonContainer = document.querySelector('.button-container');
  buttonContainer.appendChild(testButton);
  
  // Test TTS functionality
  testButton.addEventListener('click', function() {
    if (ttsModule) {
      const rate = parseFloat(speechRateInput.value);
      const pitch = parseFloat(speechPitchInput.value);
      const voice = speechVoiceSelect.value;
      
      ttsModule.setRate(rate);
      ttsModule.setPitch(pitch);
      
      if (voice) {
        ttsModule.setVoice(voice);
      }
      
      // Create a test element for highlighting
      const testElement = document.createElement('div');
      testElement.id = 'tts-test-element';
      testElement.innerHTML = '<p>This is a test of the text-to-speech functionality with highlighting. The speech rate is set to ' + rate + '.</p>';
      testElement.style.marginTop = '20px';
      testElement.style.padding = '10px';
      testElement.style.border = '1px solid #ddd';
      testElement.style.borderRadius = '4px';
      
      // Add or replace the test element
      const existingElement = document.getElementById('tts-test-element');
      if (existingElement) {
        existingElement.parentNode.replaceChild(testElement, existingElement);
      } else {
        document.body.appendChild(testElement);
      }
      
      // Speak the test text with highlighting
      ttsModule.speak(testElement.textContent, testElement);
    } else {
      alert('TTS module is not available. Please refresh the page.');
    }
  });
  
  // Save settings
  saveSettingsButton.addEventListener('click', function() {
    const settings = {
      summaryMode: summaryModeSelect.value,
      autoPopup: autoPopupCheckbox.checked,
      speechRate: parseFloat(speechRateInput.value),
      speechPitch: parseFloat(speechPitchInput.value),
      speechVoice: speechVoiceSelect.value
    };
    
    chrome.storage.sync.set(settings, function() {
      // Show saved message
      const savedMsg = document.createElement('div');
      savedMsg.className = 'saved-message';
      savedMsg.textContent = 'Settings saved!';
      document.body.appendChild(savedMsg);
      
      // Remove message after 2 seconds
      setTimeout(() => {
        savedMsg.remove();
      }, 2000);
    });
  });
});
