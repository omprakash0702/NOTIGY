import { GoogleGenAI, Type } from "@google/genai";
import { NotificationItem, AIReport } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

export const analyzeNotifications = async (
  notifications: NotificationItem[],
  userQuery: string
): Promise<AIReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert notifications to a minified string format to save tokens but keep context
  // We reverse the array to show most recent first in the prompt context
  const dataContext = [...notifications].reverse().map(n => 
    `[${n.source}] ${n.sender}: "${n.message}" (${n.timestamp.toLocaleTimeString()})`
  ).join('\n');

  const prompt = `
    You are the SilentPulse AI, a highly capable personal notification auditor. 
    The user has been in "Focus Mode" (display off) and is now asking for a status report.
    
    USER QUERY: "${userQuery}"
    
    CONTEXT:
    The user's device has been silent. The following notifications were captured in the background (most recent first):
    ---
    ${dataContext}
    ---
    
    YOUR MANDATE:
    1. **Thoroughness is paramount.** The user asked for a "thorough check". Do not provide generic summaries unless asked for a general overview. Dig deep into the logs.
    2. **Evidence-based:** You MUST cite specific timestamps and sender names for every claim you make in the answer.
    3. **Direct Answer:** Address the user's specific question with extreme precision.
    4. **Urgency Detection:** Even if the user asks a specific question, you must briefly mention if there are any CRITICAL/EMERGENCY items they missed (e.g., fraud alerts, server crashes, family emergencies).
    5. **Categorization:** Provide accurate counts for the category breakdown.
    
    Output Format: JSON conforming to the specified schema.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A 2-3 sentence high-level executive summary."
          },
          answerToQuery: {
            type: Type.STRING,
            description: "A thorough, detailed answer to the user's specific question, explicitly citing specific evidence (timestamps/senders) from the logs."
          },
          urgentItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                detail: { type: Type.STRING },
                actionRequired: { type: Type.STRING }
              }
            }
          },
          categoryBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                count: { type: Type.NUMBER }
              }
            }
          },
          sentiment: {
            type: Type.STRING,
            enum: ["Positive", "Neutral", "Negative", "Urgent"]
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(response.text) as AIReport;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to parse AI report");
  }
};