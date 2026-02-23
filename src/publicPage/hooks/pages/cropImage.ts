// Utilidad para recortar una imagen base64 usando coordenadas y devolver el resultado como base64
export async function getCroppedImg(imageSrc: string, crop: { x: number; y: number; width: number; height: number }, outputSize: number = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No context');
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        outputSize,
        outputSize
      );
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}
