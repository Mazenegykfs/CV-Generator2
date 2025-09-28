import type { Language } from '../types';

declare const html2canvas: any;
declare const jspdf: any;

interface PdfHeaderInfo {
    name: string;
    title: string;
    profilePic: string;
    language: Language;
}

export const generatePdf = async (element: HTMLElement, headerInfo: PdfHeaderInfo) => {
    const pdfBtn = document.getElementById('generate-pdf-btn');
    if (!pdfBtn) return;
    const originalButtonHTML = pdfBtn.innerHTML;
    pdfBtn.setAttribute('disabled', 'true');
    pdfBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Exporting...`;

    try {
        await (document as any).fonts.ready;
        const { jsPDF } = jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 40;
        let y = margin;

        // Create and render header off-screen
        const pdfHeader = document.createElement('div');
        Object.assign(pdfHeader.style, {
            width: `${pageWidth - margin * 2}px`, padding: '20px', display: 'flex', alignItems: 'center', fontFamily: headerInfo.language === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif", direction: headerInfo.language === 'ar' ? 'rtl' : 'ltr', position: 'absolute', left: '-9999px', backgroundColor: 'white'
        });
        const marginRight = headerInfo.language === 'ar' ? '20px' : '0';
        const marginLeft = headerInfo.language === 'ar' ? '0' : '20px';
        pdfHeader.innerHTML = `
            <div> <img src="${headerInfo.profilePic}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;"/> </div>
            <div style="margin-left: ${marginLeft}; margin-right: ${marginRight};">
                <h1 style="font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; font-family: ${headerInfo.language === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif"};">${headerInfo.name}</h1>
                <p style="font-size: 14px; color: #374151; margin: 5px 0 0 0; font-family: ${headerInfo.language === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif"};">${headerInfo.title}</p>
            </div>`;
        document.body.appendChild(pdfHeader);
        const headerCanvas = await html2canvas(pdfHeader, { scale: 2, useCORS: true });
        const headerImgData = headerCanvas.toDataURL('image/png');
        const headerPdfImgHeight = (headerCanvas.height / headerCanvas.width) * (pageWidth - margin * 2);
        pdf.addImage(headerImgData, 'PNG', margin, y, pageWidth - margin * 2, headerPdfImgHeight);
        y += headerPdfImgHeight + 20;
        document.body.removeChild(pdfHeader);

        // Render sections
        const sections = element.querySelectorAll('.section-card');
        for (const section of sections) {
            const canvas = await html2canvas(section as HTMLElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdfImgHeight = (canvas.height / canvas.width) * (pageWidth - margin * 2);

            if (y + pdfImgHeight > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
            pdf.addImage(imgData, 'PNG', margin, y, pageWidth - margin * 2, pdfImgHeight);
            y += pdfImgHeight + 20;
        }

        pdf.save(`${headerInfo.name}-CV.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    } finally {
        pdfBtn.removeAttribute('disabled');
        pdfBtn.innerHTML = originalButtonHTML;
    }
};


export const exportHtml = (element: HTMLElement, headerInfo: PdfHeaderInfo) => {
    const { name, title, profilePic, language } = headerInfo;
    const isAr = language === 'ar';

    const headerHTML = `
        <header style="padding: 20px; display: flex; align-items: center; font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; direction: ${isAr ? 'rtl' : 'ltr'}; background-color: white; border-radius: 1rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
            <div>
                <img src="${profilePic}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 4px solid #60a5fa;"/>
            </div>
            <div style="margin-left: ${isAr ? '0' : '20px'}; margin-right: ${isAr ? '20px' : '0'};">
                <h1 style="font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0;">${name}</h1>
                <p style="font-size: 14px; color: #374151; margin: 5px 0 0 0;">${title}</p>
            </div>
        </header>
    `;

    const mainContentHTML = element.innerHTML;
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name} - CV</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Poppins', sans-serif; background-color: #f0f9ff; }
                .font-cairo { font-family: 'Cairo', sans-serif; }
                .section-card { page-break-inside: avoid; }
            </style>
        </head>
        <body class="p-8">
            ${headerHTML}
            <main>${mainContentHTML}</main>
        </body>
        </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name}-cv.html`;
    link.click();
    URL.revokeObjectURL(link.href);
};