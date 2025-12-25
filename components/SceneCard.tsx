
import React, { useState, useRef, useEffect } from 'react';
import { Scene, ImageSize } from '../types';
import { GeminiService } from '../services/geminiService';

interface SceneCardProps {
  scene: Scene;
  episodeId: number;
  imageSize: ImageSize;
  onUpdateScene: (data: Partial<Scene>) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, episodeId, imageSize, onUpdateScene }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(scene.imageUrl || null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoAsset, setVideoAsset] = useState<any>(scene.videoAsset || null);
  const [isExtended, setIsExtended] = useState(scene.isExtended || false);
  
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  
  // Video Control States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // Load Video on Mount if asset exists
  useEffect(() => {
    const loadVideo = async () => {
      if (videoAsset && !videoUrl) {
        setVideoLoading(true);
        setVideoProgress("Syncing Media Link...");
        try {
          const apiKey = process.env.API_KEY || '';
          const downloadUrl = `${videoAsset.uri}&key=${apiKey}`;
          const response = await fetch(downloadUrl);
          if (response.ok) {
             const blob = await response.blob();
             setVideoUrl(URL.createObjectURL(blob));
          } else {
             console.warn("Media link expired or invalid.");
             setError("Media link expired. Please re-generate.");
          }
        } catch (e) {
          console.error("Video reload failed", e);
          setError("Failed to sync media. Check connection.");
        } finally {
          setVideoLoading(false);
        }
      }
    };
    loadVideo();
  }, [videoAsset]);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new GeminiService();
      const url = await service.generateFrame(scene.visual, scene.description, imageSize);
      if (url) {
        setImageUrl(url);
        onUpdateScene({ imageUrl: url });
      } else {
        throw new Error("System returned empty frame data.");
      }
    } catch (err: any) {
      console.error("Image Gen Error:", err);
      setError(err.message === "API_KEY_EXPIRED" ? "API Key expired. Please re-init in header." : `Synthesis Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    setVideoLoading(true);
    setError(null);
    setVideoProgress("Initializing Engine...");
    try {
      const service = new GeminiService();
      const result = await service.generateVideo(scene.visual, scene.description, (msg) => setVideoProgress(msg));
      if (result) {
        setVideoUrl(result.url);
        setVideoAsset(result.asset);
        setIsExtended(false);
        onUpdateScene({ videoAsset: result.asset, isExtended: false });
      } else {
        throw new Error("Video synthesis engine failed to return asset.");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setVideoLoading(false);
    }
  };

  const extendVideo = async () => {
    if (!videoAsset) return;
    setVideoLoading(true);
    setError(null);
    setVideoProgress("Calculating Extension...");
    try {
      const service = new GeminiService();
      const result = await service.extendVideo(videoAsset, (msg) => setVideoProgress(msg));
      if (result) {
        setVideoUrl(result.url);
        setVideoAsset(result.asset);
        setIsExtended(true);
        onUpdateScene({ videoAsset: result.asset, isExtended: true });
      } else {
        throw new Error("Extension synthesis failed.");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error("Engine Critical Error:", err);
    if (err.message.includes("API_KEY_MISSING")) {
      setError("AI Core Not Initialized. Please use header button.");
    } else if (err.message.includes("403") || err.message.includes("Requested entity was not found")) {
      setError("Access Denied: Veo 3.1 requires a paid project API key.");
    } else if (err.message.includes("DOWNLOAD_FAILED")) {
      setError("Asset created but transfer failed. Key might have restricted permissions.");
    } else {
      setError(`Grid Sync Error: ${err.message || "Unknown Failure"}`);
    }
  };

  const resetState = () => {
    setError(null);
    setLoading(false);
    setVideoLoading(false);
  };

  const clearAssets = () => {
    setVideoUrl(null);
    setVideoAsset(null);
    setImageUrl(null);
    setIsExtended(false);
    setError(null);
    onUpdateScene({ videoAsset: null, imageUrl: undefined, isExtended: false });
  };

  const handleMediaError = () => {
    setError("Media decoding failed. Resource may be corrupted.");
    clearAssets();
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full shadow-2xl relative">
      <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden shrink-0 border-b border-neutral-800 group/video">
        
        {/* Main Display Logic */}
        {!error && videoUrl && (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef}
              src={videoUrl} 
              autoPlay 
              loop 
              playsInline
              onError={handleMediaError}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Custom Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 rounded text-emerald-400 transition-all">
                    {isPlaying ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                  </button>
                  <button onClick={() => { if(videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } }} className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-400 transition-all">
                    {isMuted || volume === 0 ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
                  </button>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if(videoRef.current) videoRef.current.volume = v; }} className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!error && !videoUrl && imageUrl && (
          <img 
            src={imageUrl} 
            alt={scene.title} 
            onError={handleMediaError}
            className="w-full h-full object-cover" 
          />
        )}

        {!error && !videoUrl && !imageUrl && !loading && !videoLoading && (
          <div className="flex flex-col items-center gap-4 p-8 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-[10px] font-orbitron uppercase tracking-widest">Awaiting Synthesis</p>
            <div className="flex gap-2">
              <button onClick={generateImage} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold transition-all font-orbitron shadow-[0_0_10px_rgba(16,185,129,0.2)]">IMAGE</button>
              <button onClick={generateVideo} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[10px] font-bold transition-all font-orbitron shadow-[0_0_10px_rgba(37,99,235,0.2)]">VIDEO</button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {(loading || videoLoading) && !error && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 px-6 text-center animate-in fade-in duration-300">
            <div className="w-10 h-10 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
            <p className="text-emerald-400 font-orbitron text-[9px] tracking-[0.3em] animate-pulse uppercase mb-1">
              {videoLoading ? (isExtended ? 'Temporal Extension...' : 'Temporal Synthesis...') : 'Grid Frame Synthesis'}
            </p>
            {videoLoading && <p className="text-blue-500/80 text-[8px] font-mono tracking-widest">{videoProgress}</p>}
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2 font-orbitron">Neural Link Severed</p>
            <p className="text-neutral-300 text-[11px] leading-relaxed mb-5 max-w-[80%]">{error}</p>
            <div className="flex gap-2">
              <button onClick={resetState} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-[9px] font-orbitron rounded-full transition-all border border-neutral-700">Dismiss</button>
              <button onClick={() => { resetState(); (videoAsset || videoUrl) ? generateVideo() : generateImage(); }} className="px-4 py-2 bg-emerald-500 text-black text-[9px] font-orbitron font-bold rounded-full transition-all shadow-lg shadow-emerald-500/20">Retry Synthesis</button>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="bg-black/90 text-emerald-400 border border-emerald-500/30 px-2 py-1 text-[8px] font-orbitron tracking-tighter rounded backdrop-blur-md shadow-lg">
            S {episodeId}-{scene.id}
          </span>
          {videoAsset && !error && (
            <span className={`bg-blue-600/90 text-white border border-blue-400/30 px-2 py-1 text-[8px] font-orbitron tracking-tighter rounded backdrop-blur-md ${videoLoading ? '' : 'animate-pulse'}`}>
              {isExtended ? '12S STREAM' : '5S STREAM'}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-emerald-400 font-bold text-base flex items-center gap-2 font-orbitron">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
            {scene.title}
          </h3>
          {videoUrl && !error && (
            <button onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = `S${scene.id}.mp4`; a.click(); }} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="bg-neutral-800/30 p-2.5 border-l-2 border-emerald-500 rounded-r">
             <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Narrative Beat</p>
             <p className="italic text-neutral-200 text-xs leading-relaxed">{scene.narrative || "System silence..."}</p>
          </div>
          <div className="cursor-pointer bg-neutral-900/40 p-2.5 rounded border border-neutral-800 hover:border-emerald-900/50 transition-colors" onClick={() => setShowFullDesc(!showFullDesc)}>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-1 flex justify-between">Visual Protocol <span className="text-emerald-500">{showFullDesc ? 'MIN' : 'MAX'}</span></p>
            <p className={`text-neutral-400 text-[11px] leading-relaxed ${showFullDesc ? '' : 'line-clamp-2'}`}>{scene.description}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800/50 mt-auto flex flex-col gap-2">
          {videoUrl && !isExtended && !error && (
            <button onClick={extendVideo} disabled={videoLoading} className="w-full py-2 bg-emerald-950/30 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white rounded text-[9px] font-orbitron font-bold transition-all">EXTEND STREAM (+7S)</button>
          )}
          {(videoUrl || imageUrl) && !error && (
            <button onClick={clearAssets} disabled={videoLoading || loading} className="w-full py-2 bg-neutral-900 hover:bg-red-900/20 text-neutral-600 hover:text-red-400 border border-neutral-800 rounded text-[9px] font-orbitron font-bold transition-all">PURGE MEDIA ASSETS</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
