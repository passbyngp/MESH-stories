
import React, { useState, useEffect } from 'react';
import { STORYBOARD_DATA } from './constants';
import { Episode, ImageSize, AppPhase, Lore, Scene } from './types';
import SceneCard from './components/SceneCard';
import { GeminiService } from './services/geminiService';

const AIRefineButton: React.FC<{ onClick: () => void, loading?: boolean }> = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="absolute top-2 right-2 p-1.5 bg-emerald-500/10 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-emerald-500 transition-all flex items-center gap-1 group disabled:opacity-50"
    title="AI Refine"
  >
    <svg className={`w-3 h-3 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <span className="text-[8px] font-orbitron font-bold">AI REFINE</span>
  </button>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('FORGE');
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    const saved = localStorage.getItem('grid_episodes');
    return saved ? JSON.parse(saved) : STORYBOARD_DATA;
  });
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [refiningField, setRefiningField] = useState<string | null>(null);
  
  // States for the synthesis review workflow
  const [isDrafting, setIsDrafting] = useState(false);
  const [previousScenes, setPreviousScenes] = useState<Scene[] | null>(null);

  useEffect(() => {
    localStorage.setItem('grid_episodes', JSON.stringify(episodes));
    localStorage.setItem('grid_lore', JSON.stringify(lore));
  }, [episodes]);

  const [lore, setLore] = useState<Lore>(() => {
    const saved = localStorage.getItem('grid_lore');
    return saved ? JSON.parse(saved) : {
      background: "A world covered by infinite grey digital grids. Humans choose between Azure (Order) or Verdant (Growth).",
      characters: "Arashi: A former traffic controller turned Verdant Planner. Jane: A rebellious Verdant veteran.",
      rules: "Claiming territory generates Heat. Heat decays at Day End unless collected."
    };
  });

  useEffect(() => {
    localStorage.setItem('grid_lore', JSON.stringify(lore));
  }, [lore]);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await GeminiService.checkApiKey();
      setApiKeySet(hasKey);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await GeminiService.openKeySelector();
    setApiKeySet(true);
  };

  const handleAIRefine = async (field: string, currentVal: string, setter: (val: string) => void) => {
    if (!currentVal.trim()) return;
    setRefiningField(field);
    try {
      const service = new GeminiService();
      const refined = await service.refineText(field, currentVal, lore.background);
      setter(refined);
    } catch (e) {
      console.error(e);
    } finally {
      setRefiningField(null);
    }
  };

  const handleUpdateScene = (epId: number, sceneId: number, data: Partial<Scene>) => {
    setEpisodes(prev => prev.map(ep => {
      if (ep.id === epId) {
        return {
          ...ep,
          scenes: ep.scenes.map(s => s.id === sceneId ? { ...s, ...data } : s)
        };
      }
      return ep;
    }));
  };

  const handleAddChapter = () => {
    const newId = episodes.length > 0 ? Math.max(...episodes.map(e => e.id)) + 1 : 1;
    const newChapter: Episode = {
      id: newId,
      title: `Chapter ${newId}: Untitled`,
      summary: "Drafting the story for this sector...",
      scenes: Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Scene ${i + 1}`,
        visual: "",
        description: "",
        narrative: "",
        dialogue: "",
        ui_sfx: ""
      }))
    };
    const newEpisodes = [...episodes, newChapter];
    setEpisodes(newEpisodes);
    setCurrentEpisodeIndex(newEpisodes.length - 1);
    setIsDrafting(false);
  };

  const handleDeleteChapter = (id: number) => {
    if (episodes.length <= 1) return;
    const filtered = episodes.filter(e => e.id !== id);
    setEpisodes(filtered);
    if (currentEpisodeIndex >= filtered.length) {
      setCurrentEpisodeIndex(filtered.length - 1);
    }
    setIsDrafting(false);
  };

  const synthesizeScript = async () => {
    if (!currentEpisode) return;
    setIsSynthesizing(true);
    // Backup current scenes in case user cancels
    setPreviousScenes([...currentEpisode.scenes]);
    
    try {
      const service = new GeminiService();
      const newScenes = await service.generateChapterScript(lore, episodes[currentEpisodeIndex]);
      if (newScenes.length > 0) {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[currentEpisodeIndex].scenes = newScenes;
        setEpisodes(updatedEpisodes);
        setIsDrafting(true); // Show Save/Cancel
      }
    } catch (e) {
      console.error(e);
      alert("Script Synthesis Failed. Ensure AI Core is initialized.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDrafting(false);
    setPreviousScenes(null);
  };

  const handleCancelDraft = () => {
    if (previousScenes) {
      const updatedEpisodes = [...episodes];
      updatedEpisodes[currentEpisodeIndex].scenes = previousScenes;
      setEpisodes(updatedEpisodes);
    }
    setIsDrafting(false);
    setPreviousScenes(null);
  };

  const currentEpisode = episodes[currentEpisodeIndex] || episodes[0];

  return (
    <div className="min-h-screen grid-bg pb-20 selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] group">
            <span className="font-orbitron font-bold text-black text-xl group-hover:rotate-90 transition-transform">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-orbitron tracking-wider text-white uppercase">Grid Chronicles</h1>
            <div className="flex gap-2 items-center mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${apiKeySet ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <p className="text-[9px] uppercase text-emerald-500 font-orbitron tracking-[0.2em] opacity-80">
                {phase} PHASE • {currentEpisode?.title || "UNITS OFFLINE"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center bg-neutral-900/50 p-1 rounded-full border border-neutral-800">
          {(['FORGE', 'ARCHITECT', 'VISUALIZE'] as AppPhase[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPhase(p);
                // If moving away from Architect, we assume cancellation if not saved
                if (p !== 'ARCHITECT' && isDrafting) handleCancelDraft();
              }}
              className={`px-5 py-1.5 rounded-full text-[10px] font-orbitron font-bold transition-all ${
                phase === p 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {p}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!apiKeySet && (
            <button 
              onClick={handleSelectKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold font-orbitron transition-all"
            >
              INIT AI CORE
            </button>
          )}
          {phase === 'VISUALIZE' && (
            <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    imageSize === size ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* PHASE 1: FORGE */}
        {phase === 'FORGE' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm relative group/forge">
                  <h3 className="text-emerald-400 font-orbitron text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-4 h-px bg-emerald-500"></span> World Background
                  </h3>
                  <div className="relative">
                    <textarea 
                      value={lore.background}
                      onChange={(e) => setLore({...lore, background: e.target.value})}
                      className="w-full h-40 bg-black/30 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none transition-all font-mono"
                      placeholder="Define the digital reality..."
                    />
                    <AIRefineButton 
                      loading={refiningField === 'World Background'}
                      onClick={() => handleAIRefine('World Background', lore.background, (v) => setLore({...lore, background: v}))} 
                    />
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm relative group/forge">
                  <h3 className="text-emerald-400 font-orbitron text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-4 h-px bg-emerald-500"></span> Operatives & Factions
                  </h3>
                  <div className="relative">
                    <textarea 
                      value={lore.characters}
                      onChange={(e) => setLore({...lore, characters: e.target.value})}
                      className="w-full h-40 bg-black/30 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none transition-all font-mono"
                      placeholder="Profile your heroes and villains..."
                    />
                    <AIRefineButton 
                      loading={refiningField === 'Operatives & Factions'}
                      onClick={() => handleAIRefine('Operatives & Factions', lore.characters, (v) => setLore({...lore, characters: v}))} 
                    />
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-emerald-400 font-orbitron text-xs flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-4 h-px bg-emerald-500"></span> Chapter Registry
                    </h3>
                    <button 
                      onClick={handleAddChapter}
                      className="px-3 py-1.5 bg-emerald-500 text-black font-orbitron font-bold text-[9px] rounded hover:bg-emerald-400 transition-all uppercase tracking-tighter"
                    >
                      + Register Chapter
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {episodes.map((ep, i) => (
                      <div key={ep.id} className="bg-black/40 border border-neutral-800 p-4 rounded-xl space-y-4 group/chapter relative">
                        <button 
                          onClick={() => handleDeleteChapter(ep.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-900/50 border border-red-500/50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover/chapter:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
                          title="Delete Chapter"
                        >
                          ×
                        </button>
                        <div className="flex gap-4 items-center">
                          <span className="text-emerald-500 font-orbitron text-xs">CH {ep.id}</span>
                          <div className="relative flex-grow">
                            <input 
                              value={ep.title}
                              onChange={(e) => {
                                const up = [...episodes];
                                up[i].title = e.target.value;
                                setEpisodes(up);
                              }}
                              className="w-full bg-transparent border-b border-neutral-800 focus:border-emerald-500 outline-none py-1 text-sm font-bold text-white transition-all"
                              placeholder="Chapter Title"
                            />
                            <AIRefineButton 
                              loading={refiningField === `Chapter ${ep.id} Title`}
                              onClick={() => handleAIRefine(`Chapter ${ep.id} Title`, ep.title, (v) => {
                                const up = [...episodes];
                                up[i].title = v;
                                setEpisodes(up);
                              })} 
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <textarea 
                            value={ep.summary}
                            onChange={(e) => {
                              const up = [...episodes];
                              up[i].summary = e.target.value;
                              setEpisodes(up);
                            }}
                            className="w-full h-24 bg-black/20 border border-neutral-800 rounded p-3 text-xs text-neutral-400 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Plot summary for this chapter..."
                          />
                          <AIRefineButton 
                            loading={refiningField === `Chapter ${ep.id} Plot`}
                            onClick={() => handleAIRefine(`Chapter ${ep.id} Plot`, ep.summary, (v) => {
                              const up = [...episodes];
                              up[i].summary = v;
                              setEpisodes(up);
                            })} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl sticky top-24">
                  <h3 className="text-emerald-400 font-orbitron text-xs mb-4 uppercase tracking-[0.2em]">System Status</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-500 uppercase">World Lore:</span>
                      <span className={lore.background.length > 50 ? "text-emerald-400" : "text-yellow-500"}>{lore.background.length > 50 ? "COMPLETED" : "LOW DATA"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-500 uppercase">Registry:</span>
                      <span className="text-emerald-400">{episodes.length} CHAPTERS</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPhase('ARCHITECT')}
                    className="w-full py-4 bg-emerald-500 text-black font-orbitron font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 uppercase tracking-widest"
                  >
                    Enter Architect Phase
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PHASE 2: ARCHITECT */}
        {phase === 'ARCHITECT' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/50">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-grow">
                {episodes.map((ep, i) => (
                  <button 
                    key={ep.id}
                    onClick={() => {
                      if (isDrafting) handleCancelDraft();
                      setCurrentEpisodeIndex(i);
                    }}
                    className={`px-4 py-2 text-[10px] font-orbitron border rounded-lg transition-all shrink-0 ${
                      currentEpisodeIndex === i ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'
                    }`}
                  >
                    CH {ep.id}
                  </button>
                ))}
                <button 
                  onClick={() => {
                    if (isDrafting) handleCancelDraft();
                    handleAddChapter();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-dashed border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-all shrink-0 font-bold"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => handleDeleteChapter(currentEpisode.id)}
                  disabled={episodes.length <= 1}
                  className="px-4 py-2 text-[9px] font-orbitron font-bold text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/20 disabled:opacity-30 disabled:grayscale transition-all uppercase"
                >
                  Delete Chapter
                </button>

                {!isDrafting ? (
                  <button 
                    onClick={synthesizeScript}
                    disabled={isSynthesizing || !currentEpisode}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-orbitron font-bold rounded-full flex items-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSynthesizing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        SYNTHESIZING...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        AI REFINE CHAPTER SCRIPT
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={handleCancelDraft}
                      className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-orbitron font-bold rounded-full transition-all border border-neutral-700 uppercase"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveDraft}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-orbitron font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all uppercase"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {currentEpisode ? (
              <div className="space-y-4">
                 <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl mb-8 relative overflow-hidden">
                    {isDrafting && <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-[8px] text-white font-orbitron font-bold rounded-bl-lg uppercase animate-pulse">Draft Mode: Preview Generated Content</div>}
                    <h2 className="text-lg font-bold text-white mb-2 font-orbitron flex items-center gap-3">
                       <span className="text-emerald-500">CH {currentEpisode.id}</span>
                       {currentEpisode.title}
                    </h2>
                    <p className="text-xs text-neutral-400 italic max-w-3xl leading-relaxed">
                       {currentEpisode.summary}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                   {currentEpisode.scenes.map((scene, sIdx) => (
                     <div key={scene.id} className={`bg-neutral-900/30 border rounded-2xl p-6 hover:border-emerald-500/30 transition-all group/scene relative overflow-hidden ${isDrafting ? 'border-blue-500/40 ring-1 ring-blue-500/10' : 'border-neutral-800'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rotate-45 translate-x-12 -translate-y-12"></div>
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                          <div className={`w-12 h-12 bg-neutral-950 rounded-xl border flex items-center justify-center font-orbitron shrink-0 shadow-inner group-hover/scene:border-emerald-500/50 transition-colors ${isDrafting ? 'border-blue-500/50 text-blue-400' : 'border-neutral-800 text-emerald-500'}`}>
                            {scene.id}
                          </div>
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex justify-between">Visual Concept</label>
                              <textarea 
                                value={scene.visual}
                                onChange={(e) => {
                                  const up = [...episodes];
                                  up[currentEpisodeIndex].scenes[sIdx].visual = e.target.value;
                                  setEpisodes(up);
                                }}
                                className="w-full bg-black/20 border border-neutral-800 rounded p-2 text-xs text-neutral-400 outline-none h-24 focus:border-emerald-900 transition-all font-mono"
                                placeholder="Neon grids, camera angles..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Narrative & Context</label>
                              <textarea 
                                value={scene.description}
                                onChange={(e) => {
                                  const up = [...episodes];
                                  up[currentEpisodeIndex].scenes[sIdx].description = e.target.value;
                                  setEpisodes(up);
                                }}
                                className="w-full bg-black/20 border border-neutral-800 rounded p-2 text-xs text-neutral-400 outline-none h-24 focus:border-emerald-900 transition-all leading-relaxed"
                                placeholder="The emotional beat..."
                              />
                            </div>
                            <div className="space-y-4">
                               <div className="flex flex-col">
                                 <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Dialogue</label>
                                 <input 
                                   value={scene.dialogue}
                                   onChange={(e) => {
                                      const up = [...episodes];
                                      up[currentEpisodeIndex].scenes[sIdx].dialogue = e.target.value;
                                      setEpisodes(up);
                                   }}
                                   className="bg-black/20 border border-neutral-800 rounded p-2 text-xs text-emerald-400 outline-none focus:border-emerald-900 italic"
                                   placeholder="Character voice..."
                                 />
                               </div>
                               <div className="flex flex-col">
                                 <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">UI / SFX</label>
                                 <input 
                                   value={scene.ui_sfx}
                                   onChange={(e) => {
                                      const up = [...episodes];
                                      up[currentEpisodeIndex].scenes[sIdx].ui_sfx = e.target.value;
                                      setEpisodes(up);
                                   }}
                                   className="bg-black/20 border border-neutral-800 rounded p-2 text-[10px] font-orbitron text-blue-400 outline-none focus:border-blue-900"
                                   placeholder="Grid alerts, noise..."
                                 />
                               </div>
                            </div>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>

                 <div className="flex justify-center pt-16">
                    <button 
                      onClick={() => {
                        if (isDrafting) handleSaveDraft();
                        setPhase('VISUALIZE');
                      }}
                      className="px-12 py-4 bg-emerald-500 text-black font-orbitron font-bold text-sm rounded-full hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 uppercase tracking-widest"
                    >
                      Finalize Script & Visualize
                    </button>
                 </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl gap-4">
                <p className="text-neutral-600 font-orbitron text-xs">NO SECTOR REGISTERED IN ARCHITECT MODE.</p>
                <button onClick={handleAddChapter} className="text-emerald-500 text-xs font-bold hover:underline">REGISTER NEW CHAPTER</button>
              </div>
            )}
          </section>
        )}

        {/* PHASE 3: VISUALIZE */}
        {phase === 'VISUALIZE' && currentEpisode && (
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-emerald-500 font-orbitron">EP {currentEpisode.id}</span>
                  {currentEpisode.title}
                </h2>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-orbitron mt-1">Status: Media Ready for Synthesis</p>
              </div>
              <div className="flex gap-2">
                {episodes.map((ep, i) => (
                  <button 
                    key={ep.id}
                    onClick={() => setCurrentEpisodeIndex(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${
                      currentEpisodeIndex === i ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'border-neutral-800 text-neutral-600 hover:border-neutral-700'
                    }`}
                  >
                    {ep.id}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentEpisode.scenes.map((scene) => (
                <SceneCard 
                  key={`${currentEpisode.id}-${scene.id}`} 
                  scene={scene} 
                  episodeId={currentEpisode.id}
                  imageSize={imageSize}
                  onUpdateScene={(data) => handleUpdateScene(currentEpisode.id, scene.id, data)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-neutral-900 text-center">
        <p className="text-[10px] text-neutral-600 font-orbitron tracking-[0.5em] uppercase">
          Verdant Order Strategic Interface v6.0.0 Refined
        </p>
      </footer>
    </div>
  );
};

export default App;
