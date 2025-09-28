
import React from 'react';
import type { CvData, Language } from '../types';

interface SidebarProps {
    cvData: CvData | null;
    profilePic: string;
    language: Language;
    activeSection: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ cvData, profilePic, language, activeSection }) => {
    const isAr = language === 'ar';

    const getPersonalInfo = () => {
        if (!cvData) return { name: "CV Generator", title: "Upload a file to start" };
        
        const personalInfoSection = cvData.find(sec => sec.ar_title.includes("الشخصية"));
        if (!personalInfoSection) return { name: "Your Name", title: "Your Title" };
        
        const infoItems = isAr ? personalInfoSection.ar_items : personalInfoSection.en_items;
        
        const nameKey = isAr ? 'الإس' : 'name';
        const titleKey = isAr ? 'الوظيفة' : 'role|title';

        const findValue = (items: string[], key: string) => {
            const regex = new RegExp(key, 'i');
            const item = items.find(it => regex.test(it));
            return item ? item.split(/[:]/).pop()?.trim() : '';
        };

        return {
            name: findValue(infoItems, nameKey) || (isAr ? "اسمك" : "Your Name"),
            title: findValue(infoItems, titleKey) || (isAr ? "منصبك" : "Your Title"),
        };
    };

    const { name, title } = getPersonalInfo();

    return (
        <aside className={`sidebar bg-blue-600 text-white w-full md:w-64 min-h-screen p-4 shadow-lg sticky top-0 flex-col ${isAr ? 'font-cairo' : ''}`}>
            <div className={`text-center mb-8 ${isAr ? 'text-right' : 'text-left'}`}>
                <img src={profilePic} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-4 border-blue-400" />
                <h1 className="text-xl font-bold">{name}</h1>
                <p className="text-sm text-blue-200">{title}</p>
            </div>
            <nav className="space-y-2 flex-grow">
                {cvData?.map(section => {
                    const isActive = activeSection === section.id;
                    const linkBaseClasses = 'block py-2 px-4 rounded-lg transition-all duration-200 flex items-center';
                    const activeClasses = 'bg-white/30 text-white font-bold scale-105';
                    const inactiveClasses = 'hover:bg-blue-500/70';
                    const langClasses = isAr ? 'justify-end flex-row-reverse' : '';
                    
                    return (
                        <a 
                            key={section.id} 
                            href={`#${section.id}`}
                            className={`${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses} ${langClasses}`}
                        >
                            <i className={`${section.icon} ${isAr ? 'ml-3' : 'mr-3'}`}></i>
                            <span>{isAr ? section.ar_title : section.en_title}</span>
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
};
