import type { CaptchaItem, Watermark } from '../common/common.types';
import {
  CAPTCHA_COLORS,
  CAPTCHA_ERROR_COUNT_LOCALSTORAGE_KEY,
  CAPTCHA_RETRY_TIME,
  CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY,
  CAPTCHA_SHAPES,
  GRID_BOX_COUNT,
} from '../common/constant';

// NOTE - using Fisher-Yates shuffle algorithm - took help from this link - https://coreui.io/answers/how-to-shuffle-an-array-in-javascript/#:~:text=With%20over%2025%20years%20of,to%20randomly%20reorder%20array%20elements.&text=The%20Fisher%2DYates%20algorithm%20works,creating%20a%20truly%20uniform%20shuffle
// NOTE - using generics to make the function type safed
export const shuffleArrayData = <T>(data: T[]): T[] => {
  const shuffledArray = [...data];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const randomPickerFromArray = <T>(data: T[]): T => {
  const findingRandomIndex = Math.floor(Math.random() * data.length);

  return data[findingRandomIndex];
};

export const generateRandomNumberWithRange = (
  min: number,
  offset: number,
  float: boolean,
) => {
  const calculatedValue = Math.random() * min + offset;
  if (float) {
    return calculatedValue;
  }
  return Math.floor(calculatedValue); // NOTE - returing integer only
};

export const generateRandomWatermark = (): Watermark => {
  return {
    opacity: Number(generateRandomNumberWithRange(0.5, 0.5, true).toFixed(2)), // NOTE - range will be between 0.5 to 1
    blur: Number(generateRandomNumberWithRange(2, 0.5, true).toFixed(2)), // NOTE - blur range will be between 0.5 to 2.5
    rotate: generateRandomNumberWithRange(40, -10, false), // NOTE - this value will help to rotate -10 to +30, which can be both direction rotate, unpredictable
  };
};

export const buildCaptchaBoxes = (): CaptchaItem[] => {
  const captchaBoxes: CaptchaItem[] = [];

  // NOTE - creating empty boxes for grid
  for (let index = 0; index < GRID_BOX_COUNT; index++) {
    captchaBoxes.push({
      id: index,
      type: null,
      color: null,
      watermark: null,
    });
  }

  const firstFiftyPercentBox = Math.ceil(GRID_BOX_COUNT / 2);

  for (let index = 0; index < firstFiftyPercentBox; index++) {
    captchaBoxes[index].type = randomPickerFromArray(CAPTCHA_SHAPES);
    captchaBoxes[index].color = randomPickerFromArray(CAPTCHA_COLORS);
    captchaBoxes[index].watermark = generateRandomWatermark();
  }

  return captchaBoxes;
};

export const getCaptchaErrorCountFromLocalStorage = (): number => {
  const reedemedCaptchaErrorCount =
    Number(localStorage.getItem(CAPTCHA_ERROR_COUNT_LOCALSTORAGE_KEY)) || 0;

  return reedemedCaptchaErrorCount;
};
export const storeCaptchaErrorCountToLocalStorage = (errorCount: number) => {
  localStorage.setItem(
    CAPTCHA_ERROR_COUNT_LOCALSTORAGE_KEY,
    String(errorCount),
  );
};
export const resetCpatchaErrorCountFromLocalStorage = () => {
  localStorage.removeItem(CAPTCHA_ERROR_COUNT_LOCALSTORAGE_KEY);
};

export const storeCaptchaRteryTimeToLocalStorage = (retryTime: number) => {
  localStorage.setItem(CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY, String(retryTime));
};

export const resetCaptchaRetryTimeFromLocalStorage = () => {
  localStorage.removeItem(CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY);
};

export const isCaptchaCheckLocked = (): boolean => {
  const retryTime = localStorage.getItem(CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY);

  if (!retryTime) {
    return false;
  }

  const timeDiff = Date.now() - Number(retryTime);

  return timeDiff < CAPTCHA_RETRY_TIME; // NOTE - if time diff is less than 30 sec then it will be locked for user to access the captcha
};

export const remainingTimeToAccessCaptcha = (): number | null => {
  const retryTime = localStorage.getItem(CAPTCHA_RETRY_TIME_LOCALSTORAGE_KEY);

  if (!retryTime) {
    return null;
  }

  const timeDiff = Date.now() - Number(retryTime);
  const timePending = (CAPTCHA_RETRY_TIME - timeDiff) / 1000;

  // NOTE - checking if pending time is greater 0 or not, if greater than 0 then returing the ceiled time
  return timePending > 0 ? Math.ceil(timePending) : 0;
};
