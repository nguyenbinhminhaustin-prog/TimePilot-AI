export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Rất dễ",
  2: "Dễ",
  3: "Trung bình",
  4: "Khó",
  5: "Rất khó"
};

export const MOCK_INITIAL_DATA = {
  name: "Học sinh A",
  stressLevel: 5,
  freeTimePerDay: 4,
  courses: [
    { id: '1', name: "Toán Cao Cấp", difficulty: 5, deadline: "2024-06-20", estimatedHours: 10 },
    { id: '2', name: "Lịch Sử Đảng", difficulty: 3, deadline: "2024-06-18", estimatedHours: 5 },
  ]
};
