
import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize, Scene, Episode, Lore } from '../types';

export interface VideoResult {
  url: string;
  asset: any;
}

export class GeminiService {
  constructor() {}

  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async refineText(field: string, currentText: string, context?: string): Promise<string> {
    try {
      const ai = this.getClient();
      const prompt = `You are a world-class creative writer for a cyberpunk manga called "Grid Chronicles".
      Refine and expand the following ${field}. 
      Current Text: "${currentText}"
      ${context ? `Context about the world: ${context}` : ''}
      
      Requirements:
      - Keep it professional, evocative, and technical (cyberpunk feel).
      - Maintain the "Verdant vs Azure" conflict themes.
      - Return ONLY the refined text, no preamble.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      return response.text || currentText;
    } catch (error) {
      console.error("Refine text failed:", error);
      return currentText;
    }
  }

  async generateFrame(visual: string, description: string, size: ImageSize = '1K'): Promise<string | null> {
    try {
      const ai = this.getClient();
      const prompt = `Manga storyboard frame for "Grid Chronicles". 
Style: High-end digital manga, cyber-punk aesthetic. 
Scene Visual Composition: ${visual}
Context: ${description}
Color: Neon greens and deep blues. Cinematic lighting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "16:9", imageSize: size }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error: any) {
      console.error("Image generation failed:", error);
      if (error?.message?.includes("Requested entity was not found")) throw new Error("API_KEY_EXPIRED");
      throw error;
    }
  }

  async generateChapterScript(lore: Lore, episode: Episode): Promise<Scene[]> {
    const ai = this.getClient();
    const prompt = `Generate a detailed 8-frame manga storyboard script for the chapter titled "${episode.title}".
    WORLD LORE: ${lore.background}
    CHARACTERS: ${lore.characters}
    CHAPTER SUMMARY: ${episode.summary}
    
    Requirements:
    - 8 frames total.
    - High-end digital manga aesthetic.
    - Grid-based cyberpunk UI elements in visuals.
    - Narrative should be poetic yet technical.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              visual: { type: Type.STRING },
              description: { type: Type.STRING },
              narrative: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              ui_sfx: { type: Type.STRING }
            },
            required: ["id", "title", "visual", "description", "narrative", "dialogue", "ui_sfx"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse script JSON", e);
      return [];
    }
  }

  async generateVideo(visual: string, description: string, onProgress: (msg: string) => void): Promise<VideoResult | null> {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) throw new Error("API_KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Cinematic manga animation. ${visual}. ${description}. 
      High motion, dynamic camera sweep, neon grid effects. 
      Professional 2D animation style with depth.`;

      onProgress("Initiating Grid Simulation...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        onProgress("Synthesizing Motion Frames...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
        throw new Error(`API_ERROR: ${operation.error.message || 'Operation failed'}`);
      }

      const videoAsset = operation.response?.generatedVideos?.[0]?.video;
      if (!videoAsset) throw new Error("No video asset returned from server.");

      onProgress("Finalizing Media Stream...");
      const response = await fetch(`${videoAsset.uri}&key=${apiKey}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DOWNLOAD_FAILED: HTTP ${response.status} - ${errorText.substring(0, 100)}`);
      }
      
      const blob = await response.blob();
      return {
        url: URL.createObjectURL(blob),
        asset: videoAsset
      };
    } catch (error: any) {
      console.error("Video generation engine error:", error);
      throw error;
    }
  }

  async extendVideo(previousAsset: any, onProgress: (msg: string) => void): Promise<VideoResult | null> {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) throw new Error("API_KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey });
      onProgress("Calculating Temporal Extension (+7s)...");

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: "The action continues seamlessly, enhancing the cinematic scale and revealing more of the environment.",
        video: previousAsset,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        onProgress("Synthesizing Extended Frames...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
        throw new Error(`API_ERROR: ${operation.error.message || 'Extension failed'}`);
      }

      const videoAsset = operation.response?.generatedVideos?.[0]?.video;
      if (!videoAsset) throw new Error("No extended video asset returned.");

      onProgress("Downloading Extended Stream...");
      const response = await fetch(`${videoAsset.uri}&key=${apiKey}`);
      if (!response.ok) throw new Error("Failed to download extended video.");
      
      const blob = await response.blob();
      return {
        url: URL.createObjectURL(blob),
        asset: videoAsset
      };
    } catch (error: any) {
      console.error("Video extension error:", error);
      throw error;
    }
  }

  static async checkApiKey(): Promise<boolean> {
    // @ts-ignore
    return await window.aistudio.hasSelectedApiKey();
  }

  static async openKeySelector() {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }
}
