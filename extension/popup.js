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
  
  // Update range input values
  speechRateInput.addEventListener('input', function() {
    speechRateValue.textContent = this.value;
  });
  
  speechPitchInput.addEventListener('input', function() {
    speechPitchValue.textContent = this.value;
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
    
    // Set voice if available
    if (items.speechVoice) {
      setTimeout(() => {
        if (speechVoiceSelect.querySelector(`option[value="${items.speechVoice}"]`)) {
          speechVoiceSelect.value = items.speechVoice;
        }
      }, 100);
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
