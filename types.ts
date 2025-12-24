
export interface Scene {
  id: number;
  title: string;
  visual: string;
  narrative: string;
  dialogue: string;
  ui_sfx: string;
}

export interface Episode {
  id: number;
  title: string;
  scenes: Scene[];
}

export enum Faction {
  AZURE = 'AZURE',
  VERDANT = 'VERDANT',
  NEUTRAL = 'NEUTRAL'
}

export type ImageSize = '1K' | '2K' | '4K';
