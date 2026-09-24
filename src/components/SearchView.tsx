import { useState } from 'react';
import { Send, Delete, Volume2 } from 'lucide-react';
import { HistoryItem, LanguageSetting } from '../types';
import { playFeedback, speakText } from '../utils/audio';
import { translatePortugueseText } from '../utils/translation';
import Avatar3D from './Avatar3D';

interface SearchViewProps {
  onAddHistoryItem: (item: HistoryItem) => void;
  fontSize: 'normal' | 'grande' | 'gigante';
  language: LanguageSetting;
}

const labelsList = {
  pt: {
    title: 'Tradutor SOS',
    desc: 'Exiba a tradução em ecrã inteiro para pedestres ou profissionais de ajuda.',
    placeholder: 'Escreva aqui para Traduzir...',
    quickSuggestions: 'Sugestões de Escrita Rápida:',
    translateBtn: 'TRADUZIR EM GRANDE',
    suggestions: ['Onde fica o metro?', 'Não oiço bem', 'Perdi o meu telemóvel', 'Chame socorro'],
    speakBtn: 'Ouvir Voz Alta 🔊',
    pointScreen: 'Aponte este ecrã para lerem',
    emptyStateText: 'O resultado da sua tradução em alto contraste aparecerá aqui em tamanho gigante.'
  },
  en: {
    title: 'SOS Translator',
    desc: 'Display translation in full screen for pedestrians or rescue workers.',
    placeholder: 'Write here to Translate...',
    quickSuggestions: 'Quick Writing Suggestions:',
    translateBtn: 'GIANT TRANSLATE',
    suggestions: ['Where is the subway?', 'I cannot hear well', 'I lost my phone', 'Call for help'],
    speakBtn: 'Speak Aloud 🔊',
    pointScreen: 'Point this screen for them to read',
    emptyStateText: 'The high-contrast translation result will appear here in giant size.'
  },
  es: {
    title: 'Traductor SOS',
    desc: 'Muestre la traducción en pantalla completa para peatones o rescatistas.',
    placeholder: 'Escriba aquí para Traducir...',
    quickSuggestions: 'Sugerencias de Escritura Rápida:',
    translateBtn: 'TRADUCCIÓN GIGANTE',
    suggestions: ['¿Dónde está el metro?', 'No escucho bien', 'Perdí mi teléfono', 'Llame ayuda'],
    speakBtn: 'Escuchar en Voz Alta 🔊',
    pointScreen: 'Muestre esta pantalla para que lo lean',
    emptyStateText: 'El resultado de su traducción en alto contraste aparecerá aquí en tamaño gigante.'
  }
};

