import { useState } from 'react';
import { Moon, Type, MessageSquare, Info, X, Volume2 } from 'lucide-react';
import { AppConfig, FontSizeSetting, HistoryItem } from '../types';
import { playFeedback, speakText } from '../utils/audio';
import { translatePortugueseText } from '../utils/translation';

interface ConfigViewProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onAddHistoryItem: (item: HistoryItem) => void;
}

const configLabels = {
  pt: {
    title: 'CONFIGURAÇÕES ⚙️',
    subtitle: 'Personalize o comportamento e atalhos de acessibilidade.',
    nightModeTitle: 'Modo Noite Emergência',
    nightModeDesc: 'Aplica fundo vermelho escuro para menor ofuscamento e facilidade visual noturna.',
    textSizeTitle: 'Tamanho de Letra Global',
    quickPhrasesTitle: 'Frases Médicas / Rápidas SOS',
    quickPhrasesDesc: 'Toque num botão para traduzir, vibrar e exibir imediatamente em tamanho completo.',
    aboutTitle: 'Sobre a Aplicação SOS',
    aboutDesc: 'Construída de forma 100% autónoma, segura e privada no navegador. Sem necessidade de servidores externos para cache.',
    signalText: 'Sinal: Ativo',
    hapticText: 'Estabilidade hática: 200ms',
    pointScreen: 'Aponte este ecrã ao interlocutor',
    doneBtn: 'Concluído / Voltar',
    closeBtn: 'Fechar',
    speakBtn: 'Ouvir Voz Alta 🔊',
    phrases: [
      { label: 'Hospital?', icon: '🏥', phrase: 'Hospital?' },
      { label: 'Água', icon: '💧', phrase: 'Água' },
      { label: 'Banheiro', icon: '🚾', phrase: 'Banheiro' },
      { label: 'Ajuda', icon: '🆘', phrase: 'Ajuda' }
    ]
  },
  en: {
    title: 'SETTINGS ⚙️',
    subtitle: 'Customize accessibility behavior and shortcuts.',
    nightModeTitle: 'Emergency Night Mode',
    nightModeDesc: 'Applies a deep dark red background for lower glare and easier night viewing.',
    textSizeTitle: 'Global Text Size',
    quickPhrasesTitle: 'Quick Medical / SOS Phrases',
    quickPhrasesDesc: 'Tap a button to instantly translate, vibrate, and display in full screen.',
    aboutTitle: 'About the SOS App',
    aboutDesc: 'Built 100% autonomously, secure and private inside your browser. No external servers needed for cache.',
    signalText: 'Signal: Active',
    hapticText: 'Haptic stability: 200ms',
    pointScreen: 'Point this screen to the responder',
    doneBtn: 'Done / Go Back',
    closeBtn: 'Close',
    speakBtn: 'Speak Aloud 🔊',
    phrases: [
      { label: 'Hospital?', icon: '🏥', phrase: 'Hospital?' },
      { label: 'Water', icon: '💧', phrase: 'Water' },
      { label: 'Restroom', icon: '🚾', phrase: 'Restroom' },
      { label: 'Help', icon: '🆘', phrase: 'Help' }
    ]
  },
  es: {
    title: 'AJUSTES ⚙️',
    subtitle: 'Personalice el comportamiento y los atajos de accesibilidad.',
    nightModeTitle: 'Modo Noche de Emergencia',
    nightModeDesc: 'Aplica un fondo rojo oscuro para reducir el brillo y facilitar la visión nocturna.',
    textSizeTitle: 'Tamaño de Letra Global',
    quickPhrasesTitle: 'Frases Médicas / Rápidas SOS',
    quickPhrasesDesc: 'Toque un botón para traducir, vibrar y mostrar de inmediato en tamaño completo.',
    aboutTitle: 'Acerca de la Aplicación SOS',
    aboutDesc: 'Construida de forma 100% autónoma, segura y privada en el navegador. Sin necesidad de servidores externos.',
    signalText: 'Señal: Activa',
    hapticText: 'Estabilidad háptica: 200ms',
    pointScreen: 'Muestre esta pantalla al interlocutor',
    doneBtn: 'Hecho / Volver',
    closeBtn: 'Cerrar',
    speakBtn: 'Escuchar en Voz Alta 🔊',
    phrases: [
      { label: '¿Hospital?', icon: '🏥', phrase: 'Hospital?' },
      { label: 'Agua', icon: '💧', phrase: 'Agua' },
      { label: 'Baño', icon: '🚾', phrase: 'Banheiro' },
      { label: 'Ayuda', icon: '🆘', phrase: 'Ajuda' }
    ]
  }
};

