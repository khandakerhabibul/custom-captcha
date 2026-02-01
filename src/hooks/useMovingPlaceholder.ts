import { useEffect, useState, type ForwardedRef } from 'react';
import { CaptchaBoxHeight, CaptchaBoxWidth } from '../common/constant';

type Coordinate = { x: number; y: number };

type Props = {
  isPositionLocked: boolean;
  ref: ForwardedRef<HTMLDivElement>;
};

function useMovingPlaceholder({ isPositionLocked, ref }: Props): {
  placeholderPos: Coordinate;
} {
  const [placeholderPos, setPlaceholderPos] = useState<Coordinate>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (isPositionLocked) {
      return;
    }

    const handleMovePlaceholder = () => {
      // NOTE - checking if ref is valid or not
      if (!ref || typeof ref !== 'object') return;

      const container = ref.current;

      // NOTE - checking for container validity
      if (!container) return;

      // NOTE - finding the max coordinate points of parent container
      const containerMaxX = container.clientWidth - CaptchaBoxWidth; // NOTE - substracting box width so that it should not move to outside of the parent container
      const containerMaxY = container.clientHeight - CaptchaBoxHeight; // NOTE - same reason like above

      // NOTE - creating new coordinates for placeholder using container's max X and Y
      const placeholderX = Math.random() * containerMaxX;
      const placeholderY = Math.random() * containerMaxY;

      setPlaceholderPos({
        x: placeholderX,
        y: placeholderY,
      });
    };

    handleMovePlaceholder();

    const intervalForMoving = setInterval(handleMovePlaceholder, 1000);

    return () => {
      clearInterval(intervalForMoving);
    };
  }, [isPositionLocked]);

  return { placeholderPos };
}

export default useMovingPlaceholder;
