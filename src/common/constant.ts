import type { CaptchaShapeColorType, CaptchaShapeType } from './common.types';

export const CaptchaBoxWidth = 150;
export const CaptchaBoxHeight = 150;

export const TRIANGLE = 'triangle';
export const SQAUARE = 'square';
export const CIRCLE = 'circle';

export const GRID_BOX_COUNT = 25;

export const CAPTCHA_SHAPES: CaptchaShapeType[] = [TRIANGLE, SQAUARE, CIRCLE];
export const CAPTCHA_COLORS: CaptchaShapeColorType[] = ['blue', 'green', 'red'];

export const CAPTCHA_MAX_ERROR_LIMIT = 4;

export const CAPTCHA_ERROR_COUNT_LOCALSTORAGE_KEY = 'CAPTCHA_ERROR_COUNT';
export const CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY = 'CAPTCHA_RETRY_TIME';

export const CAPTCHA_RETRY_TIME = 15000; // NOTE - 15 second block time
