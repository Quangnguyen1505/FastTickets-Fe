export const getAvailableDates = async () => {
    const currentDate = new Date();
    const availableDates = [];
  
    // Lấy 20 ngày kể từ ngày hiện tại
    for (let i = 0; i < 6; i++) {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + i); // Tính ngày i
      availableDates.push({ open_date: newDate.toISOString().split("T")[0] });
    }
  
    // Giả lập trả về một Promise
    return new Promise((resolve) => {
      resolve({ data: availableDates });
    });
  };
  