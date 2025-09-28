
import { GoogleGenAI, Type } from "@google/genai";
import type { CvData, ParsedSection } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function translateCvData(arabicData: ParsedSection[]): Promise<CvData> {
    const model = 'gemini-2.5-flash';

    const prompt = `Translate the following Arabic CV data into professional English. For each section, provide an appropriate Font Awesome icon class. The output must be a valid JSON array. Each object in the array should represent a section and have these properties: "ar_title" (the original Arabic title), "en_title" (the English translation of the title), "en_items" (an array of English translations of the items), and "icon" (a relevant Font Awesome icon class like "fas fa-user-circle").

    CV Data:
    ${JSON.stringify(arabicData, null, 2)}
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                ar_title: {
                    type: Type.STRING,
                    description: "Original Arabic section title.",
                },
                en_title: {
                    type: Type.STRING,
                    description: "English translation of the section title.",
                },
                en_items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of English translations of the section items.",
                },
                icon: {
                    type: Type.STRING,
                    description: "A single Font Awesome class, e.g., 'fas fa-briefcase'.",
                },
            },
            required: ["ar_title", "en_title", "en_items", "icon"],
        },
    };

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonString = result.text;
        const translatedSections: Omit<CvData[0], 'id' | 'ar_items'>[] = JSON.parse(jsonString);

        // Re-integrate original Arabic items and add a unique ID for navigation
        const finalData = translatedSections.map(translatedSection => {
            const originalSection = arabicData.find(s => s.title === translatedSection.ar_title);
            return {
                ...translatedSection,
                ar_items: originalSection ? originalSection.items : [],
                id: translatedSection.en_title.toLowerCase().replace(/\s+/g, '-'),
            };
        });

        return finalData;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to translate CV data. Check the console for details.");
    }
}
