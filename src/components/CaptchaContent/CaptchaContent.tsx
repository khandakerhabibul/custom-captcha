import React from 'react';
import { CaptchaBoxHeight, CaptchaBoxWidth } from '../../common/constant';
import useMovingPlaceholder from '../../hooks/useMovingPlaceholder';
import CaptchaPuzzleBox from './CaptchaPuzzleBox';
import type { CommonShuffledDataType } from '../../common/common.types';

interface CaptchaContentProps extends CommonShuffledDataType {
  isPositionLocked: boolean;
}

const CaptchaContent = React.forwardRef<HTMLDivElement, CaptchaContentProps>(
  function CaptchaContent(
    { isPositionLocked, shuffledPuzzle, selectedIds, handleSetId },
    ref,
  ) {
    const { placeholderPos } = useMovingPlaceholder({ isPositionLocked, ref });

    return (
      <div
        className='absolute top-0 left-0 bg-transparent border border-white transition-transform ease-in-out duration-1000'
        style={{
          width: CaptchaBoxWidth,
          height: CaptchaBoxHeight,
          transform: `translate(${placeholderPos.x}px, ${placeholderPos.y}px)`,
        }}
      >
        {isPositionLocked ? (
          <CaptchaPuzzleBox
            shuffledPuzzle={shuffledPuzzle}
            selectedIds={selectedIds}
            handleSetId={handleSetId}
          />
        ) : null}
      </div>
    );
  },
);

export default CaptchaContent;
