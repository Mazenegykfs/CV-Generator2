
import React, { forwardRef } from 'react';
import type { CvData, Language } from '../types';

interface CvContentProps {
    cvData: CvData | null;
    language: Language;
}

export const CvContent = forwardRef<HTMLDivElement, CvContentProps>(({ cvData, language }, ref) => {
    const isAr = language === 'ar';

    if (!cvData) {
        return (
            <div className="text-center p-10 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-600">Welcome to the Dynamic CV Generator</h2>
                <p className="text-gray-500 mt-4">To get started, please use the control banner at the top of the page:</p>
                <ol className="list-decimal list-inside text-left inline-block mt-4 space-y-2 text-gray-500">
                    <li>Download the XLSX template file.</li>
                    <li>Fill it with your CV data in Arabic.</li>
                    <li>Upload the completed file using "Choose File".</li>
                    <li>(Optional) Upload a profile image.</li>
                    <li>Click "Generate CV" to see the magic happen!</li>
                </ol>
            </div>
        );
    }

    return (
        <div ref={ref}>
            {cvData.map(section => (
                <section key={section.id} id={section.id} className="section-card mb-8 p-6 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-md">
                    {/* English Content */}
                    <div style={{ display: !isAr ? 'block' : 'none' }}>
                        <h2 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-500 pb-2 mb-4 flex items-center">
                            <i className={`${section.icon} mr-3`}></i>{section.en_title}
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">
                            {section.en_items.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>

                    {/* Arabic Content */}
                    <div className="font-cairo text-right" style={{ display: isAr ? 'block' : 'none' }}>
                         <h2 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-500 pb-2 mb-4 flex items-center justify-end">
                            {section.ar_title}<i className={`${section.icon} ml-3`}></i>
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-800" style={{ direction: 'rtl' }}>
                             {section.ar_items.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </section>
            ))}
        </div>
    );
});
