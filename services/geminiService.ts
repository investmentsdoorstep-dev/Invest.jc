
import { GoogleGenAI, Type } from "@google/genai";
import { Verdict } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface GeminiVibeResponse {
  score: number;
  verdict: Verdict;
  fix_tip: string;
  detailedStats: {
    color_harmony: number;
    symmetry: number;
    fit_accuracy: number;
    texture_quality: number;
    composition: number;
  };
  insights: {
    lighting: number;
    style: number;
    cleanliness: number;
    grooming: number;
    confidence: number;
    alignment: number;
  };
}

const getCleanBase64 = (base64: string) => {
  return base64.includes(',') ? base64.split(',')[1] : base64;
};

export const analyzeVibe = async (
  imageBase64: string,
  situation: string
): Promise<GeminiVibeResponse> => {
  const prompt = `BRUTAL HONESTY MODE: Analyze this specific image for the context: "${situation}". 
  Do not use generic praise. Look at the specific fit of the clothes, the exact lighting shadows, the cleanliness of the room, and the harmony of the colors present in THIS image.
  
  Return strictly JSON with:
  1. score (0-100)
  2. verdict (YES/RISKY/NO)
  3. fix_tip (one punchy, actionable advice)
  4. detailedStats: color_harmony, symmetry, fit_accuracy, texture_quality, composition (all 0-100)
  5. insights: lighting, style, cleanliness, grooming, confidence, alignment (all 0-100)
  
  If the image is blurry or dark, penalize the lighting and composition score significantly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: getCleanBase64(imageBase64)
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING, enum: ['YES', 'RISKY', 'NO'] },
            fix_tip: { type: Type.STRING },
            detailedStats: {
              type: Type.OBJECT,
              properties: {
                color_harmony: { type: Type.NUMBER },
                symmetry: { type: Type.NUMBER },
                fit_accuracy: { type: Type.NUMBER },
                texture_quality: { type: Type.NUMBER },
                composition: { type: Type.NUMBER }
              },
              required: ['color_harmony', 'symmetry', 'fit_accuracy', 'texture_quality', 'composition']
            },
            insights: {
              type: Type.OBJECT,
              properties: {
                lighting: { type: Type.NUMBER },
                style: { type: Type.NUMBER },
                cleanliness: { type: Type.NUMBER },
                grooming: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER },
                alignment: { type: Type.NUMBER }
              },
              required: ['lighting', 'style', 'cleanliness', 'grooming', 'confidence', 'alignment']
            }
          },
          required: ['score', 'verdict', 'fix_tip', 'detailedStats', 'insights']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Vibe analysis failed:", error);
    throw error;
  }
};

export const generateImprovedLook = async (
  imageBase64: string,
  fixTip: string
): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: getCleanBase64(imageBase64),
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Re-imagine this exact scene and person but implement this aesthetic fix: "${fixTip}". 
            High-end photography, cinematic lighting, 8k resolution, photorealistic.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.warn("Vision generation failed:", error);
  }
  return undefined;
};
