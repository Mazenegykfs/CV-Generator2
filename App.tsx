import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { CvData, Language } from './types';
import { DeveloperHeader } from './components/DeveloperHeader';
import { ControlBanner } from './components/ControlBanner';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Sidebar } from './components/Sidebar';
import { CvContent } from './components/CvContent';
import { parseXlsx, downloadTemplate } from './services/fileService';
import { translateCvData } from './services/geminiService';
import { generatePdf, exportHtml } from './services/exportService';

// Declare global libraries from CDN
declare const XLSX: any;
declare const html2canvas: any;
declare const jspdf: any;

const App: React.FC = () => {
    const [cvData, setCvData] = useState<CvData | null>(null);
    const [language, setLanguage] = useState<Language>('ar');
    const [profilePic, setProfilePic] = useState<string>('https://placehold.co/96x96/FFFFFF/3B82F6?text=CV');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('No file chosen');
    const [activeSection, setActiveSection] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const cvContentRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName('No file chosen');
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePic(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateCv = useCallback(async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert("Please select an XLSX file first.");
            return;
        }
        setIsLoading(true);
        try {
            const parsedData = await parseXlsx(file);
            const translatedData = await translateCvData(parsedData);
            setCvData(translatedData);
            setLanguage('ar');
            alert("CV Generated Successfully!");
        } catch (error) {
            console.error("Error during CV processing:", error);
            alert(`An error occurred while processing the file: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePdfExport = useCallback(async () => {
      if (!cvContentRef.current || !cvData) {
        alert("CV data not available to export.");
        return;
      }
      const personalInfo = cvData.find(sec => sec.ar_title.includes("الشخصية"));
      const name = personalInfo?.en_items.find(item => item.toLowerCase().includes('name'))?.split(/[:]/).pop()?.trim() || "CV";
      const title = personalInfo?.en_items.find(item => item.toLowerCase().includes('role') || item.toLowerCase().includes('title'))?.split(/[:]/).pop()?.trim() || "Details";
      
      await generatePdf(cvContentRef.current, {name, title, profilePic, language});
    }, [cvData, profilePic, language]);

    const handleHtmlExport = useCallback(() => {
        if (!cvContentRef.current || !cvData) {
          alert("CV data not available to export.");
          return;
        }
        const personalInfo = cvData.find(sec => sec.ar_title.includes("الشخصية"));
        const name = personalInfo?.en_items.find(item => item.toLowerCase().includes('name'))?.split(/[:]/).pop()?.trim() || "CV";
        const title = personalInfo?.en_items.find(item => item.toLowerCase().includes('role') || item.toLowerCase().includes('title'))?.split(/[:]/).pop()?.trim() || "Details";

        exportHtml(cvContentRef.current, { name, title, profilePic, language });

    }, [cvData, language, profilePic]);
    
    const updateActiveLink = useCallback(() => {
        if (!cvContentRef.current) return;
        let current = '';
        const sections = cvContentRef.current.querySelectorAll('section');
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id') || '';
            }
        });
        setActiveSection(current);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateActiveLink);
        return () => window.removeEventListener('scroll', updateActiveLink);
    }, [updateActiveLink]);

    return (
        <div className="min-h-screen text-gray-700">
            <DeveloperHeader />
            <ControlBanner
                onDownloadTemplate={downloadTemplate}
                onGenerateCv={handleGenerateCv}
                onGeneratePdf={handlePdfExport}
                onExportHtml={handleHtmlExport}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                fileName={fileName}
                imageInputRef={imageInputRef}
                onImageChange={handleImageChange}
                isGenerating={isLoading}
                isCvGenerated={!!cvData}
            />
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            <header className="bg-blue-700 text-white text-center py-2 text-xl font-bold">
                Curriculum Vitae
            </header>
            <div className="flex flex-col md:flex-row">
                <Sidebar
                    cvData={cvData}
                    profilePic={profilePic}
                    language={language}
                    activeSection={activeSection}
                />
                <main className="main-content w-full p-4 md:p-8">
                    <CvContent ref={cvContentRef} cvData={cvData} language={language} />
                </main>
            </div>
        </div>
    );
};

export default App;