export default function ConfigView({ config, onUpdateConfig, onAddHistoryItem }: ConfigViewProps) {
  const [activeOverlay, setActiveOverlay] = useState<{ simplified: string; emoji: string } | null>(null);

  const currentLabels = configLabels[config.language] || configLabels.pt;

  const toggleModoNoite = () => {
    playFeedback();
    onUpdateConfig({
      ...config,
      modoNoiteVermelho: !config.modoNoiteVermelho,
    });
  };

  const handleSetFontSize = (size: FontSizeSetting) => {
    playFeedback();
    onUpdateConfig({
      ...config,
      fontSize: size,
    });
  };

  // Immediate translation + vibration triggers for Quick Phrases
  const handleQuickPhrase = (phrase: string) => {
    playFeedback(); // Vibrate and Beep immediately

    // Normalize querying based on standard keyword roots
    let queryText = phrase;
    if (phrase === 'Hospital?' || phrase === '¿Hospital?') queryText = 'medico';
    if (phrase === 'Água' || phrase === 'Water' || phrase === 'Agua') queryText = 'agua';
    if (phrase === 'Banheiro' || phrase === 'Restroom' || phrase === 'Baño') queryText = 'banheiro';
    if (phrase === 'Ajuda' || phrase === 'Help' || phrase === 'Ayuda') queryText = 'ajuda';

    const result = translatePortugueseText(queryText, config.language);
    setActiveOverlay({
      simplified: result.simplified,
      emoji: result.emoji,
    });

    // Speak the quick phrase translation aloud immediately
    speakText(result.simplified, config.language);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-PT') + ' ' + now.toLocaleDateString('pt-PT');

    // Add translation block directly to history log
    const newTranslationRecord: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: 'traducao',
      timestamp: formattedTime,
      originalText: `${config.language === 'en' ? 'Quick shortcut' : config.language === 'es' ? 'Acceso rápido' : 'Atalho rápido'}: ${phrase}`,
      translatedText: `${result.simplified} ${result.emoji}`,
    };

    onAddHistoryItem(newTranslationRecord);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-170px)] py-2 text-left max-w-lg mx-auto px-4 justify-between">
      
      <div className="space-y-6 flex-grow border-neutral-800">
        
        {/* Caption */}
        <div>
          <h1 className="text-[#1DB954] font-black text-xl uppercase tracking-wide">
            {currentLabels.title}
          </h1>
          <p className="text-neutral-400 text-xs">{currentLabels.subtitle}</p>
        </div>

        {/* Option 1: Red Night Mode Toggle */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1 pr-2">
            <span className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <Moon className="w-4 h-4 text-red-500" />
              {currentLabels.nightModeTitle}
            </span>
            <span className="text-xs text-neutral-400 block leading-tight">
              {currentLabels.nightModeDesc}
            </span>
          </div>

          <button
            id="toggle-modo-noite-btn"
            onClick={toggleModoNoite}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
              config.modoNoiteVermelho ? 'bg-red-600' : 'bg-neutral-700'
            }`}
            aria-label="Alternar Modo Noite"
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
                config.modoNoiteVermelho ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Option 2: FontSize Selection */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3">
          <span className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wide">
            <Type className="w-4 h-4 text-[#1DB954]" />
            {currentLabels.textSizeTitle}
          </span>
          
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'grande', 'gigante'] as FontSizeSetting[]).map((size) => (
              <button
                key={size}
                id={`btn-font-${size}`}
                onClick={() => handleSetFontSize(size)}
                className={`py-3 px-2 rounded-lg font-bold uppercase text-xs transition-all border cursor-pointer ${
                  config.fontSize === size
                    ? 'bg-[#1DB954] text-black border-[#1DB954] shadow-md'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Option 3: Giant Quick Phrases (Min 80px height per button description specs!) */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3">
          <div className="space-y-0.5">
            <span className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <MessageSquare className="w-4 h-4 text-[#1DB954]" />
              {currentLabels.quickPhrasesTitle}
            </span>
            <span className="text-xs text-neutral-400 block leading-tight">
              {currentLabels.quickPhrasesDesc}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentLabels.phrases.map((p) => (
              <button
                key={p.phrase}
                onClick={() => handleQuickPhrase(p.phrase)}
                className="h-28 bg-neutral-950 hover:bg-neutral-850 active:scale-95 text-white border-2 border-neutral-850 border-l-[10px] border-l-[#1DB954] rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg cursor-pointer"
                style={{ minHeight: '80px' }} // Ensures target requirement is strictly respected
              >
                <span className="text-3xl select-none" role="img" aria-label={p.label}>
                  {p.icon}
                </span>
                <span className="font-black text-sm uppercase tracking-wider text-neutral-100">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Technical/About Info */}
        <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/40 text-xs text-neutral-500 space-y-1">
          <div className="flex items-center gap-1 font-semibold text-neutral-400 uppercase tracking-wide mb-1">
            <Info className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>{currentLabels.aboutTitle}</span>
          </div>
          <p>
            {currentLabels.aboutDesc}
          </p>
          <div className="flex justify-between text-[10px] uppercase font-mono mt-2 border-t border-neutral-800/40 pt-1">
            <span>{currentLabels.signalText}</span>
            <span>{currentLabels.hapticText}</span>
          </div>
        </div>

      </div>

      {/* 4. Giant popover overlay for instant translation card */}
      {activeOverlay && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white text-black rounded-3xl border-4 border-[#1DB954] p-6 shadow-2xl relative text-center flex flex-col items-center justify-center min-h-[300px] animate-in zoom-in-95 duration-250">
            
            {/* Close button at top right corner */}
            <button
               onClick={() => { playFeedback(); setActiveOverlay(null); }}
              className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-full font-bold cursor-pointer transition-colors"
              title={currentLabels.closeBtn}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Giant emoji */}
            <div className="text-7xl mb-4 select-none animate-bounce">
              {activeOverlay.emoji}
            </div>

            {/* Giant phrase */}
            <div className="font-black text-4xl md:text-5xl leading-none uppercase tracking-tight select-all break-words max-w-full">
              {activeOverlay.simplified}
            </div>

            {/* Tap to speak aloud button */}
            <button
              id="speak-overlay-translation-btn"
              onClick={() => { playFeedback(); speakText(activeOverlay.simplified, config.language); }}
              className="mt-5 px-6 py-4 bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 font-extrabold rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm min-h-[60px] cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-[#1DB954]" />
              <span className="text-xs uppercase tracking-tight">{currentLabels.speakBtn}</span>
            </button>

            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-6">
              {currentLabels.pointScreen}
            </p>

            {/* Tap outside to dismiss helper button (min height targets) */}
            <button
              onClick={() => { playFeedback(); setActiveOverlay(null); }}
              className="mt-6 w-full h-14 bg-black text-white hover:bg-zinc-800 text-sm font-extrabold uppercase rounded-full transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
            >
              {currentLabels.doneBtn}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
