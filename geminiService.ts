
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "./types";

const parseGeminiError = (error: any): string => {
  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes("Requested entity was not found")) {
    return "Requested entity was not found.";
  }
  if (message.includes("Region not supported")) {
    return "Модель генерации изображений недоступна в вашем регионе. Попробуйте использовать VPN или переключиться на Pro модель.";
  }
  if (message.includes("PERMISSION_DENIED")) {
    return "Доступ запрещен. Проверьте ваш API-ключ и настройки биллинга.";
  }
  return message || "Произошла ошибка при обращении к ИИ";
};

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio = "16:9",
  useProModel: boolean = false
): Promise<string> => {
  // Fix: Create instance right before call and use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = useProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: useProModel ? "1K" : undefined
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error('No candidates returned');

    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(parseGeminiError(error));
  }
};

export const generateVideo = async (prompt: string, aspectRatio: "16:9" | "9:16" = "16:9"): Promise<string> => {
  // Fix: Create instance right before call and use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    if (!operation) throw new Error('Failed to start video operation');

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error('Video generation failed to return a URI');

    // Fix: Always append API key when fetching from download link
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error(`Failed to download video: ${response.statusText}`);
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error(parseGeminiError(error));
  }
};

export const editImage = async (base64ImageData: string, prompt: string): Promise<string> => {
  // Fix: Create instance right before call and use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const matches = base64ImageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
  const mimeType = matches ? matches[1] : 'image/png';
  const data = matches ? matches[2] : base64ImageData;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error('No candidates returned');

    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image data found after editing');
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error(parseGeminiError(error));
  }
};
