
export interface Scene {
  id: number;
  title: string;
  visual: string;
  description: string;
  narrative: string;
  dialogue: string;
  ui_sfx: string;
  // Persistent media fields
  imageUrl?: string;
  videoAsset?: any;
  isExtended?: boolean;
}

export interface Episode {
  id: number;
  title: string;
  summary: string;
  scenes: Scene[];
}

export interface Lore {
  background: string;
  characters: string;
  rules: string;
}

export type ImageSize = '1K' | '2K' | '4K';
export type AppPhase = 'FORGE' | 'ARCHITECT' | 'VISUALIZE';
