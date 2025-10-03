// api/hello.js

/**
 * Hàm xử lý yêu cầu HTTP.
 * Vercel tự động biến tệp này thành một API endpoint.
 */
module.exports = (req, res) => {
  // 1. Nhận tham số từ Query String (ví dụ: ?name=TenBan)
  const { name = 'Khách' } = req.query;

  // 2. Thiết lập tiêu đề (Header) và trạng thái
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // 3. Trả về dữ liệu JSON
  res.json({
    message: `Chào mừng, ${name}! Đây là phản hồi từ Vercel Function.`,
    timestamp: new Date().toISOString()
  });
};

// Sau khi triển khai lên Vercel, API này sẽ có URL dạng:
// https://[your-project-name].vercel.app/api/hello?name=TenBan