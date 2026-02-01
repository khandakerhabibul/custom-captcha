import { useEffect, useState } from 'react';
import {
  buildCaptchaBoxes,
  getCaptchaErrorCountFromLocalStorage,
  isCaptchaCheckLocked,
  remainingTimeToAccessCaptcha,
  resetCaptchaRetryTimeFromLocalStorage,
  resetCpatchaErrorCountFromLocalStorage,
  shuffleArrayData,
} from '../utils/helper';
import type {
  CaptchaItem,
  TargettedCaptchaBoxes,
} from '../common/common.types';

function useCaptcha(): {
  shuffledPuzzle: CaptchaItem[];
  handleShuffle: () => void;
  targettedBoxesShapeColor: TargettedCaptchaBoxes;
  totalTargettedBoxIds: number[] | null;
  checkValidCaptcha: (userSelectedIds: number[]) => boolean;
  isLockedCaptcha: boolean;
  setIsLockedCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
  remainingTimeToUnlock: number | null;
  captchaValid: boolean;
  setCaptchaValid: React.Dispatch<React.SetStateAction<boolean>>;
  captchaErrorCount: number;
  setCaptchaErrorCount: React.Dispatch<React.SetStateAction<number>>;
} {
  const [shuffledPuzzle, setShuffledPuzzle] = useState<CaptchaItem[]>([]);
  const [targettedBoxesShapeColor, setTargettedBoxesShapeColor] =
    useState<TargettedCaptchaBoxes>({
      type: null,
      color: null,
    });

  const [totalTargettedBoxIds, setTotalTargettedBoxIds] = useState<
    number[] | null
  >(null);

  const [captchaValid, setCaptchaValid] = useState<boolean>(false);
  const [captchaErrorCount, setCaptchaErrorCount] = useState<number>(
    getCaptchaErrorCountFromLocalStorage(),
  );

  const [isLockedCaptcha, setIsLockedCaptcha] = useState<boolean>(
    isCaptchaCheckLocked(),
  );
  const [remainingTimeToUnlock, setRemainingTimeToUnlock] = useState<
    number | null
  >(remainingTimeToAccessCaptcha());

  useEffect(() => {
    if (!isLockedCaptcha) return;

    const timeInterval = setInterval(() => {
      const isLocked = isCaptchaCheckLocked();
      const remianingTime = remainingTimeToAccessCaptcha();

      if (!isLocked) {
        setIsLockedCaptcha(false);
        setRemainingTimeToUnlock(0);
        resetCaptchaRetryTimeFromLocalStorage();
        resetCpatchaErrorCountFromLocalStorage();
      } else {
        setRemainingTimeToUnlock(remianingTime);
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [isLockedCaptcha]);

  const generatedCaptchaBox = buildCaptchaBoxes();

  const handleShuffle = () => {
    // NOTE - shuffled data for grid with shapes and empty boxes
    const shuffledArray = shuffleArrayData(generatedCaptchaBox);
    setShuffledPuzzle(shuffledArray);

    // NOTE - filtering out empty boxes and randomly targetting a box and its shape and color
    const filteredOutTargetBoxes =
      shuffledArray?.filter((box) => box.type !== null) || [];

    const randomTargetBoxFromFilteredData =
      filteredOutTargetBoxes[
        Math.floor(Math.random() * filteredOutTargetBoxes.length)
      ];

    const targettedBoxesShapeColor = {
      type: randomTargetBoxFromFilteredData?.type,
      color: randomTargetBoxFromFilteredData?.color,
    };

    setTargettedBoxesShapeColor(targettedBoxesShapeColor);

    // NOTE - finding out how many boxes with same shape,color available in the grid by using id
    const findTotalTargettedBox =
      filteredOutTargetBoxes?.filter(
        (box) =>
          box.type === targettedBoxesShapeColor.type &&
          box.color === targettedBoxesShapeColor.color,
      ) || [];

    setTotalTargettedBoxIds(findTotalTargettedBox?.map((box) => box.id));
  };

  const checkValidCaptcha = (userSelectedIds: number[]) => {
    if (totalTargettedBoxIds?.length !== userSelectedIds?.length) return false;

    const sortedTotalTargettedBoxIds = totalTargettedBoxIds?.sort(
      (a, b) => a - b,
    );

    const sortedUserSelectedIds = userSelectedIds?.sort((a, b) => a - b);

    return sortedTotalTargettedBoxIds?.every(
      (targetId, index) => targetId === sortedUserSelectedIds?.[index],
    );
  };

  return {
    shuffledPuzzle,
    handleShuffle,
    targettedBoxesShapeColor,
    totalTargettedBoxIds,
    checkValidCaptcha,
    isLockedCaptcha,
    setIsLockedCaptcha,
    remainingTimeToUnlock,
    captchaErrorCount,
    setCaptchaErrorCount,
    captchaValid,
    setCaptchaValid,
  };
}

export default useCaptcha;
