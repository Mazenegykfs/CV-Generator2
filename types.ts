
export type Language = 'en' | 'ar';

export interface CvSection {
    ar_title: string;
    ar_items: string[];
    en_title: string;
    en_items: string[];
    icon: string;
    id: string;
}

export type CvData = CvSection[];

export interface ParsedSection {
    title: string;
    items: string[];
}
