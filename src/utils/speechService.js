// Web Speech API wrapper for low-latency Speech-to-Text & Text-to-Speech

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.voices = [];
    this.initVoices();
  }

  initVoices() {
    if (typeof window === 'undefined' || !this.synthesis) return;
    
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    updateVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  isSpeechRecognitionSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  startListening({ onResult, onError, onEnd }) {
    if (!this.isSpeechRecognitionSupported()) {
      if (onError) onError('Speech Recognition is not supported in this browser. Please use text input fallback.');
      return false;
    }

    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + ' ';
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        if (onResult) {
          onResult({
            final: finalTranscript.trim(),
            interim: interimTranscript.trim(),
            raw: (finalTranscript + interimTranscript).trim()
          });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (onError && event.error !== 'no-speech') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      if (onError) onError(err.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      this.isListening = false;
    }
  }

  speak(text, { persona, onStart, onEnd, onBoundary } = {}) {
    if (!this.synthesis) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 2500);
      return;
    }

    // Cancel any previous speaking
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (persona && persona.voice) {
      utterance.pitch = persona.voice.pitch || 1.0;
      utterance.rate = persona.voice.rate || 1.0;
      utterance.lang = persona.voice.lang || 'en-US';

      // Attempt to find matching voice
      if (this.voices.length > 0 && persona.voice.preferredVoiceNames) {
        const foundVoice = this.voices.find(v => 
          persona.voice.preferredVoiceNames.some(name => v.name.includes(name))
        );
        if (foundVoice) {
          utterance.voice = foundVoice;
        }
      }
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onBoundary) utterance.onboundary = onBoundary;

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
