import { useEffect, useRef, useState } from 'react';

function useCamera(): {
  cameraStreamRef: React.RefObject<MediaStream | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraError: string;
  isCameraActive: boolean;
  handleCaptureSnapshot: () => void;
  setVideoElement: React.Dispatch<
    React.SetStateAction<HTMLVideoElement | null>
  >;
  isCameraStreamActive: boolean;
} {
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestAnimationFrameRef = useRef<number | null>(null);

  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraStreamActive, setIsCameraStreamActive] = useState(false);

  const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    return await navigator.mediaDevices?.getUserMedia(constraints);
  };

  useEffect(() => {
    if (!videoElement) return;

    const drawVideoToCanvas = () => {
      // const video = videoRef.current;
      const video = videoElement;
      const canvas = canvasRef.current;

      if (video && video.videoWidth > 0 && canvas) {
        const canvasContext = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (canvasContext) {
          // NOTE - drawing the video to the canvas
          canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }

      // NOTE - calling the function again to keep drawing,
      // and attaching it ref so that we can control the requestAnimationFrame call
      requestAnimationFrameRef.current =
        requestAnimationFrame(drawVideoToCanvas);
    };

    // NOTE - trying to get the camera access
    openMediaDevices({ video: true, audio: false })
      .then((stream) => {
        setIsCameraActive(true);
        setIsCameraStreamActive(true);

        // NOTE - got the camera access and passing it to feed as media stream
        cameraStreamRef.current = stream;

        if (videoElement) {
          videoElement.srcObject = stream;

          videoElement.onloadedmetadata = () => {
            // NOTE - after metadata is loaded then we can start drawing the stream to canvas
            requestAnimationFrame(drawVideoToCanvas);
          };

          // NOTE - playing the video once prerequisites are met
          videoElement.play();
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
        setCameraError('Unable to access camera');
      });

    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((cameraTrack) => {
          cameraTrack.stop();
        });
      }
    };
  }, [videoElement]);

  const stopAnimationFrame = () => {
    // NOTE - cancelling the requestAnimationFrame so that our newly captured image can be seen
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      requestAnimationFrameRef.current = null;
    }
  };

  const stopCameraStream = () => {
    if (!cameraStreamRef.current) return;

    // NOTE - stopping streaming since we do not need camera anymore after this
    cameraStreamRef.current.getTracks().forEach((cameraTrack) => {
      cameraTrack.stop();
      cameraTrack.enabled = false;
    });

    cameraStreamRef.current = null;
  };

  const clearVideoElement = () => {
    if (!videoElement) return;

    // NOTE - pausing the video and removing the src so that camera will not be active anymore
    videoElement.pause();
    videoElement.removeAttribute('src');
  };

  const drawImageIntoCanvas = (
    canvasContext: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    canvasImgData: string,
  ) => {
    // NOTE - generating image object and trying to put it on the canvas
    const image = new Image();
    image.onload = () => {
      // NOTE - clearing the canvas
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasContext.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    };
    image.src = canvasImgData;
  };

  const handleCaptureSnapshot = () => {
    if (!videoElement || !canvasRef || !canvasRef.current) return;

    try {
      const canvasContext = canvasRef.current.getContext('2d');
      const canvasWidth = canvasRef.current?.width || 0;
      const canvasHeight = canvasRef.current?.height || 0;

      if (!canvasContext) return;

      // NOTE - trying to get latest frame from video
      canvasContext?.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);

      // NOTE - getting image data from canvas
      const canvasImgData = canvasRef.current?.toDataURL('image/png');

      stopAnimationFrame();

      stopCameraStream();

      clearVideoElement();

      drawImageIntoCanvas(
        canvasContext,
        canvasWidth,
        canvasHeight,
        canvasImgData,
      );

      setIsCameraStreamActive(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    setVideoElement,
    canvasRef,
    cameraStreamRef,
    cameraError,
    isCameraActive,
    handleCaptureSnapshot,
    isCameraStreamActive,
  };
}

export default useCamera;
