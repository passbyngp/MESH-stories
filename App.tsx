
import React, { useState, useEffect, useRef } from 'react';
import { STORYBOARD_DATA } from './constants';
import { Episode, ImageSize, AppPhase, Lore, Scene } from './types';
import SceneCard from './components/SceneCard';
import { GeminiService } from './services/geminiService';

const RefineSectionButton: React.FC<{ onClick: () => void, loading?: boolean }> = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-emerald-500 transition-all flex items-center gap-1.5 group disabled:opacity-50 shrink-0"
  >
    <svg className={`w-3 h-3 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <span className="text-[9px] font-orbitron font-bold">AI REFINE</span>
  </button>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('FORGE');
  
  // Canonical states (Saved)
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    const saved = localStorage.getItem('grid_episodes');
    return saved ? JSON.parse(saved) : STORYBOARD_DATA;
  });
  const [lore, setLore] = useState<Lore>(() => {
    const saved = localStorage.getItem('grid_lore');
    return saved ? JSON.parse(saved) : {
      background: "A world covered by infinite grey digital grids. Humans choose between Azure (Order) or Verdant (Growth).",
      characters: "Arashi: A former traffic controller turned Verdant Planner. Jane: A rebellious Verdant veteran.",
      rules: "Claiming territory generates Heat. Heat decays at Day End unless collected."
    };
  });

  // Draft states (Unsaved edits in FORGE)
  const [draftLore, setDraftLore] = useState<Lore>(lore);
  const [draftEpisodes, setDraftEpisodes] = useState<Episode[]>(episodes);
  const [isDirty, setIsDirty] = useState(false);

  // UI States
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [refiningField, setRefiningField] = useState<string | null>(null);
  
  // Custom Feedback Modal State
  const [showRefineOverlay, setShowRefineOverlay] = useState(false);
  const [overlayConfig, setOverlayConfig] = useState<{
    title: string;
    callback: (feedback: string) => Promise<void>;
  } | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for the synthesis review workflow (Architect Phase)
  const [isDraftingScript, setIsDraftingScript] = useState(false);
  const [previousScenes, setPreviousScenes] = useState<Scene[] | null>(null);

  const handleSaveToGrid = () => {
    setEpisodes(draftEpisodes);
    setLore(draftLore);
    localStorage.setItem('grid_episodes', JSON.stringify(draftEpisodes));
    localStorage.setItem('grid_lore', JSON.stringify(draftLore));
    setIsDirty(false);
    alert("SYSTEM ALERT: GRID DATA COMMITTED TO MEMORY.");
  };

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

  const navigatePhase = (target: AppPhase) => {
    if (phase === 'FORGE' && isDirty) {
      if (!window.confirm("UNSAVED EDITS DETECTED IN FORGE. DISCARD AND PROCEED?")) {
        return;
      }
      setDraftLore(lore);
      setDraftEpisodes(episodes);
      setIsDirty(false);
    }
    if (phase === 'ARCHITECT' && isDraftingScript) handleCancelDraftScript();
    setPhase(target);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      
      setIsIngesting(true);
      try {
        const service = new GeminiService();
        const result = await service.ingestStoryIntel(content);
        setDraftLore(result.lore);
        setDraftEpisodes(result.episodes);
        setIsDirty(true);
        setCurrentEpisodeIndex(0);
      } catch (err) {
        console.error(err);
        alert("INGESTION FAILURE.");
      } finally {
        setIsIngesting(false);
      }
    };
    reader.readAsText(file);
  };

  // Logic to trigger the Refine Overlay
  const triggerRefine = (title: string, callback: (feedback: string) => Promise<void>) => {
    setOverlayConfig({ title, callback });
    setFeedbackInput("");
    setShowRefineOverlay(true);
  };

  const executeRefine = async () => {
    if (!overlayConfig || !feedbackInput.trim()) return;
    const { callback } = overlayConfig;
    setShowRefineOverlay(false);
    await callback(feedbackInput);
  };

  // AI Refine Implementations
  const handleAIRefineGlobalAction = async (feedback: string) => {
    setRefiningField("Global Overhaul");
    try {
      const service = new GeminiService();
      const result = await service.bulkRefine(draftLore, draftEpisodes, feedback);
      setDraftLore(result.lore);
      setDraftEpisodes(result.episodes);
      setIsDirty(true);
    } catch (e) {
      console.error(e);
      alert("GLOBAL REFINE FAILED.");
    } finally {
      setRefiningField(null);
    }
  };

  const handleAIRefineSectionAction = async (section: "background" | "characters", feedback: string) => {
    const label = section === "background" ? "World Background" : "Operatives & Factions";
    setRefiningField(label);
    try {
      const service = new GeminiService();
      const refined = await service.refineText(label, draftLore[section], feedback, draftLore.background);
      setDraftLore({ ...draftLore, [section]: refined });
      setIsDirty(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRefiningField(null);
    }
  };

  const handleAIRefineChapterAction = async (index: number, feedback: string) => {
    setRefiningField(`Chapter ${draftEpisodes[index].id}`);
    try {
      const service = new GeminiService();
      const { title, summary } = await service.refineChapter(draftEpisodes[index], feedback, draftLore);
      const up = [...draftEpisodes];
      up[index].title = title;
      up[index].summary = summary;
      setDraftEpisodes(up);
      setIsDirty(true);
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
    const newId = draftEpisodes.length > 0 ? Math.max(...draftEpisodes.map(e => e.id)) + 1 : 1;
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
    setDraftEpisodes([...draftEpisodes, newChapter]);
    setIsDirty(true);
  };

  const handleDeleteChapter = (id: number) => {
    if (draftEpisodes.length <= 1) return;
    const filtered = draftEpisodes.filter(e => e.id !== id);
    setDraftEpisodes(filtered);
    if (currentEpisodeIndex >= filtered.length) {
      setCurrentEpisodeIndex(filtered.length - 1);
    }
    setIsDirty(true);
  };

  const synthesizeScript = async () => {
    if (!currentEpisode) return;
    setIsSynthesizing(true);
    setPreviousScenes([...currentEpisode.scenes]);
    
    try {
      const service = new GeminiService();
      const newScenes = await service.generateChapterScript(lore, episodes[currentEpisodeIndex]);
      if (newScenes.length > 0) {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[currentEpisodeIndex].scenes = newScenes;
        setEpisodes(updatedEpisodes);
        setIsDraftingScript(true);
      }
    } catch (e) {
      console.error(e);
      alert("Script Synthesis Failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveDraftScript = () => {
    setIsDraftingScript(false);
    setPreviousScenes(null);
    localStorage.setItem('grid_episodes', JSON.stringify(episodes));
  };

  const handleCancelDraftScript = () => {
    if (previousScenes) {
      const updatedEpisodes = [...episodes];
      updatedEpisodes[currentEpisodeIndex].scenes = previousScenes;
      setEpisodes(updatedEpisodes);
    }
    setIsDraftingScript(false);
    setPreviousScenes(null);
  };

  const currentEpisode = phase === 'FORGE' 
    ? draftEpisodes[currentEpisodeIndex] 
    : episodes[currentEpisodeIndex] || episodes[0];

  return (
    <div className="min-h-screen grid-bg pb-20 selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] group cursor-pointer" onClick={() => navigatePhase('FORGE')}>
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
              onClick={() => navigatePhase(p)}
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
          {phase === 'FORGE' && (
             <button 
              onClick={handleSaveToGrid}
              disabled={!isDirty}
              className={`px-4 py-2 rounded text-xs font-bold font-orbitron transition-all uppercase tracking-widest ${
                isDirty 
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400 animate-pulse' 
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              Commit to Grid
            </button>
          )}
          {!apiKeySet && (
            <button 
              onClick={handleSelectKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold font-orbitron transition-all"
            >
              INIT AI CORE
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {phase === 'FORGE' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800">
               <div>
                  <h2 className="text-2xl font-bold font-orbitron text-white uppercase">Forge Operating System</h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mt-1">Status: {isDirty ? 'UNSAVED FRAGMENTS DETECTED' : 'SYSTEM SYNCHRONIZED'}</p>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => triggerRefine("Entire Story Structure", handleAIRefineGlobalAction)}
                    disabled={refiningField === "Global Overhaul"}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-orbitron font-bold text-emerald-400 transition-all group disabled:opacity-50"
                  >
                    {refiningField === "Global Overhaul" ? (
                      <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                    )}
                    AI REFINE ALL
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.json" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={isIngesting} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-orbitron font-bold text-white transition-all group disabled:opacity-50">
                    {isIngesting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0L8 7m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
                    INGEST DOCUMENT
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm relative group/forge">
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <h3 className="text-emerald-400 font-orbitron text-xs flex items-center gap-2 uppercase tracking-widest flex-grow">
                      <span className="w-4 h-px bg-emerald-500"></span> World Background
                    </h3>
                    <RefineSectionButton 
                      loading={refiningField === 'World Background'}
                      onClick={() => triggerRefine("World Background", (f) => handleAIRefineSectionAction('background', f))} 
                    />
                  </div>
                  <textarea 
                    value={draftLore.background}
                    onChange={(e) => { setDraftLore({...draftLore, background: e.target.value}); setIsDirty(true); }}
                    className="w-full h-40 bg-black/30 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none transition-all font-mono"
                    placeholder="Define the digital reality..."
                  />
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm relative group/forge">
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <h3 className="text-emerald-400 font-orbitron text-xs flex items-center gap-2 uppercase tracking-widest flex-grow">
                      <span className="w-4 h-px bg-emerald-500"></span> Operatives & Factions
                    </h3>
                    <RefineSectionButton 
                      loading={refiningField === 'Operatives & Factions'}
                      onClick={() => triggerRefine("Operatives & Factions", (f) => handleAIRefineSectionAction('characters', f))} 
                    />
                  </div>
                  <textarea 
                    value={draftLore.characters}
                    onChange={(e) => { setDraftLore({...draftLore, characters: e.target.value}); setIsDirty(true); }}
                    className="w-full h-40 bg-black/30 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none transition-all font-mono"
                    placeholder="Profile your heroes and villains..."
                  />
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-emerald-400 font-orbitron text-xs flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-4 h-px bg-emerald-500"></span> Chapter Registry
                    </h3>
                    <button onClick={handleAddChapter} className="px-3 py-1.5 bg-emerald-500 text-black font-orbitron font-bold text-[9px] rounded hover:bg-emerald-400 transition-all uppercase tracking-tighter">+ Register Chapter</button>
                  </div>
                  
                  <div className="space-y-6">
                    {draftEpisodes.map((ep, i) => (
                      <div key={ep.id} className="bg-black/40 border border-neutral-800 p-4 rounded-xl space-y-4 group/chapter relative">
                        <button onClick={() => handleDeleteChapter(ep.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-900/50 border border-red-500/50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover/chapter:opacity-100 transition-opacity hover:bg-red-600 hover:text-white" title="Delete Chapter">×</button>
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-4 flex-grow">
                            <span className="text-emerald-500 font-orbitron text-xs shrink-0">CH {ep.id}</span>
                            <input 
                              value={ep.title}
                              onChange={(e) => {
                                const up = [...draftEpisodes];
                                up[i].title = e.target.value;
                                setDraftEpisodes(up);
                                setIsDirty(true);
                              }}
                              className="w-full bg-transparent border-b border-neutral-800 focus:border-emerald-500 outline-none py-1 text-sm font-bold text-white transition-all"
                              placeholder="Chapter Title"
                            />
                          </div>
                          <RefineSectionButton 
                            loading={refiningField === `Chapter ${ep.id}`}
                            onClick={() => triggerRefine(`Chapter ${ep.id} Content`, (f) => handleAIRefineChapterAction(i, f))} 
                          />
                        </div>
                        <textarea 
                          value={ep.summary}
                          onChange={(e) => {
                            const up = [...draftEpisodes];
                            up[i].summary = e.target.value;
                            setDraftEpisodes(up);
                            setIsDirty(true);
                          }}
                          className="w-full h-24 bg-black/20 border border-neutral-800 rounded p-3 text-xs text-neutral-400 focus:border-emerald-500 outline-none transition-all"
                          placeholder="Plot summary for this chapter..."
                        />
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
                      <span className="text-neutral-500 uppercase">Sync Status:</span>
                      <span className={isDirty ? "text-yellow-500" : "text-emerald-400"}>{isDirty ? "UNSAVED" : "COMMITTED"}</span>
                    </div>
                  </div>
                  <button onClick={handleSaveToGrid} disabled={!isDirty} className="w-full py-4 bg-emerald-500 disabled:bg-neutral-800 text-black font-orbitron font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 uppercase tracking-widest mb-3 disabled:text-neutral-500">Commit Changes</button>
                  <button onClick={() => navigatePhase('ARCHITECT')} className="w-full py-4 bg-neutral-900 border border-emerald-500/30 text-emerald-400 font-orbitron font-bold text-xs rounded-xl hover:bg-neutral-800 transition-all uppercase tracking-widest">Enter Architect</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {phase === 'ARCHITECT' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/50">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-grow">
                {episodes.map((ep, i) => (
                  <button key={ep.id} onClick={() => { if (isDraftingScript) handleCancelDraftScript(); setCurrentEpisodeIndex(i); }} className={`px-4 py-2 text-[10px] font-orbitron border rounded-lg transition-all shrink-0 ${currentEpisodeIndex === i ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}>CH {ep.id}</button>
                ))}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {!isDraftingScript ? (
                  <button onClick={synthesizeScript} disabled={isSynthesizing || !currentEpisode} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-orbitron font-bold rounded-full flex items-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50">
                    {isSynthesizing ? <><div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>SYNTHESIZING...</> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>AI REFINE CHAPTER SCRIPT</>}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={handleCancelDraftScript} className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-orbitron font-bold rounded-full transition-all border border-neutral-700 uppercase">Cancel</button>
                    <button onClick={handleSaveDraftScript} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-orbitron font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all uppercase">Save Changes</button>
                  </div>
                )}
              </div>
            </div>

            {currentEpisode ? (
              <div className="space-y-4">
                 <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl mb-8 relative overflow-hidden">
                    {isDraftingScript && <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-[8px] text-white font-orbitron font-bold rounded-bl-lg uppercase animate-pulse">Draft Mode</div>}
                    <h2 className="text-lg font-bold text-white mb-2 font-orbitron flex items-center gap-3"><span className="text-emerald-500">CH {currentEpisode.id}</span>{currentEpisode.title}</h2>
                    <p className="text-xs text-neutral-400 italic max-w-3xl leading-relaxed">{currentEpisode.summary}</p>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                   {currentEpisode.scenes.map((scene, sIdx) => (
                     <div key={scene.id} className={`bg-neutral-900/30 border rounded-2xl p-6 hover:border-emerald-500/30 transition-all group/scene relative overflow-hidden ${isDraftingScript ? 'border-blue-500/40 ring-1 ring-blue-500/10' : 'border-neutral-800'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rotate-45 translate-x-12 -translate-y-12"></div>
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                          <div className={`w-12 h-12 bg-neutral-950 rounded-xl border flex items-center justify-center font-orbitron shrink-0 shadow-inner group-hover/scene:border-emerald-500/50 transition-colors ${isDraftingScript ? 'border-blue-500/50 text-blue-400' : 'border-neutral-800 text-emerald-500'}`}>{scene.id}</div>
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex justify-between">Visual Concept</label>
                              <textarea value={scene.visual} onChange={(e) => { const up = [...episodes]; up[currentEpisodeIndex].scenes[sIdx].visual = e.target.value; setEpisodes(up); }} className="w-full bg-black/20 border border-neutral-800 rounded p-2 text-xs text-neutral-400 outline-none h-24 focus:border-emerald-900 transition-all font-mono" placeholder="Neon grids, camera angles..." />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Narrative & Context</label>
                              <textarea value={scene.description} onChange={(e) => { const up = [...episodes]; up[currentEpisodeIndex].scenes[sIdx].description = e.target.value; setEpisodes(up); }} className="w-full bg-black/20 border border-neutral-800 rounded p-2 text-xs text-neutral-400 outline-none h-24 focus:border-emerald-900 transition-all leading-relaxed" placeholder="The emotional beat..." />
                            </div>
                            <div className="space-y-4">
                               <div className="flex flex-col">
                                 <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Dialogue</label>
                                 <input value={scene.dialogue} onChange={(e) => { const up = [...episodes]; up[currentEpisodeIndex].scenes[sIdx].dialogue = e.target.value; setEpisodes(up); }} className="bg-black/20 border border-neutral-800 rounded p-2 text-xs text-emerald-400 outline-none focus:border-emerald-900 italic" placeholder="Character voice..." />
                               </div>
                               <div className="flex flex-col">
                                 <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">UI / SFX</label>
                                 <input value={scene.ui_sfx} onChange={(e) => { const up = [...episodes]; up[currentEpisodeIndex].scenes[sIdx].ui_sfx = e.target.value; setEpisodes(up); }} className="bg-black/20 border border-neutral-800 rounded p-2 text-[10px] font-orbitron text-blue-400 outline-none focus:border-blue-900" placeholder="Grid alerts, noise..." />
                               </div>
                            </div>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
                 <div className="flex justify-center pt-16">
                    <button onClick={() => { if (isDraftingScript) handleSaveDraftScript(); setPhase('VISUALIZE'); }} className="px-12 py-4 bg-emerald-500 text-black font-orbitron font-bold text-sm rounded-full hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 uppercase tracking-widest">Finalize Script & Visualize</button>
                 </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl gap-4">
                <p className="text-neutral-600 font-orbitron text-xs">NO SECTOR REGISTERED.</p>
                <button onClick={() => navigatePhase('FORGE')} className="text-emerald-500 text-xs font-bold hover:underline uppercase">Register Chapters in Forge</button>
              </div>
            )}
          </section>
        )}

        {phase === 'VISUALIZE' && currentEpisode && (
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3"><span className="text-emerald-500 font-orbitron">EP {currentEpisode.id}</span>{currentEpisode.title}</h2>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-orbitron mt-1">Status: Media Ready for Synthesis</p>
              </div>
              <div className="flex gap-2">
                {episodes.map((ep, i) => (
                  <button key={ep.id} onClick={() => setCurrentEpisodeIndex(i)} className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${currentEpisodeIndex === i ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'border-neutral-800 text-neutral-600 hover:border-neutral-700'}`}>{ep.id}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentEpisode.scenes.map((scene) => (
                <SceneCard key={`${currentEpisode.id}-${scene.id}`} scene={scene} episodeId={currentEpisode.id} imageSize={imageSize} onUpdateScene={(data) => handleUpdateScene(currentEpisode.id, scene.id, data)} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* CUSTOM REFINE OVERLAY */}
      {showRefineOverlay && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-neutral-900 border border-emerald-500/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <div className="bg-emerald-500 p-4 flex justify-between items-center">
                 <h4 className="text-black font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                    Refinement Command: {overlayConfig?.title}
                 </h4>
                 <button onClick={() => setShowRefineOverlay(false)} className="text-black/50 hover:text-black font-bold">×</button>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-[10px] text-emerald-400/70 font-mono tracking-widest uppercase">INPUT FEEDBACK DATA BELOW:</p>
                 <textarea 
                    autoFocus
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full h-32 bg-black border border-neutral-800 rounded-xl p-4 text-emerald-500 text-sm focus:border-emerald-500 outline-none transition-all font-mono"
                    placeholder="Enter improvement instructions (e.g., 'Make it darker', 'Focus on the internal conflict')..."
                 />
                 <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setShowRefineOverlay(false)}
                      className="px-6 py-2 rounded-full text-[10px] font-orbitron font-bold text-neutral-500 hover:text-neutral-300 transition-colors uppercase"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={executeRefine}
                      className="px-8 py-2 bg-emerald-500 text-black rounded-full text-[10px] font-orbitron font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 uppercase"
                    >
                      Sync Feedback
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <footer className="mt-20 py-10 border-t border-neutral-900 text-center">
        <p className="text-[10px] text-neutral-600 font-orbitron tracking-[0.5em] uppercase">Verdant Order Strategic Interface v8.0.0 Command</p>
      </footer>
    </div>
  );
};

export default App;
