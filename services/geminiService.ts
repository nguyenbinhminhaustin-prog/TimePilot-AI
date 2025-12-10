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
  const prompt = `
    Là một trợ lý học tập AI, hãy phân tích dữ liệu học sinh sau và tạo lịch trình tối ưu cho tuần tới.
    
    THỜI GIAN HIỆN TẠI (QUAN TRỌNG): ${data.currentDate || new Date().toISOString()}
    
    Dữ liệu học sinh (deadline bao gồm cả giờ):
    ${JSON.stringify(data)}
    
    Yêu cầu quan trọng:
    1. Bắt đầu lịch trình từ ngày hiện tại hoặc ngày mai.
    2. Đảm bảo ngày tháng KHỚP chính xác với lịch dương lịch thực tế.
    3. Ưu tiên các deadline gần nhất. 
    4. **QUAN TRỌNG**: Không bao giờ xếp lịch nộp bài hoặc ôn tập quá sát giờ deadline (ngay phút chót). Phải có khoảng đệm an toàn (buffer time) ít nhất 2-4 tiếng hoặc xong trước 1 ngày nếu có thể.
    5. **Định dạng hiển thị**: Đối với sự kiện đến hạn chót (task type = DEADLINE), phần 'activity' bắt buộc phải ghi là "Nộp bài/Thi: [Tên môn]".
    6. Cân bằng giữa học và nghỉ ngơi (Task BREAK).
    7. Trả về kết quả JSON theo schema đã định nghĩa.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.7
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as AIAnalysisResult;
};

export const adjustSchedule = async (
  data: StudentProfile, 
  currentResult: AIAnalysisResult, 
  feedback: string
): Promise<AIAnalysisResult> => {
  const prompt = `
    Dựa trên lịch trình hiện tại và phản hồi của học sinh, hãy điều chỉnh lại kế hoạch.

    THỜI GIAN HIỆN TẠI: ${data.currentDate || new Date().toISOString()}

    Dữ liệu học sinh:
    ${JSON.stringify(data)}

    Lịch trình hiện tại:
    ${JSON.stringify(currentResult)}

    Phản hồi của học sinh (Yêu cầu điều chỉnh):
    "${feedback}"

    Yêu cầu:
    1. Giữ nguyên cấu trúc JSON.
    2. Giữ nguyên tính chính xác của ngày tháng thực tế.
    3. Thay đổi lịch trình để đáp ứng phản hồi (giảm tải, đổi giờ...).
    4. Vẫn tuân thủ quy tắc: Không xếp lịch sát deadline và dùng format "Nộp bài/Thi: [Tên môn]" cho hạn chót.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.7
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as AIAnalysisResult;
};