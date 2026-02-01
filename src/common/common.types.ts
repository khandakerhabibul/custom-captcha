export interface CommonShuffledDataType {
  shuffledPuzzle: CaptchaItem[];
  handleSetId: (id: number) => void;
  selectedIds: number[] | null;
}

export type CaptchaShapeType = 'triangle' | 'square' | 'circle';
export type CaptchaShapeColorType = 'blue' | 'green' | 'red';

export interface CaptchaItem {
  id: number;
  type: CaptchaShapeType | null;
  color: CaptchaShapeColorType | null;
  watermark: Watermark | null;
}

export interface Watermark {
  opacity: number;
  blur: number;
  rotate: number;
}

export interface TargettedCaptchaBoxes {
  type: CaptchaShapeType | null;
  color: CaptchaShapeColorType | null;
}
