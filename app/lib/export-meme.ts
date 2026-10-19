export async function renderPng(svg: string): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not render the PNG. You can still download the SVG.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1080;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG export is unavailable in this browser. Try downloading SVG.');
    context.drawImage(image, 0, 0, 1080, 1080);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('PNG export failed. Try downloading SVG.'));
    }, 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