export default function SearchView({ onAddHistoryItem, fontSize, language }: SearchViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<{ simplified: string; emoji: string } | null>(null);

  const currentLabels = labelsList[language] || labelsList.pt;

  const handleTranslate = () => {
    playFeedback();
    
    const textToTranslate = inputText.trim();
    if (!textToTranslate) return;

    const result = translatePortugueseText(textToTranslate, language);
    setTranslationResult(result);

    // Speak the translation output immediately in selected standard speech
    speakText(result.simplified, language);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-PT') + ' ' + now.toLocaleDateString('pt-PT');

    // Create a new translation record
    const newTranslationRecord: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: 'traducao',
      timestamp: formattedTime,
      originalText: textToTranslate,
      translatedText: `${result.simplified} ${result.emoji}`,
    };

    onAddHistoryItem(newTranslationRecord);
  };

  const handleClear = () => {
    playFeedback();
    setInputText('');
    setTranslationResult(null);
  };

  const handleSuggestionClick = (phrase: string) => {
    playFeedback();
    setInputText(phrase);
    
    // Auto-translate suggestions for better accessibility
    const result = translatePortugueseText(phrase, language);
    setTranslationResult(result);

    // Speak the suggestion translation immediately
    speakText(result.simplified, language);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-PT') + ' ' + now.toLocaleDateString('pt-PT');

    const newTranslationRecord: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: 'traducao',
      timestamp: formattedTime,
      originalText: phrase,
      translatedText: `${result.simplified} ${result.emoji}`,
    };

    onAddHistoryItem(newTranslationRecord);
  };

  // Font adjustments
  const getOutputClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-3xl md:text-5xl';
      case 'grande': return 'text-4xl md:text-6xl';
      case 'gigante': return 'text-5xl md:text-7xl';
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-170px)] py-2 text-left max-w-lg mx-auto px-4 justify-between">
      
      <div className="space-y-4">
        {/* Caption */}
        <div>
          <h1 className="text-[#1DB954] font-black text-xl uppercase tracking-wide flex items-center gap-2">
            <span>{currentLabels.title}</span>
          </h1>
          <p className="text-neutral-400 text-xs">{currentLabels.desc}</p>
        </div>

        {/* Input Textbox */}
        <div className="relative">
          <textarea
            id="search-input-text"
            className="w-full h-32 md:h-36 bg-neutral-900 border-3 border-neutral-800 text-white font-black text-xl md:text-2xl p-4 rounded-xl focus:border-[#1DB954] outline-none transition-colors align-top placeholder-neutral-600 resize-none"
            placeholder={currentLabels.placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {inputText && (
            <button
              id="clear-search-btn"
              onClick={handleClear}
              className="absolute right-3 bottom-3 p-2 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-transform active:scale-90 cursor-pointer"
              title="Limpar texto"
            >
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestions in Search View */}
        <div className="space-y-2">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">{currentLabels.quickSuggestions}</p>
          <div className="flex flex-wrap gap-2">
            {currentLabels.suggestions.map((phrase) => (
              <button
                key={phrase}
                onClick={() => handleSuggestionClick(phrase)}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors active:scale-95"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Minimum 80px visual hit target */}
        <button
          id="btn-traduzir"
          onClick={handleTranslate}
          disabled={!inputText.trim()}
          className="w-full h-20 bg-[#1DB954] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-extrabold text-xl rounded-xl flex items-center justify-center gap-3 hover:bg-green-400 active:scale-95 transition-all shadow-[0_4px_20px_rgba(29,185,84,0.3)] cursor-pointer mt-2"
        >
          <Send className="w-6 h-6" />
          <span>{currentLabels.translateBtn}</span>
        </button>
      </div>

      {/* Real-time 3D Sign Gesture Avatar Section */}
      <div className="my-3 shrink-0">
        <Avatar3D
          gestureKey={translationResult ? translationResult.simplified : inputText}
          language={language}
        />
      </div>

      {/* 3. Output Translation Panel */}
      <div className="my-4 flex-grow flex items-center justify-center">
        {translationResult ? (
          <div 
            id="translation-card-result"
            className="w-full bg-white text-black p-6 rounded-2xl border-4 border-[#1DB954] text-center shadow-2xl flex flex-col items-center justify-center min-h-[180px] md:min-h-[220px] transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="text-6xl md:text-7xl mb-4 animate-bounce select-none">
              {translationResult.emoji}
            </div>
            <div className={`font-black tracking-tight leading-tight uppercase ${getOutputClass()} select-all px-2 break-words max-w-full`}>
              {translationResult.simplified}
            </div>

            {/* Tap to speak aloud button */}
            <button
              id="speak-active-translation-btn"
              onClick={() => { playFeedback(); speakText(translationResult.simplified, language); }}
              className="mt-4 px-6 py-4 bg-zinc-150 hover:bg-zinc-250 text-black border border-zinc-200 font-extrabold rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm min-h-[60px] cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-[#1DB954]" />
              <span className="text-xs uppercase tracking-tight">{currentLabels.speakBtn}</span>
            </button>

            <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mt-4 block select-none">
              {currentLabels.pointScreen}
            </span>
          </div>
        ) : (
          <div className="w-full py-10 border-2 border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center px-4 self-stretch min-h-[160px]">
            <p className="text-neutral-500 text-xs max-w-xs leading-relaxed uppercase font-semibold">
              {currentLabels.emptyStateText}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
