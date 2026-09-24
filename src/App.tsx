import { useState, useEffect } from 'react';
import { Home, Search, Library, Settings, ShieldAlert, Wifi, Crown } from 'lucide-react';
import { AppTab, AppConfig, HistoryItem } from './types';
import { playFeedback } from './utils/audio';

// Visual components
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import ConfigView from './components/ConfigView';
import PremiumModal from './components/PremiumModal';

const STORAGE_KEY_CONFIG = 'sos_surdos_config_v1';
const STORAGE_KEY_HISTORY = 'sos_surdos_history_v1';

const DEFAULT_CONFIG: AppConfig = {
  modoNoiteVermelho: false,
  fontSize: 'normal',
  language: 'pt',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPremiumOpen, setIsPremiumOpen] = useState<boolean>(false);

  // Load configuration and history from localStorage safely on client mount
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig);
        if (!parsed.language) {
          parsed.language = 'pt';
        }
        setConfig(parsed);
      }

      const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.warn('Could not read storage state', e);
    }
  }, []);

  // Update config state and localStorage helper
  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Could not save configuration state', e);
    }
  };

  // Add item to history, enforcing a maximum of 10 items
  const handleAddHistoryItem = (newItem: HistoryItem) => {
    setHistory((prev) => {
      // Limit to precious last 10 elements
      const updated = [newItem, ...prev].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save history logs', e);
      }
      return updated;
    });
  };

  // Clear log history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn('Could not clear history logs', e);
    }
  };

  // Handle click sound + vibration on tab switch
  const handleTabClick = (tab: AppTab) => {
    playFeedback();
    setActiveTab(tab);
  };

  // Determine dynamic classes based on Noite Mode settings
  const getBackgroundColors = () => {
    if (config.modoNoiteVermelho) {
      return {
        bg: 'bg-[#290000]', // Deep dark crimson/maroon red
        surface: 'bg-[#1a0000]',
        border: 'border-red-950',
        textAccent: 'text-red-500',
        borderAccent: 'border-red-600',
        activeTab: 'text-red-500',
      };
    }
    return {
      bg: 'bg-[#121212]', // Spotify charcoal black
      surface: 'bg-[#181818]',
      border: 'border-neutral-800',
      textAccent: 'text-[#1DB954]', // Spotify green
      borderAccent: 'border-[#1DB954]',
      activeTab: 'text-[#1DB954]',
    };
  };

  const colors = getBackgroundColors();

  // Dynamic layout font scales for global accessibility sizing
  const getGlobalFontSizeClass = () => {
    switch (config.fontSize) {
      case 'normal': return 'text-sm';
      case 'grande': return 'text-base';
      case 'gigante': return 'text-lg';
    }
  };

  return (
    <div 
      className={`min-h-screen text-white flex flex-col justify-between font-sans selection:bg-[#1DB954] selection:text-black transition-colors duration-300 ${getGlobalFontSizeClass()} relative overflow-x-hidden`}
      style={{
        backgroundImage: `url('/src/assets/images/sos_app_background_1780299420485.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Absolute overlay for crisp content contrast and 8px blur */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: config.modoNoiteVermelho ? 'rgba(41, 0, 0, 0.85)' : 'rgba(18, 18, 18, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />
      
      {/* 1. App Top Header (Premium Spotify minimal appearance) */}
      <header className={`sticky top-0 z-40 ${colors.surface} border-b ${colors.border} px-4 py-3 shadow-md flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-6 h-6 ${colors.textAccent}`} />
          <span className="font-black tracking-wider text-sm md:text-base uppercase">
            {config.language === 'en' ? 'SOS Deaf Translator' : config.language === 'es' ? 'SOS Traductor Sordos' : 'SOS Tradutor Surdos'}
          </span>
        </div>

        {/* Premium and Status Badge Container */}
        <div className="flex items-center gap-2">
          {/* Glowing premium Crown trigger button */}
          <button
            id="premium-trigger-header-btn"
            onClick={() => { playFeedback(); setIsPremiumOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#000000] hover:bg-zinc-900 border-2 border-yellow-500 scale-100 hover:scale-105 active:scale-95 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            title="Saber Mais sobre o Premium"
          >
            <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
            <span className="font-black text-[10px] tracking-wide text-yellow-500">PREMIUM</span>
          </button>

          {/* Top visual helper, clean status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono tracking-wide font-semibold text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
            <span>
              {config.language === 'en' ? 'SOUND+VIBE MODE: ACTIVE' : config.language === 'es' ? 'AUDIO+VIBRA MODO: ACTIVO' : 'BIP+VIBRA MODO: ATIVO'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Content View Router */}
      <main className="flex-grow w-full max-w-lg mx-auto pb-24 md:pb-28 relative z-10">
        <div className="animate-fade-in">
          {activeTab === 'inicio' && (
            <HomeView
              onAddHistoryItem={handleAddHistoryItem}
              fontSize={config.fontSize}
              language={config.language}
              onUpdateLanguage={(lang) => handleUpdateConfig({ ...config, language: lang })}
            />
          )}
          {activeTab === 'procurar' && (
            <SearchView
              onAddHistoryItem={handleAddHistoryItem}
              fontSize={config.fontSize}
              language={config.language}
            />
          )}
          {activeTab === 'biblioteca' && (
            <LibraryView
              history={history}
              onClearHistory={handleClearHistory}
              fontSize={config.fontSize}
              language={config.language}
            />
          )}
          {activeTab === 'config' && (
            <ConfigView
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onAddHistoryItem={handleAddHistoryItem}
            />
          )}
        </div>
      </main>

      {/* 3. Bottom Navigation bar (Solid black as requested, no transparency) */}
      <nav 
        id="spotify-bottom-nav"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black border-t ${colors.border} py-2 safe-bottom`}
      >
        <div className="w-full max-w-lg mx-auto grid grid-cols-4 px-2">
          {/* Nav Item: Início */}
          <button
            id="nav-btn-inicio"
            onClick={() => handleTabClick('inicio')}
            className={`flex flex-col items-center justify-center py-2 relative transition-colors cursor-pointer select-none`}
            style={{ minHeight: '80px' }} // Ensured giant hitting target
          >
            <Home className={`w-6 h-6 mb-1.5 ${activeTab === 'inicio' ? colors.activeTab : 'text-neutral-500'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'inicio' ? 'text-white' : 'text-neutral-500'}`}>
              {config.language === 'en' ? 'Home' : config.language === 'es' ? 'Inicio' : 'Início'}
            </span>
            {activeTab === 'inicio' && (
              <span className={`absolute bottom-0 w-8 h-1 rounded-full ${config.modoNoiteVermelho ? 'bg-red-600' : 'bg-[#1DB954]'}`} />
            )}
          </button>

          {/* Nav Item: Procurar */}
          <button
            id="nav-btn-procurar"
            onClick={() => handleTabClick('procurar')}
            className={`flex flex-col items-center justify-center py-2 relative transition-colors cursor-pointer select-none`}
            style={{ minHeight: '80px' }}
          >
            <Search className={`w-6 h-6 mb-1.5 ${activeTab === 'procurar' ? colors.activeTab : 'text-neutral-500'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'procurar' ? 'text-white' : 'text-neutral-500'}`}>
              {config.language === 'en' ? 'Search' : config.language === 'es' ? 'Buscar' : 'Procurar'}
            </span>
            {activeTab === 'procurar' && (
              <span className={`absolute bottom-0 w-8 h-1 rounded-full ${config.modoNoiteVermelho ? 'bg-red-600' : 'bg-[#1DB954]'}`} />
            )}
          </button>

          {/* Nav Item: Biblioteca */}
          <button
            id="nav-btn-biblioteca"
            onClick={() => handleTabClick('biblioteca')}
            className={`flex flex-col items-center justify-center py-2 relative transition-colors cursor-pointer select-none`}
            style={{ minHeight: '80px' }}
          >
            <Library className={`w-6 h-6 mb-1.5 ${activeTab === 'biblioteca' ? colors.activeTab : 'text-neutral-500'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'biblioteca' ? 'text-white' : 'text-neutral-500'}`}>
              {config.language === 'en' ? 'Library' : config.language === 'es' ? 'Biblioteca' : 'Biblioteca'}
            </span>
            {activeTab === 'biblioteca' && (
              <span className={`absolute bottom-0 w-8 h-1 rounded-full ${config.modoNoiteVermelho ? 'bg-red-600' : 'bg-[#1DB954]'}`} />
            )}
          </button>

          {/* Nav Item: Config */}
          <button
            id="nav-btn-config"
            onClick={() => handleTabClick('config')}
            className={`flex flex-col items-center justify-center py-2 relative transition-colors cursor-pointer select-none`}
            style={{ minHeight: '80px' }}
          >
            <Settings className={`w-6 h-6 mb-1.5 ${activeTab === 'config' ? colors.activeTab : 'text-neutral-500'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'config' ? 'text-white' : 'text-neutral-500'}`}>
              {config.language === 'en' ? 'Settings' : config.language === 'es' ? 'Ajustes' : 'Config'}
            </span>
            {activeTab === 'config' && (
              <span className={`absolute bottom-0 w-8 h-1 rounded-full ${config.modoNoiteVermelho ? 'bg-red-600' : 'bg-[#1DB954]'}`} />
            )}
          </button>
        </div>
      </nav>
      
      {/* 4. Giant Premium modal overlay flow */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        language={config.language}
      />
      
    </div>
  );
}
