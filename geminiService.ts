
import { GoogleGenAI, Type } from "@google/genai";
import { JobStatus, JobApplication } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseJobText(text: string): Promise<Partial<JobApplication>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract job application details from the following text (it could be a job description, an email, or notes): \n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          employmentType: { 
            type: Type.STRING,
            description: "Must be 'FTE', 'Contract', or 'Hourly W2'"
          },
          agencyName: { type: Type.STRING, description: "Name of the recruiting agency if mentioned" },
          salaryMin: { type: Type.NUMBER },
          salaryMax: { type: Type.NUMBER },
          hourlyRate: { type: Type.NUMBER, description: "Hourly rate if mentioned (usually for Contract/W2)" },
          contractDuration: { type: Type.STRING, description: "Length of contract if mentioned" },
          location: { type: Type.STRING },
          workSetting: { 
            type: Type.STRING,
            description: "Must be 'Remote', 'Hybrid', or 'On-site'"
          },
          commuteDays: { type: Type.NUMBER, description: "Number of days in office if Hybrid/On-site" },
          requirements: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          benefits: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          description: { type: Type.STRING },
          status: { 
            type: Type.STRING,
            description: "Choose best fit: 'WIP', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'"
          }
        },
        required: ["company", "role"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      dateApplied: new Date().toISOString().split('T')[0],
      interviews: [],
      contacts: [],
      notes: ""
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to extract details automatically. Please check the text format.");
  }
}
