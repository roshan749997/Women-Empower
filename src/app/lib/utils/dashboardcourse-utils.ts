// utils/courseUtils.ts
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  return Math.round(price - (price * discount / 100));
};

export const generateCourseId = (): string => {
  return Date.now().toString();
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};