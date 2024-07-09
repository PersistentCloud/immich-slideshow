import { FastAverageColor } from 'fast-average-color';


const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


const getGradientForSide = async (base64: string, side: 'left' | 'right'): Promise<string> => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = `${base64}`;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const fac = new FastAverageColor();
  const left = side === 'left' ? 0 : img.naturalWidth - 10;
  const color = await fac.getColorAsync(img, { left, width: 10 });

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


export const getGradientForBothSides = async (base64: string | null) => {
  if (!base64) {
    return null;
  }
  else {
    const leftSide = await getGradientForSide(base64, 'left').then(gradient => {
      return gradient;
    });

    const rightSide = await getGradientForSide(base64, 'right').then(gradient => {
      return gradient;
    });

    return {
      left: leftSide,
      right: rightSide
    };
  }
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