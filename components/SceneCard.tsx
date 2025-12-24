
import React, { useState, useEffect } from 'react';
import { Scene, ImageSize } from '../types';
import { GeminiService } from '../services/geminiService';

interface SceneCardProps {
  scene: Scene;
  episodeId: number;
  imageSize: ImageSize;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, episodeId, imageSize }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new GeminiService();
      const url = await service.generateFrame(scene.visual, imageSize);
      if (url) {
        setImageUrl(url);
      } else {
        setError("Failed to generate image.");
      }
    } catch (err: any) {
      if (err.message === "API_KEY_EXPIRED") {
        setError("API Key invalid or not found. Please re-select.");
      } else {
        setError("AI generation unavailable. Check your connection or API key.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all duration-300">
      <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={scene.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-700 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-sm max-w-[200px]">{scene.visual}</p>
            <button 
              onClick={generateImage}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'GENERATING...' : 'VISUALIZE FRAME'}
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 font-orbitron text-xs tracking-widest animate-pulse">RENDERING GRID DATA...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center p-4 text-center">
            <p className="text-red-400 text-sm bg-black/60 px-4 py-2 rounded border border-red-500/50">{error}</p>
          </div>
        )}

        {/* Scene Label Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-black/80 text-emerald-400 border border-emerald-500/50 px-2 py-1 text-[10px] font-orbitron tracking-tighter rounded">
            FRAME {episodeId}-{scene.id}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-emerald-400 font-bold text-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {scene.title}
          </h3>
        </div>

        {scene.narrative !== "无" && (
          <div className="bg-neutral-800/30 p-3 border-l-2 border-emerald-500 rounded-r">
            <p className="italic text-neutral-300 text-sm leading-relaxed">{scene.narrative}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-neutral-400">
            <strong className="text-white text-xs uppercase tracking-widest block mb-1 opacity-50">Dialogue</strong>
            {scene.dialogue === "无" ? <span className="italic text-neutral-600">Silent</span> : scene.dialogue}
          </p>
          <p className="text-sm text-neutral-400">
            <strong className="text-white text-xs uppercase tracking-widest block mb-1 opacity-50">SFX / UI</strong>
            {scene.ui_sfx === "无" ? <span className="italic text-neutral-600">N/A</span> : <code className="text-emerald-300 font-orbitron text-[10px] bg-emerald-950/30 px-2 py-0.5 rounded">{scene.ui_sfx}</code>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
