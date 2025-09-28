
import type { ParsedSection } from '../types';

// These are declared globally in App.tsx but we need to tell TS they exist
declare const XLSX: any;

export const parseXlsx = (file: File): Promise<ParsedSection[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!e.target?.result) {
                    throw new Error("File could not be read.");
                }
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const parsedData: Record<string, string[]> = {};
                let currentSection = "";

                rows.slice(1).forEach(row => {
                    const sectionTitle = row[0] ? String(row[0]).trim() : "";
                    const detail = row[1] ? String(row[1]).trim() : "";

                    if (sectionTitle) {
                        currentSection = sectionTitle;
                        if (!parsedData[currentSection]) {
                            parsedData[currentSection] = [];
                        }
                    }
                    if (detail && currentSection) {
                        parsedData[currentSection].push(detail);
                    }
                });
                
                const result: ParsedSection[] = Object.entries(parsedData).map(([title, items]) => ({
                    title,
                    items
                }));

                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

export const downloadTemplate = () => {
    const templateData = [
        ["section", "details"],
        ["المعلومات الشخصية", "الإســــــــــــــــــم : اكتب الاسم هنا"],
        ["المعلومات الشخصية", "الوظيفة الحــاليــة : اكتب المنصب هنا"],
        ["المعلومات الشخصية", "رقـــــم التليــــفون : اكتب الرقم هنا"],
        ["المعلومات الشخصية", "البريد الإلكترونـى : اكتب البريد هنا"],
        ["المؤهلات العلمية", "اكتب المؤهل الأول هنا"],
        ["التدرج الوظيفى", "اكتب الخبرة الأولى هنا"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CV Template");
    XLSX.writeFile(wb, "cv_template.xlsx");
};
