
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
        setVideoProgress("Reloading Media Link...");
        try {
          // Attempt to direct link if possible, or re-fetch
          const apiKey = process.env.API_KEY || '';
          const downloadUrl = `${videoAsset.uri}&key=${apiKey}`;
          const response = await fetch(downloadUrl);
          if (response.ok) {
             const blob = await response.blob();
             setVideoUrl(URL.createObjectURL(blob));
          } else {
             // If direct fetch fails (e.g. key expired), we don't clear state but error gracefully
             console.warn("Could not reload saved video. Key may be expired.");
          }
        } catch (e) {
          console.error("Video reload failed", e);
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
        setError("Failed to generate image.");
      }
    } catch (err: any) {
      setError(err.message === "API_KEY_EXPIRED" ? "API Key invalid. Please re-select in header." : `Image Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    setVideoLoading(true);
    setError(null);
    try {
      const service = new GeminiService();
      const result = await service.generateVideo(scene.visual, scene.description, (msg) => setVideoProgress(msg));
      if (result) {
        setVideoUrl(result.url);
        setVideoAsset(result.asset);
        setIsExtended(false);
        onUpdateScene({ videoAsset: result.asset, isExtended: false });
      } else {
        setError("Failed to generate video asset.");
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
    try {
      const service = new GeminiService();
      const result = await service.extendVideo(videoAsset, (msg) => setVideoProgress(msg));
      if (result) {
        setVideoUrl(result.url);
        setVideoAsset(result.asset);
        setIsExtended(true);
        onUpdateScene({ videoAsset: result.asset, isExtended: true });
      } else {
        setError("Failed to extend video.");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err.message.includes("API_KEY_MISSING")) {
      setError("API Key not found. Please click 'INITIALIZE AI KEY'.");
    } else if (err.message.includes("403") || err.message.includes("Requested entity was not found")) {
      setError("Access Denied: Veo models require a PAID project key with billing enabled.");
    } else if (err.message.includes("DOWNLOAD_FAILED")) {
      setError("Video created but download failed. Check network or key permissions.");
    } else {
      setError(`Video Error: ${err.message}`);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `GridChronicles_E${episodeId}_S${scene.id}${isExtended ? '_extended' : ''}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full shadow-2xl">
      <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden shrink-0 border-b border-neutral-800 group/video">
        {videoUrl ? (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef}
              src={videoUrl} 
              autoPlay 
              loop 
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Custom Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={togglePlay}
                    className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 rounded text-emerald-400 transition-all"
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-400 transition-all"
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    )}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume} 
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={handleOpenNewTab}
                    className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-400"
                    title="Fullscreen"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={scene.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-700 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-xs max-w-[200px] line-clamp-2">{scene.visual}</p>
            <div className="flex gap-2">
              <button 
                onClick={generateImage}
                disabled={loading || videoLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow-lg disabled:opacity-50 transition-all font-orbitron"
              >
                IMAGE
              </button>
              <button 
                onClick={generateVideo}
                disabled={loading || videoLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[10px] font-bold shadow-lg disabled:opacity-50 transition-all font-orbitron"
              >
                VIDEO
              </button>
            </div>
          </div>
        )}

        {(loading || videoLoading) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 px-6 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 font-orbitron text-[10px] tracking-widest animate-pulse uppercase mb-2">
              {videoLoading ? (isExtended ? 'Temporal Extension...' : 'Temporal Synthesis...') : 'Rendering Grid Frame'}
            </p>
            {videoLoading && (
              <p className="text-blue-400 text-[9px] font-mono opacity-80">{videoProgress}</p>
            )}
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm flex items-center justify-center p-6 text-center z-20">
            <div className="bg-black/80 p-4 rounded border border-red-500/50 shadow-2xl max-w-[90%]">
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2">Generation Failed</p>
              <p className="text-white text-[11px] leading-relaxed mb-4 break-words">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[9px] font-orbitron rounded uppercase"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="bg-black/80 text-emerald-400 border border-emerald-500/50 px-2 py-1 text-[9px] font-orbitron tracking-tighter rounded">
            F {episodeId}-{scene.id}
          </span>
          {videoAsset && (
            <span className={`bg-blue-600/80 text-white border border-blue-400/50 px-2 py-1 text-[9px] font-orbitron tracking-tighter rounded ${videoLoading ? '' : 'animate-pulse'}`}>
              {isExtended ? 'EXTENDED MP4' : 'BASE MP4 (5s)'}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-emerald-400 font-bold text-base flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {scene.title}
          </h3>
          {videoUrl && (
            <div className="flex gap-2">
              <button 
                onClick={handleDownload}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
                title="Download Video"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="bg-neutral-800/30 p-2.5 border-l-2 border-emerald-500 rounded-r">
             <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-1 opacity-40">Narrative</p>
             <p className="italic text-neutral-200 text-sm leading-snug">{scene.narrative === "无" ? "..." : scene.narrative}</p>
          </div>

          <div 
            className="cursor-pointer group/desc bg-neutral-900/40 p-2.5 rounded border border-neutral-800 hover:border-emerald-900/50 transition-colors"
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-1 opacity-40 flex justify-between">
              Description 
              <span className="text-emerald-500 text-[9px] font-orbitron">{showFullDesc ? 'HIDE' : 'SHOW'}</span>
            </p>
            <p className={`text-neutral-300 text-xs leading-relaxed transition-all ${showFullDesc ? '' : 'line-clamp-2'}`}>
              {scene.description}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/50 mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-white text-[9px] uppercase tracking-[0.2em] block mb-1 opacity-30">Dialogue</strong>
              <p className="text-[11px] text-neutral-400 line-clamp-2 italic">
                {scene.dialogue === "无" ? "Silent" : scene.dialogue}
              </p>
            </div>
            <div>
              <strong className="text-white text-[9px] uppercase tracking-[0.2em] block mb-1 opacity-30">SFX / UI</strong>
              <div className="truncate">
                {scene.ui_sfx === "无" ? <span className="italic opacity-30 text-[11px] text-neutral-400">N/A</span> : <code className="text-emerald-500 font-orbitron text-[9px] bg-emerald-950/20 px-1.5 py-0.5 rounded">{scene.ui_sfx}</code>}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {!videoUrl && imageUrl && (
              <button 
                onClick={generateVideo}
                disabled={videoLoading}
                className="w-full py-2 bg-blue-900/30 hover:bg-blue-600 border border-blue-500/30 text-blue-400 hover:text-white rounded text-[10px] font-orbitron font-bold transition-all shadow-lg"
              >
                ANIMATE SCENE (5S)
              </button>
            )}
            
            {videoUrl && !isExtended && (
              <button 
                onClick={extendVideo}
                disabled={videoLoading}
                className="w-full py-2 bg-emerald-900/40 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-400 hover:text-white rounded text-[10px] font-orbitron font-bold transition-all animate-pulse"
              >
                EXTEND DURATION (+7S)
              </button>
            )}

            {(videoUrl || imageUrl) && (
              <button 
                onClick={() => {
                   setVideoUrl(null);
                   setVideoAsset(null);
                   setImageUrl(null);
                   setIsExtended(false);
                   setIsPlaying(true);
                   onUpdateScene({ videoAsset: null, imageUrl: undefined, isExtended: false });
                }}
                disabled={videoLoading}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded text-[10px] font-orbitron font-bold transition-all"
              >
                RESET ASSETS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
