'use client';
import { useState, useEffect, useCallback } from 'react';

// Extend window object for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechToText(lang: string = 'hi-IN') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = lang; // e.g. hi-IN (Hindi), gu-IN (Gujarati), en-IN (English)

        recog.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recog.onerror = (event: any) => {
          console.warn("Speech recognition issue:", event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }
    }
  }, [lang]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("Error stopping recognition:", e);
      }
      setIsListening(false);
    } else {
      setTranscript(''); // Clear previous
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Speech recognition already running or busy:", e);
        // If it was already running, just sync state
        setIsListening(true);
      }
    }
  }, [isListening, recognition]);

  return { isListening, transcript, toggleListening, supported: !!recognition, setTranscript };
}
