
import React, { useState, useEffect } from 'react';
import { STORYBOARD_DATA } from './constants';
import { Episode, ImageSize } from './types';
import SceneCard from './components/SceneCard';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [apiKeySet, setApiKeySet] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await GeminiService.checkApiKey();
      setApiKeySet(hasKey);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await GeminiService.openKeySelector();
    // Assume success as per instructions
    setApiKeySet(true);
  };

  const currentEpisode = STORYBOARD_DATA[currentEpisodeIndex];

  return (
    <div className="min-h-screen grid-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <span className="font-orbitron font-bold text-black text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-orbitron tracking-wider text-white">GRID CHRONICLES</h1>
            <p className="text-[10px] uppercase text-emerald-500 font-orbitron tracking-[0.2em] opacity-80">The Verdant Seventh Day • Storyboard</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
            {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setImageSize(size)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  imageSize === size 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {!apiKeySet ? (
            <button 
              onClick={handleSelectKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold font-orbitron transition-all animate-pulse"
            >
              INITIALIZE AI KEY
            </button>
          ) : (
            <div className="px-4 py-2 bg-neutral-900 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-orbitron font-bold">
              AI READY
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Episode Selector */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-emerald-500 font-orbitron">0{currentEpisode.id}</span>
              {currentEpisode.title}
            </h2>
            <div className="text-xs text-neutral-500 font-orbitron uppercase tracking-widest">
              Episode {currentEpisodeIndex + 1} of {STORYBOARD_DATA.length}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {STORYBOARD_DATA.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => setCurrentEpisodeIndex(idx)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg border transition-all duration-300 ${
                  currentEpisodeIndex === idx
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'bg-neutral-900/50 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                }`}
              >
                <div className="text-[10px] uppercase font-orbitron mb-1 opacity-60">EPISODE {ep.id}</div>
                <div className="text-sm font-bold truncate max-w-[150px]">{ep.title}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Scene Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentEpisode.scenes.map((scene) => (
            <SceneCard 
              key={`${currentEpisode.id}-${scene.id}`} 
              scene={scene} 
              episodeId={currentEpisode.id}
              imageSize={imageSize}
            />
          ))}
        </section>

        {/* Key Documentation Link (as required) */}
        {!apiKeySet && (
          <div className="mt-20 p-8 border border-dashed border-neutral-800 rounded-2xl text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2">AI Visualizer Initialization Required</h3>
            <p className="text-neutral-500 text-sm mb-6">
              To visualize the manga frames, you must select a valid Gemini API Key from a paid GCP project. 
              Billing must be enabled for your project.
            </p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline text-xs font-bold uppercase tracking-widest"
            >
              View Billing Documentation
            </a>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 py-10 border-t border-neutral-900 text-center">
        <p className="text-[10px] text-neutral-600 font-orbitron tracking-[0.5em] uppercase">
          Verdant Order Strategic Interface v3.1.2
        </p>
      </footer>
    </div>
  );
};

export default App;
