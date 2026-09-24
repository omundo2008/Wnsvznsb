import { LanguageSetting } from '../types';

/**
 * Audio synthesizer & vibration manager for accessibility feedback.
 * No external media dependencies are required.
 */

let audioCtx: AudioContext | null = null;

/**
 * Initializes the AudioContext under standard user interaction safety guards
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard AudioContext or vendor fallback
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Plays a clean acoustic "bip" sound and triggers a 200ms device vibration.
 */
export function playFeedback(): void {
  // 1. Device Vibration (200ms)
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(200);
    } catch (e) {
      console.warn('Vibration API blocked or not supported on this device', e);
    }
  }

  // 2. Synthesize audio "bip" (exactly 880Hz for 0.2s / 200ms with smooth exponential decay)
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser security policy for autoplay)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Beep characteristics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Sharp 880Hz pitch (equal siren)

    // Fade envelope: 0.3 gain to 0.01 in 0.2 seconds to prevent popping/clicks
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (error) {
    console.warn('Audio Synthesis failed', error);
  }
}

/**
 * Speaks the provided text out loud in the selected language using the local text-to-speech engine.
 */
export function speakText(text: string, lang: LanguageSetting = 'pt'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis not supported on this device/browser.');
    return;
  }

  try {
    // Stop any current speaking queue immediately to start the new phrase
    window.speechSynthesis.cancel();

    // Remove emoji characters from the spoken string for a cleaner narration tone
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Map lang settings to standard locales
    let locale = 'pt-PT';
    if (lang === 'en') {
      locale = 'en-US';
    } else if (lang === 'es') {
      locale = 'es-ES';
    }
    
    utterance.lang = locale;
    
    // Attempt searching for explicit native speech models
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().includes(lang));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.9; // Clear, moderately paced speech rate for hard of hearing/coordinating people
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis failed:', e);
  }
}


