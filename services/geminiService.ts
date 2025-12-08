import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudentProfile, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dailyPlans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Tên ngày (ví dụ: Thứ 2)" },
          date: { type: Type.STRING, description: "Ngày định dạng YYYY-MM-DD" },
          stressScore: { type: Type.NUMBER, description: "Điểm áp lực từ 0-100" },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "HH:mm" },
                activity: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["STUDY", "BREAK", "DEADLINE", "CLASS"] },
                durationMinutes: { type: Type.NUMBER }
              },
              required: ["time", "activity", "type", "durationMinutes"]
            }
          }
        },
        required: ["day", "date", "stressScore", "tasks"]
      }
    },
    overallAnalysis: { type: Type.STRING },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    highPressureDays: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["dailyPlans", "overallAnalysis", "recommendations", "highPressureDays"]
};

export const analyzeSchedule = async (data: StudentProfile): Promise<AIAnalysisResult> => {
  const today = new Date().toISOString().split('T')[0];
  
  const prompt = `
    Bạn là TimePilot AI, một chuyên gia tối ưu hóa thời gian học tập.
    Hôm nay là: ${today}.
    
    Thông tin học sinh:
    - Mức độ stress hiện tại: ${data.stressLevel}/10
    - Thời gian rảnh mỗi ngày: ${data.freeTimePerDay} giờ
    
    Danh sách môn học và deadline:
    ${JSON.stringify(data.courses)}
    
    Nhiệm vụ của bạn:
    1. Tạo một lịch trình học tập thông minh cho 7 ngày tới.
    2. Cân bằng giữa việc học các môn khó và nghỉ ngơi (BREAK).
    3. Ưu tiên các môn có deadline gần và độ khó cao.
    4. Nếu một ngày có quá nhiều việc (stressScore > 80), hãy tự động điều chỉnh bằng cách chia nhỏ công việc sang ngày khác hoặc chèn thêm giờ nghỉ.
    5. Tính toán điểm áp lực (stressScore) cho mỗi ngày dựa trên khối lượng bài tập.
    
    Hãy trả về định dạng JSON chính xác theo schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
