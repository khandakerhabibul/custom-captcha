import type { CommonShuffledDataType } from '../../common/common.types';
import { CIRCLE, SQAUARE, TRIANGLE } from '../../common/constant';

function CaptchaPuzzleBox({
  shuffledPuzzle,
  selectedIds,
  handleSetId,
}: CommonShuffledDataType) {
  return (
    <div className='bg-white/45 h-full w-full grid grid-cols-5 grid-rows-5 gap-px'>
      {shuffledPuzzle?.map((box, idx) => {
        if (box?.type === null) {
          return (
            <div
              key={`${box?.type} ${idx}`}
              className='border border-white flex justify-center items-center'
            />
          );
        }

        return (
          <div
            className={`border flex justify-center items-center cursor-pointer 
              ${selectedIds?.includes(box?.id) ? 'border-4 border-black' : 'border-white'}
              `}
            onClick={() => {
              handleSetId(box?.id);
            }}
            key={`${box?.type} ${idx}`}
            style={{}}
          >
            <span
              style={{
                color: box?.color as string,
                opacity: box?.watermark?.opacity,
                filter: `blur(${box?.watermark?.blur}px)`,
                transform: `rotate(${box?.watermark?.rotate}deg)`,
              }}
            >
              {box?.type === TRIANGLE && '▲'}
              {box?.type === SQAUARE && '■'}
              {box?.type === CIRCLE && '●'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default CaptchaPuzzleBox;
