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