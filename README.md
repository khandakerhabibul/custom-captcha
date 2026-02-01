# Custom CAPTCHA

This is a **Custom CAPTCHA** system implemented with **ReactJS** with **TypeScript**. It uses live camera and dynamic randomized optical challenges to differentiate between human and robot.

Internally workflow contains live camera video streaming into canvas with random puzzle validation. Also there is a block time implemented if you multiple attempts got failed.

## Features

- Live camera feed integration
- Dynamic positioned for captcha area
- Capturing snapshot from canvas
- Captcha with grid based randomized area
- Randomized area with dynamic shapes, color and with watermark (Visual - blur, opacity and rotation)
- Implemented Captcha validation logic
- Handled Captcha error flow
- Captcha error flow controlled with local storage
- Added unit testing

## Tech Stack

- ReactJS
- TypeScript
- Vite
- Canvas (HTML)
- Navigator media devices api
- TailwindCSS
- Vitest
- @testing-library/react

## Prerequisites

- Node version >= 18 (I haved used Node version 22.18.0)
- Web browser with camera permissions

## Setup

```bash
# Install dependencies
npm install
```

```bash
# Running dev server
npm run dev
```

```bash
# Running test cases
npm run test
```

## Captcha Workflow

- App will request an access for camera
- If access is not provided then user will see a message "Unable to access the camera"
- After providing the access, user will be able to see a live camera stream inside the canvas
- On top of the canvas showing a dynamic positioned placeholder for captcha, which will continuously moving inside the canvas area.
- After clicking on continue button immediate last frame from the camera stream will be captured and shown into the canvas, and close the camera service.
- When clicked on continue button the placeholder will be fixed to its current position and instead of the placeholder it will render the Captcha.
- Captcha will have 5x5 grid layout with different shapes(Triangle, Square, Circle) and colors(Red, Green, Blue).
- 50% of the grid boxes will contain randomized shapes with random colors. Also each shape will have their own random generated watermakr(blur, rotation, opacity)
- When grid generated at that time it also generate the targeted colors and shapes
- After selecting the correct boxes user will be able to see the success text
- If user unable to select the correct boxes then user will have 4 attempts to select the correct boxes. If user is unable to select the correct boxes within 4 attempts then user will be blocked for 15 seconds

## Security Measures

Used following system that will try to prevent automated solution-

- using real time camera stream
- dynamic position change captcha placeholder
- generated captcha box use randomized shape, color and position inside grid with watermark for extra security using blur, opacity and rotation.
- shape and color are also generated randomly which makes automated tools difficult to predict
- small amount of retry attempt and timeout period

## Testing steps

- automated tests covered helper functions, and core logics
- tested captcha state logics

Excluded camera access and captcha box puzzle testing from the automated testing because of browser and environment limitations.

## Limitations

- Must required camera access to use the captcha application
- **Since all the implementation done with the frontend solution only, so unable to provide full prevention of automated tools attack**

## Research Links

Below links I have used for my research to complete the functionality.

Camera Access + Streaming Feed + Capture research links -

- Camera access - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- Drawing camera stream to canvas and video element - https://webrtc.github.io/samples/src/content/getusermedia/canvas/
  https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/canvas/js/main.js
- Moving div idea -
  https://stackoverflow.com/questions/10385950/how-to-get-a-div-to-randomly-move-around-a-page-using-jquery-or-css#:~:text=The%20basic%20premise,point%20i%20hope.
  https://jsfiddle.net/Xw29r/
- Take snapshot - https://www.youtube.com/watch?v=itMi2fz-CvE
  And upload to canvas - https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

Captcha problem solve research links -

- Shuffling logic - https://coreui.io/answers/how-to-shuffle-an-array-in-javascript/#:~:text=With%20over%2025%20years%20of,to%20randomly%20reorder%20array%20elements.&text=The%20Fisher%2DYates%20algorithm%20works,creating%20a%20truly%20uniform%20shuffle.
- Captcha work concept idea - https://www.youtube.com/watch?v=MWu2UiLLJI8
