import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCaptcha from '../../hooks/useCaptcha';

describe('useCaptcha hook test', () => {
  // TEST CASE 1 - checking for generated shuffled data
  it('generated shuffled data', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      // NOTE - generating shuffled data by using the generator function from the hook
      result.current.handleShuffle();
    });

    // NOTE - expecting at least data has generated
    expect(result.current.shuffledPuzzle.length).toBeGreaterThan(0);
  });

  // TEST CASE 2 - checking for correct selection captcha validation logic
  it('validate correct selection captcah logic', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      // NOTE - generating shuffled data, which also generate the new target boxes colors and shapes
      result.current.handleShuffle();
    });

    const totalTargettedBoxIds = result.current.totalTargettedBoxIds || [];
    const isValidCaptcha =
      result.current.checkValidCaptcha(totalTargettedBoxIds);

    expect(isValidCaptcha).toBe(true);
  });

  // TEST CASE 3 - checking for wrong selection captcha validation logic
  it('validate wrong selection captcha logic', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      result.current.handleShuffle();
    });

    const totalTargettedBoxIds = result.current.totalTargettedBoxIds || [];

    const wrongSelection = [...totalTargettedBoxIds, Math.random() * 10];

    const isValidCaptcha = result.current.checkValidCaptcha(wrongSelection);

    expect(isValidCaptcha).toBe(false);
  });

  // TEST CASE 4 - checking for empty selection captcha validation logic
  it('validate empty selection captcha logic', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      result.current.handleShuffle();
    });
    const isValidCaptcha = result.current.checkValidCaptcha([]);

    expect(isValidCaptcha).toBe(false);
  });
});
