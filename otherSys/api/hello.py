# api/hello.py
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs

def handler(request):
    """
    Hàm xử lý cho Vercel Function (Python).
    Xử lý yêu cầu HTTP và trả về phản hồi JSON.
    """
    
    name = 'Khách'  # Giá trị mặc định
    
    # 1. Trích xuất tham số từ URL
    try:
        # Lấy query string từ URL trong đối tượng request
        query_string = urlparse(request.url).query
        # Phân tích query string thành dictionary
        query_params = parse_qs(query_string)
        
        # Lấy giá trị 'name', nếu có, và chỉ lấy phần tử đầu tiên
        if 'name' in query_params:
            name = query_params['name'][0]
            
    except Exception as e:
        # Trong trường hợp có lỗi phân tích cú pháp, vẫn sử dụng 'Khách'
        # và ghi lỗi ra log để gỡ lỗi (chỉ hiện trong Vercel Logs)
        print(f"Lỗi phân tích query: {e}") 
        
    # 2. Tạo dữ liệu phản hồi
    response_data = {
        "status": "success",
        "message": f"Chào mừng, {name}! Đây là phản hồi từ Vercel Function bằng Python.",
        "timestamp": datetime.now().isoformat()
    }

    # 3. Trả về Dictionary. Vercel sẽ tự động:
    #    - Đặt Status Code là 200 OK.
    #    - Đặt Header Content-Type là application/json.
    return response_data