# api/hello.py
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs

def handler(request):
    """
    Hàm xử lý cho Vercel Function (Python).
    """
    
    # 1. Trích xuất tham số từ URL
    # Vercel Function trong Python nhận đối tượng request chuẩn.
    try:
        # Lấy query parameters từ URL
        query_string = urlparse(request.url).query
        query_params = parse_qs(query_string)
        
        # Lấy giá trị 'name', mặc định là 'Khách'
        name = query_params.get('name', ['Khách'])[0]
    except:
        name = 'Khách' # Xử lý lỗi nếu không lấy được
        
    # 2. Tạo nội dung phản hồi
    response_data = {
        "message": f"Chào mừng, {name}! Đây là phản hồi từ Vercel Function bằng Python.",
        "timestamp": datetime.now().isoformat()
    }

    # 3. Trả về phản hồi JSON
    # Vercel sẽ tự động biến đối tượng Python này thành phản hồi HTTP
    # với Header Content-Type: application/json và Status Code 200.
    return response_data