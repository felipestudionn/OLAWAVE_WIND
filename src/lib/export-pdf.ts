import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportTechPackPDF(
  element: HTMLElement,
  filename: string = 'tech-pack.pdf'
): Promise<void> {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    foreignObjectRendering: false,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

  if (imgHeight > A4_HEIGHT_MM) {
    const scaledWidth = (canvas.width * A4_HEIGHT_MM) / canvas.height;
    const xOffset = (A4_WIDTH_MM - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, A4_HEIGHT_MM);
  } else {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  }

  pdf.save(filename);
}

export async function exportTechPackPNG(
  element: HTMLElement,
  filename: string = 'tech-pack.png'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    foreignObjectRendering: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
