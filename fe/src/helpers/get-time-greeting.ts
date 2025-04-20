export function getTimeGreeting(): string {
    const now = new Date();
    const hour = now.getHours();
  
    if (hour >= 5 && hour < 11) {
      return "Chào buổi sáng ☀️";
    } else if (hour >= 11 && hour < 13) {
      return "Nhớ nghỉ trưa nhé 🍱";
    } else if (hour >= 13 && hour < 18) {
      return "Chào buổi chiều 🌇";
    } else {
      return "Buổi tối vui vẻ 🌙";
    }
  }
  