"use client";

import { useEffect, useRef, useState } from "react";

export function useCanvasPixelation(characterImage, count, levelType) {
  const canvasRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!characterImage) {
      setIsImageLoaded(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      if (img.crossOrigin === "anonymous") {
        img.crossOrigin = null;
        img.src = characterImage;
      }
    };

    img.onload = () => {
      try {
        const maxSize = 400;
        const aspect = img.width / img.height;
        canvas.width = aspect >= 1 ? maxSize : Math.round(maxSize * aspect);
        canvas.height = aspect >= 1 ? Math.round(maxSize / aspect) : maxSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const maxBlockSize = levelType === 1 ? 32 : 80;
        const minBlockSize = 1;
        const shortSide = Math.min(canvas.width, canvas.height);

        const blockSize = Math.max(
          minBlockSize,
          Math.round((maxBlockSize - Math.floor((count / 6) * (maxBlockSize - minBlockSize))) * (shortSide / 400)),
        );

        if (count === 6) {
          if (levelType === 1) {
            applyGrayscale(ctx, canvas.width, canvas.height);
          }
          setIsImageLoaded(true);
          return;
        }

        applyPixelation(ctx, canvas.width, canvas.height, blockSize, levelType);
        setIsImageLoaded(true);
      } catch (error) {
        console.error("Error during canvas operations:", error);
        setIsImageLoaded(false);
      }
    };

    img.src = characterImage;
  }, [characterImage, count, levelType]);

  return { canvasRef, isImageLoaded };
}

function applyGrayscale(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyPixelation(ctx, width, height, blockSize, levelType) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        pixelCount = 0;

      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          pixelCount++;
        }
      }

      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      a = Math.floor(a / pixelCount);

      if (levelType === 1) {
        const avg = Math.floor((r + g + b) / 3);
        r = g = b = avg;
      }

      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          newData[i] = r;
          newData[i + 1] = g;
          newData[i + 2] = b;
          newData[i + 3] = a;
        }
      }
    }
  }

  const newImageData = new ImageData(newData, width, height);
  ctx.putImageData(newImageData, 0, 0);
}
