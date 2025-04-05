// Text-to-Speech Module for AI Reading Assistant
window.AIReadingAssistantTTS = (function() {
  // Initialize speech synthesis
  const synth = window.speechSynthesis;
  let utterance = null;
  
  // Default settings
  let settings = {
    rate: 1.0,
    pitch: 1.0,
    voice: null
  };
  
  // Get available voices
  function getVoices() {
    return synth.getVoices();
  }
  
  // Set speech rate (0.5 to 2)
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
    const voice = voices.find(v => v.name === voiceName);
    
    if (voice) {
      settings.voice = voice;
      if (utterance) {
        utterance.voice = settings.voice;
      }
    }
  }
  
  // Speak text
  function speak(text) {
    // Cancel any ongoing speech
    stop();
    
    // Create new utterance
    utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    
    if (settings.voice) {
      utterance.voice = settings.voice;
    }
    
    // Add event listeners
    utterance.onend = function() {
      utterance = null;
    };
    
    utterance.onerror = function(event) {
      console.error('Speech synthesis error:', event);
      utterance = null;
    };
    
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
    utterance = null;
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
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused
  };
})();
