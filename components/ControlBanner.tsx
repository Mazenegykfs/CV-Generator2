
import React from 'react';

interface ControlBannerProps {
    onDownloadTemplate: () => void;
    onGenerateCv: () => void;
    onGeneratePdf: () => void;
    onExportHtml: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string;
    imageInputRef: React.RefObject<HTMLInputElement>;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isGenerating: boolean;
    isCvGenerated: boolean;
}

const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; disabled?: boolean; id?: string }> = ({ onClick, children, className, disabled, id }) => (
    <button
        id={id}
        onClick={onClick}
        className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md text-sm whitespace-nowrap ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

export const ControlBanner: React.FC<ControlBannerProps> = ({
    onDownloadTemplate, onGenerateCv, onGeneratePdf, onExportHtml, fileInputRef, onFileChange, fileName, imageInputRef, onImageChange, isGenerating, isCvGenerated
}) => {
    return (
        <div className="bg-white/50 backdrop-blur-md p-3 shadow-md flex items-center justify-center flex-wrap gap-3 sticky top-0 z-40">
            <Button onClick={onDownloadTemplate} className="bg-blue-500 hover:bg-blue-600 text-white">
                <i className="fas fa-download mr-2"></i> Download Template
            </Button>

            <div className="flex items-center">
                <label htmlFor="file-upload" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-l-lg transition-all duration-300 flex items-center justify-center shadow-md text-sm cursor-pointer whitespace-nowrap">
                    <i className="fas fa-file-excel mr-2"></i> Choose File
                </label>
                <input type="file" id="file-upload" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".xlsx, .xls" />
                <span className="text-sm text-gray-700 bg-white py-2.5 px-3 rounded-r-lg shadow-md max-w-xs truncate">{fileName}</span>
            </div>

            <label htmlFor="image-upload" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md text-sm cursor-pointer">
                <i className="fas fa-image mr-2"></i> Upload Image
            </label>
            <input type="file" id="image-upload" ref={imageInputRef} onChange={onImageChange} className="hidden" accept="image/*" />

            <Button onClick={onGenerateCv} className="bg-green-500 hover:bg-green-600 text-white disabled:bg-green-400 disabled:cursor-not-allowed" disabled={isGenerating}>
                {isGenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <i className="fas fa-cogs mr-2"></i> Generate CV
                    </>
                )}
            </Button>

            <Button id="generate-pdf-btn" onClick={onGeneratePdf} className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400 disabled:cursor-not-allowed" disabled={!isCvGenerated}>
                <i className="fas fa-file-pdf mr-2"></i> Export to PDF
            </Button>
            
            <Button onClick={onExportHtml} className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-400 disabled:cursor-not-allowed" disabled={!isCvGenerated}>
                <i className="fas fa-file-code mr-2"></i> Export to HTML
            </Button>
        </div>
    );
};
