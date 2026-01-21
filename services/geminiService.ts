
import { GoogleGenAI, Type } from "@google/genai";

export const optimizeProjectBrief = async (description: string, designTypes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    أنت خبير في إدارة مشاريع التصميم الإبداعي.
    قام العميل بتقديم الوصف التالي لمشروعه: "${description}".
    نوع التصميم المطلوب: ${designTypes.join(', ')}.
    
    المهمة:
    1. قم بتحسين صياغة الوصف ليكون احترافياً ومفهوماً للمصممين.
    2. اقترح 3 ألوان متناسقة مع طبيعة المشروع مع ذكر رموز الـ HEX.
    3. اقترح شخصية للعلامة التجارية (مثل: عصري، فاخر، بسيط).
    4. أضف نصيحة واحدة جوهرية للمشروع.

    يجب أن تكون الإجابة باللغة العربية حصراً وبتنسيق JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedDescription: { type: Type.STRING },
            suggestedColors: { type: Type.STRING },
            brandPersonality: { type: Type.STRING },
            proTip: { type: Type.STRING },
          },
          required: ["improvedDescription", "suggestedColors", "brandPersonality", "proTip"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
