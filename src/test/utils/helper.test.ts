import { describe, expect, it } from 'vitest';
import { buildCaptchaBoxes, shuffleArrayData } from '../../utils/helper';

describe('helper functions', () => {
  // TEST CASE 1 - creating 25 captcha boxes
  it('create captcha with 25 boxes', () => {
    const captchaBoxes = buildCaptchaBoxes();
    expect(captchaBoxes.length).toBe(25);
  });

  // TEST CASE 2 - checking if at least 50% boxes has the shape and color
  it('create 25 captcha boxes and check 50% of them has shape and color', () => {
    const captchaBoxes = buildCaptchaBoxes();
    const fiftyPercentBoxCount = Math.ceil(captchaBoxes?.length / 2);

    const totalBoxesWithShapeAndColor =
      captchaBoxes.filter((box) => box.type !== null && box.color !== null)
        ?.length || 0;

    expect(totalBoxesWithShapeAndColor).toBe(fiftyPercentBoxCount);
  });

  // TEST CASE 3 - checking shuffling logic and also checking for removing any item or not
  it('shuffling array data and check for losing element', () => {
    const DUMMY_TEST_DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledData = shuffleArrayData(DUMMY_TEST_DATA);

    expect(shuffledData.length).toBe(DUMMY_TEST_DATA.length);

    const sortedShuffledData = shuffledData.sort((a, b) => a - b);
    expect(sortedShuffledData).toEqual(DUMMY_TEST_DATA);
  });
});
