
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateFrame(prompt: string, size: ImageSize = '1K'): Promise<string | null> {
    try {
      // Re-initialize to ensure we have the latest API Key from the dialog if needed
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: `Manga storyboard frame, high quality, digital art, cyber-manga aesthetic. Scene description: ${prompt}. Use a cinematic composition with neon blue and vibrant green accents.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: size
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      console.error("Image generation failed:", error);
      if (error?.message?.includes("Requested entity was not found")) {
        // Reset key state if possible or signal UI
        throw new Error("API_KEY_EXPIRED");
      }
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
