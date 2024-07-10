import { FastAverageColor } from 'fast-average-color';


const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


const getGradientForSide = async (base64: string, side: 'left' | 'right', width: number): Promise<string> => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = `${base64}`;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const fac = new FastAverageColor();
  const left = side === 'left' ? 0 : img.naturalWidth - 10;
  const color = await fac.getColorAsync(base64, { left, width: 10, ignoredColor: [0, 0, 0, 0] });
  fac.destroy();

  const darkerColor = {
    r: Math.max(color.value[0] - 50, 0),
    g: Math.max(color.value[1] - 50, 0),
    b: Math.max(color.value[2] - 50, 0),
  };

  const hexColor = rgbToHex(color.value[0], color.value[1], color.value[2]);
  const darkerHexColor = rgbToHex(darkerColor.r, darkerColor.g, darkerColor.b);

  return left
    ? `${hexColor} 0%, ${darkerHexColor} 100%`
    : `${darkerHexColor} 0%, ${hexColor} 100%`;
};


export const getGradientForBothSides = async (base64: string | null, width: number, type: 'IMAGE' | 'VIDEO' = 'IMAGE') => {
  if (!base64) {
    return null;
  }
  if (type === 'IMAGE') {
    const leftSide = await getGradientForSide(base64, 'left', width).then(gradient => gradient);
    const rightSide = await getGradientForSide(base64, 'right', width).then(gradient => gradient);
    return {
      left: leftSide,
      right: rightSide
    };
  } else if (type === 'VIDEO') {
    const videoFrame = await getVideoFrame(base64);
    const leftSide = await getGradientForSide(videoFrame, 'left', width).then(gradient => gradient);
    const rightSide = await getGradientForSide(videoFrame, 'right', width).then(gradient => gradient);
    return {
      left: leftSide,
      right: rightSide
    };
  }
};

const getVideoFrame = async (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'Anonymous';
    video.currentTime = 1; // Capture frame at 1 second

    video.onloadeddata = () => {
      video.currentTime = 1; 
    };

    video.ontimeupdate = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    video.onerror = (error) => {
      console.error("Video error", error);
      reject(error);
    };
  });
};


export const combineArrays = (array: any, array2: any) => {
  const newArray = [...array, ...array2];
  return newArray;
};


// Fisher-Yates shuffle algorithm
export const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};