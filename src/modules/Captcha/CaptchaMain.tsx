import { useRef, useState } from 'react';
import CaptchaContent from '../../components/CaptchaContent/CaptchaContent';
import useCamera from '../../hooks/useCamera';
import useCaptcha from '../../hooks/useCaptcha';
import { CAPTCHA_MAX_ERROR_LIMIT } from '../../common/constant';
import {
  resetCaptchaRetryTimeFromLocalStorage,
  resetCpatchaErrorCountFromLocalStorage,
  storeCaptchaErrorCountToLocalStorage,
  storeCaptchaRteryTimeToLocalStorage,
} from '../../utils/helper';
import CaptchaError from './CaptchaError';
import CaptchaSuccess from './CaptchaSuccess';

function CaptchaMain() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // NOTE - using this state to lock the position of placeholder's last position
  const [isPositionLocked, setIsPositionLocked] = useState(false);
  const handleLockPosition = () => {
    setIsPositionLocked(true);
  };

  // NOTE - using this state to store user's selected boxes ids
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const handleSetId = (id: number) => {
    setSelectedIds((prev) => {
      if (!prev) return [id];

      const checkExistingId = prev?.includes(id);
      if (checkExistingId) {
        return prev?.filter((selectedId) => selectedId !== id);
      }

      return [...prev, id];
    });
  };

  // NOTE - hook for accessing camera and functionalities
  const {
    isCameraActive,
    canvasRef,
    setVideoElement,
    cameraError,
    handleCaptureSnapshot,
    isCameraStreamActive,
  } = useCamera();

  // NOTE - hook for handling captcha logics
  const {
    shuffledPuzzle,
    handleShuffle,
    targettedBoxesShapeColor,
    checkValidCaptcha,
    isLockedCaptcha,
    setIsLockedCaptcha,
    remainingTimeToUnlock,
    captchaErrorCount,
    setCaptchaErrorCount,
    captchaValid,
    setCaptchaValid,
  } = useCaptcha();

  const showError = cameraError && cameraError?.length > 0;

  // NOTE - on continue locking the position for captcha placeholder,
  // shuffling data to generate new target boxes
  // and capturing a snapshot from the video
  const handleContinue = () => {
    handleLockPosition();
    handleShuffle();
    handleCaptureSnapshot();
  };

  // NOTE - reset logic for captcha with reshuffling and selecting ids to null
  const resetCaptcha = () => {
    handleShuffle();
    setSelectedIds(null);
  };

  const handleValidatePuzzle = () => {
    // NOTE - checking for valid captcha
    if (checkValidCaptcha(selectedIds || [])) {
      // NOTE - if valid captcha then resetting local storage values and showing success text
      setCaptchaValid(true);
      resetCpatchaErrorCountFromLocalStorage();
      resetCaptchaRetryTimeFromLocalStorage();
    } else {
      // NOTE - if captcha is not valid then increasing error count upto max error limit
      const errorCount = captchaErrorCount + 1;

      setCaptchaErrorCount(errorCount);
      storeCaptchaErrorCountToLocalStorage(errorCount);

      if (errorCount >= CAPTCHA_MAX_ERROR_LIMIT) {
        // NOTE - if error count equal to max error limit then giving user a timeout to again accessing the captcha
        storeCaptchaRteryTimeToLocalStorage(Date.now());
        setIsLockedCaptcha(true);
      }

      // NOTE - resetting the captcha so that user can start over again
      resetCaptcha();
    }
  };

  // NOTE - error screen with timeout
  if (captchaErrorCount >= CAPTCHA_MAX_ERROR_LIMIT || isLockedCaptcha) {
    return <CaptchaError remainingTimeToUnlock={remainingTimeToUnlock} />;
  }

  // NOTE - success screen
  if (captchaValid) {
    return <CaptchaSuccess />;
  }

  // NOTE - default screen for captcah validation
  return (
    <div className='w-full h-screen flex justify-center items-center px-4'>
      <div
        className='
          p-4 md:p-6
          flex flex-col justify-center items-center gap-6 
          backdrop-blur-[5px] bg-white/10
          border border-white/20 rounded-2xl
          w-full sm:w-[90%] md:w-[75%] lg:w-[70%]
          max-w-4xl
        '
      >
        <div className='min-h-20 flex flex-col gap-3 text-center'>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold'>
            Captcha Validation
          </h1>

          {targettedBoxesShapeColor?.type &&
            targettedBoxesShapeColor?.color && (
              <h4 className='text-sm sm:text-base'>
                Please select {targettedBoxesShapeColor?.type} with{' '}
                <span style={{ color: targettedBoxesShapeColor?.color }}>
                  {targettedBoxesShapeColor?.color}
                </span>{' '}
                color
              </h4>
            )}
        </div>

        {/* NOTE - hidden video element, using it to stream camera data into canvas */}
        <video
          ref={(element) => {
            setVideoElement(element);
          }}
          autoPlay
          muted
          className='hidden'
        />

        {isCameraActive ? (
          showError ? (
            <div>{cameraError}</div>
          ) : (
            <>
              <div
                ref={containerRef}
                className='
                  relative w-full max-w-90 sm:max-w-105 md:max-w-120
                '
              >
                {/* NOTE - camera feed */}
                <canvas ref={canvasRef} className='w-full h-full rounded-md' />

                <CaptchaContent
                  ref={containerRef}
                  isPositionLocked={isPositionLocked}
                  shuffledPuzzle={shuffledPuzzle}
                  selectedIds={selectedIds}
                  handleSetId={handleSetId}
                />
              </div>

              <div className='mt-4'>
                <button
                  onClick={
                    isCameraStreamActive ? handleContinue : handleValidatePuzzle
                  }
                  className='
                    w-auto bg-blue-500 hover:bg-blue-600 
                    px-4 py-2 md:px-6 md:py-3 text-white text-sm sm:text-base 
                    cursor-pointer rounded-md transition
                  '
                >
                  {isCameraStreamActive ? 'Continue' : 'Validate'}
                </button>
              </div>
            </>
          )
        ) : (
          <div>
            {showError ? <div>{cameraError}</div> : <div>Loading...</div>}
          </div>
        )}

        {captchaErrorCount > 0 && (
          <div className='text-center'>
            <h3 className='text-sm sm:text-base text-red-500'>
              You have made {captchaErrorCount} error, you have{' '}
              {CAPTCHA_MAX_ERROR_LIMIT - captchaErrorCount} attempts left
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaptchaMain;
