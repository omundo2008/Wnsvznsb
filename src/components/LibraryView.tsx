import { Trash2, MapPin, ExternalLink, MessageSquare, AlertOctagon } from 'lucide-react';
import { HistoryItem, LanguageSetting } from '../types';
import { playFeedback } from '../utils/audio';

interface LibraryViewProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  fontSize: 'normal' | 'grande' | 'gigante';
  language: LanguageSetting;
}

const libraryLabels = {
  pt: {
    title: 'BIBLIOTECA 📚',
    subtitle: 'Os últimos 10 registos salvos no seu telemóvel.',
    clearText: 'Limpar',
    confirmClear: 'Tem a certeza que deseja limpar todo o histórico de emergência?',
    emptyTitle: 'Histórico Vazio',
    emptyDesc: 'Todas as ativações do botão SOS e traduções escritas serão logadas aqui para fins médicos ou de segurança.',
    sosAlert: 'ALERTA SOS',
    translation: 'TRADUÇÃO',
    coordsTitle: 'Coordenadas de Emergência',
    openMaps: 'ABRIR MAPS',
    gpsError: '⚠️ Coordenadas GPS não obtidas no momento do SOS. (Permissão ou sinal indisponível)'
  },
  en: {
    title: 'LIBRARY 📚',
    subtitle: 'The last 10 records saved on your phone.',
    clearText: 'Clear',
    confirmClear: 'Are you sure you want to clear all emergency history?',
    emptyTitle: 'History Empty',
    emptyDesc: 'All SOS activations and written translations will be logged here for medical or safety purposes.',
    sosAlert: 'SOS ALERT',
    translation: 'TRANSLATION',
    coordsTitle: 'Emergency Coordinates',
    openMaps: 'OPEN MAPS',
    gpsError: '⚠️ GPS coordinates not obtained at the time of the SOS. (Permission or signal unavailable)'
  },
  es: {
    title: 'BIBLIOTECA 📚',
    subtitle: 'Los últimos 10 registros guardados en su teléfono.',
    clearText: 'Limpiar',
    confirmClear: '¿Está seguro de que desea borrar todo el historial de emergencia?',
    emptyTitle: 'Historial Vacío',
    emptyDesc: 'Todas las activaciones de SOS y traducciones escritas se registrarán aquí para fines médicos o de seguridad.',
    sosAlert: 'ALERTA SOS',
    translation: 'TRADUCCIÓN',
    coordsTitle: 'Coordenadas de Emergencia',
    openMaps: 'ABRIR MAPS',
    gpsError: '⚠️ Coordenadas GPS no obtenidas en el momento del SOS. (Permiso o señal no disponible)'
  }
};

export default function LibraryView({ history, onClearHistory, fontSize, language }: LibraryViewProps) {
  const currentLabels = libraryLabels[language] || libraryLabels.pt;
  
  const handleClearAll = () => {
    playFeedback();
    if (confirm(currentLabels.confirmClear)) {
      onClearHistory();
    }
  };

  const getContentClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-lg';
      case 'grande': return 'text-xl';
      case 'gigante': return 'text-2xl font-black';
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-170px)] py-2 text-left max-w-lg mx-auto px-4 justify-between">
      
      <div className="space-y-4 flex-grow">
        {/* Header with quick delete */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1DB954] font-black text-xl uppercase tracking-wide">
              {currentLabels.title}
            </h1>
            <p className="text-neutral-400 text-xs">{currentLabels.subtitle}</p>
          </div>
          {history.length > 0 && (
            <button
              id="clear-all-history-btn"
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-2 bg-neutral-900 border border-red-500/30 hover:bg-neutral-850 text-red-500 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{currentLabels.clearText}</span>
            </button>
          )}
        </div>

        {/* List of elements */}
        {history.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center px-6">
            <p className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">{currentLabels.emptyTitle}</p>
            <p className="text-neutral-600 text-xs max-w-xs leading-relaxed uppercase">
              {currentLabels.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {history.map((item) => {
              const isSos = item.type === 'sos';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-150 ${
                    isSos
                      ? 'bg-[#1a0000] border-red-900/60 shadow-[0_4px_12px_rgba(239,68,68,0.06)]'
                      : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Event Tag */}
                    <div className="flex items-center gap-1.5">
                      {isSos ? (
                        <span className="flex items-center gap-1 text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider blink-slow">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          {currentLabels.sosAlert}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase tracking-wider">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {currentLabels.translation}
                        </span>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="text-[10px] font-mono text-neutral-500 font-semibold uppercase">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Body textual content */}
                  {isSos ? (
                    <div className="space-y-3">
                      <p className={`font-black ${getContentClass()} text-red-400 uppercase leading-snug`}>
                        {item.translatedText}
                      </p>
                      
                      {/* GPS details & direct button */}
                      {item.latitude && item.longitude ? (
                        <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">{currentLabels.coordsTitle}</span>
                            <span className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#1DB954]" />
                              {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                            </span>
                          </div>

                          {/* Trigger Maps anchor */}
                          <a
                            href={item.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playFeedback()}
                            className="flex items-center justify-center gap-1 bg-neutral-900 text-[#1DB954] hover:bg-neutral-850 hover:text-green-400 border border-[#1DB954] px-4 py-2 text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer max-w-max"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{currentLabels.openMaps}</span>
                          </a>
                        </div>
                      ) : (
                        <p className="text-[11px] text-yellow-600 font-bold bg-yellow-500/5 p-2 rounded border border-yellow-500/10 uppercase font-sans">
                          {currentLabels.gpsError}
                        </p>
                      )}
                    </div>
                  ) : (
                    // Type Dialog / Translation Card
                    <div className="space-y-1">
                      {item.originalText && (
                        <p className="text-xs text-neutral-400 italic">
                          "{item.originalText}"
                        </p>
                      )}
                      <p className={`font-black ${getContentClass()} text-[#1DB954] uppercase tracking-wide`}>
                        {item.translatedText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
