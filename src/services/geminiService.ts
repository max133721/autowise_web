
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResponse, TuningResponse, VehicleType, EngineType, Language } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Ensure process.env.API_KEY is available.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to remove the data URL prefix for Gemini
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
};

const getLanguageName = (lang: Language): string => {
    switch (lang) {
        case 'pl': return 'POLISH';
        case 'en': return 'ENGLISH';
        case 'de': return 'GERMAN';
        default: return 'POLISH';
    }
};

export const analyzeVehicleProblem = async (
  vehicleType: VehicleType,
  engineType: EngineType,
  description: string,
  language: Language,
  imageBase64?: string
): Promise<DiagnosisResponse> => {
  
  const langName = getLanguageName(language);

  const systemInstruction = `
    You are a WORLD-CLASS AUTOMOTIVE ENGINEER AND MECHANIC.
    Your goal is strictly to assist with vehicle mechanics.
    
    CRITICAL RULE - TOPIC FILTER:
    Before diagnosing, analyze if the question relates to automotive, vehicles, engines, or mechanics.
    
    IF THE USER ASKS ABOUT A NON-AUTOMOTIVE TOPIC (e.g., weather, cooking, politics, code):
    1. IGNORE everything else.
    2. In the "summary" field, write specifically (translated to ${langName}): "The question is not related to automotive topics, please ask again."
    3. Return empty/neutral values for other fields.
    
    IF THE TOPIC IS AUTOMOTIVE:
    1. Be extremely technical but understandable. Use professional terminology.
    2. Analyze the problem based on the engine: ${engineType}.
    3. If an image is provided: identify the part and include it in the diagnosis.
    
    IMPORTANT: OUTPUT ALL TEXT CONTENT IN ${langName} LANGUAGE.
  `;

  const userPrompt = `
    Vehicle: ${vehicleType}
    Engine: ${engineType}
    Problem Description: "${description || "Identify the part from the photo and analyze the problem."}"
    
    Perform a detailed technical diagnosis.
  `;

  const parts: any[] = [{ text: userPrompt }];

  if (imageBase64) {
    parts.unshift({
      inlineData: {
        mimeType: "image/jpeg", 
        data: stripBase64Prefix(imageBase64)
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partIdentification: {
              type: Type.STRING,
              description: `If a photo was sent, name the part in ${langName}. If not, leave empty.`,
            },
            summary: {
              type: Type.STRING,
              description: `Technical summary of the problem or refusal for off-topic in ${langName}.`,
            },
            severity: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High", "Critical", "Niski", "Średni", "Wysoki", "Krytyczny", "Niedrig", "Mittel", "Hoch", "Kritisch"], 
              description: `Severity level translated to ${langName}.`,
            },
            safetyWarning: {
              type: Type.STRING,
              description: `Safety warning in ${langName}.`,
            },
            potentialCauses: {
              type: Type.ARRAY,
              description: "List of technical causes.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: `Component name in ${langName}.` },
                  description: { type: Type.STRING, description: `Technical description in ${langName}.` },
                  solution: { type: Type.STRING, description: `Repair procedure in ${langName}.` },
                  likelihood: { type: Type.NUMBER, description: "Probability (0-100)." },
                  estimatedCost: { type: Type.STRING, description: `Estimated cost in local currency context (PLN/EUR/USD) appropriate for language ${langName}.` },
                  difficulty: { 
                    type: Type.STRING, 
                    description: `Repair difficulty translated to ${langName} (e.g., Easy/Łatwy/Einfach).` 
                  },
                },
                required: ["name", "description", "solution", "likelihood", "estimatedCost", "difficulty"],
              },
            },
            maintenanceTip: {
              type: Type.STRING,
              description: `Technical/maintenance tip in ${langName}.`,
            },
          },
          required: ["summary", "severity", "safetyWarning", "potentialCauses", "maintenanceTip"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return { ...data, type: 'diagnosis' } as DiagnosisResponse;
    } else {
      throw new Error("No text response from model.");
    }
  } catch (error) {
    console.error("Diagnosis error:", error);
    throw new Error("Failed to perform diagnosis.");
  }
};

export const analyzeVehicleModifications = async (
  vehicleType: VehicleType,
  engineType: EngineType,
  description: string,
  language: Language,
  imageBase64?: string
): Promise<TuningResponse> => {
  
  const langName = getLanguageName(language);

  const systemInstruction = `
    You are a MOTORSPORT ENGINEER AND TUNER. Specializing in modifying combustion and electric engines.
    
    CRITICAL RULE - TOPIC FILTER:
    IF THE USER ASKS ABOUT NON-AUTOMOTIVE TOPICS:
    1. In "summary", write specifically (translated to ${langName}): "The question is not related to automotive topics, please ask again."
    2. Return empty list for partsRecommendation.
    
    IF AUTOMOTIVE:
    1. Focus on mechanical and electronic modifications (tuning).
    2. Consider engine type: ${engineType}.
    
    IMPORTANT: OUTPUT ALL TEXT CONTENT IN ${langName} LANGUAGE.
  `;

  const userPrompt = `
    Vehicle: ${vehicleType}
    Engine: ${engineType}
    Goal/Description: "${description || "I want to modify this engine/vehicle."}"
    
    Propose a professional tuning plan.
  `;

  const parts: any[] = [{ text: userPrompt }];

  if (imageBase64) {
    parts.unshift({
      inlineData: {
        mimeType: "image/jpeg",
        data: stripBase64Prefix(imageBase64)
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partIdentification: {
              type: Type.STRING,
              description: `Identify part/engine from photo in ${langName}.`,
            },
            summary: {
              type: Type.STRING,
              description: `Professional tuning plan summary in ${langName}.`,
            },
            expectedPowerIncrease: {
              type: Type.STRING,
              description: `Estimated power/torque gain in ${langName}.`,
            },
            drivingCharacteristics: {
              type: Type.STRING,
              description: `Changes in handling/response in ${langName}.`,
            },
            estimatedTotalCost: {
              type: Type.STRING,
              description: `Estimated cost (PLN/EUR/USD) in ${langName}.`,
            },
            reliabilityImpact: {
              type: Type.STRING,
              description: `Impact on engine life in ${langName}.`,
            },
            partsRecommendation: {
              type: Type.ARRAY,
              description: "List of parts.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Part brand/model." },
                  type: { type: Type.STRING, description: `Component type in ${langName}.` },
                  description: { type: Type.STRING, description: `Technical justification in ${langName}.` },
                  estimatedPrice: { type: Type.STRING, description: "Price." },
                  powerGain: { type: Type.STRING, description: `Gain from this part in ${langName}.` },
                },
                required: ["name", "type", "description", "estimatedPrice", "powerGain"],
              },
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Pros in ${langName}.`,
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Cons/Risks in ${langName}.`,
            }
          },
          required: ["summary", "expectedPowerIncrease", "drivingCharacteristics", "estimatedTotalCost", "reliabilityImpact", "partsRecommendation", "pros", "cons"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return { ...data, type: 'tuning' } as TuningResponse;
    } else {
      throw new Error("No text response from model.");
    }
  } catch (error) {
    console.error("Tuning analysis error:", error);
    throw new Error("Failed to prepare tuning plan.");
  }
};
