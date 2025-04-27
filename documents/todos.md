- bug : sau khi login xong lần đầu thì ko get dc user lên

------------------------- LOGIC THAY ĐỔI THÔNG TIN CỦA TUYẾN XE (ROUTE) -------------------------
🚩 Logic tổng quát chính xác của API này là:
Giả sử bạn đang có một Route tên R001, và có sẵn các checkpoint theo thứ tự:

A → B → C → D
Khi bạn gọi API này, bạn gửi lên danh sách orderedCheckpointIds đại diện cho thứ tự checkpoint bạn muốn Route sẽ có.

✅ API sẽ xử lý các tình huống như sau:
1. THỨ TỰ KHÔNG ĐỔI
- Truyền vào: orderedCheckpointIds = [A, B, C, D]
- Kết quả: Không thay đổi gì, thứ tự vẫn là:
	A → B → C → D

2. THAY ĐỔI THỨ TỰ checkpoint
- Truyền vào: orderedCheckpointIds = [B, A, D, C]
- Kết quả: Thay đổi lại thứ tự của checkpoint đúng như bạn gửi lên:
	B → A → D → C

3. XÓA checkpoint khỏi route (nếu không có học sinh đăng ký)
- Route ban đầu: A → B → C → D
- Truyền vào: orderedCheckpointIds = [A, C, D] (bỏ checkpoint B ra khỏi danh sách)

- API sẽ kiểm tra:
	+ Nếu checkpoint B không có học sinh nào đăng ký:
	⇒ API sẽ xóa checkpoint B khỏi route, và thứ tự mới là:
	A → C → D
	+ Nếu checkpoint B đang có học sinh đăng ký:
	⇒ API sẽ trả lỗi, không cho phép xóa, route không thay đổi.

4. THÊM checkpoint mới vào route
- Route ban đầu: A → B → C → D
- Truyền vào: orderedCheckpointIds = [A, E, B, C, D] (thêm checkpoint E)

- API kiểm tra:
	+ Nếu checkpoint E chưa thuộc bất kỳ route nào: ⇒ Thêm E vào route, thứ tự checkpoint mới:
	A → E → B → C → D
	+ Nếu checkpoint E đã thuộc route khác: ⇒ API sẽ trả lỗi, không cho phép thêm checkpoint thuộc route khác.

5. XÓA checkpoint và THÊM checkpoint đồng thời
- Route ban đầu: A → B → C → D
- Truyền vào: orderedCheckpointIds = [A, E, C, D]
	(Xóa checkpoint B, Thêm checkpoint E)

- API thực hiện đồng thời:
	+ Xóa checkpoint B (nếu không có học sinh nào đăng ký tại B)
	+ Thêm checkpoint E vào route (nếu E chưa thuộc route khác) ⇒ Kết quả cuối cùng nếu hợp lệ:
		A → E → C → D
6. CẬP NHẬT thông tin mô tả (description) của route
- Ban đầu:
description = "Tuyến số 001 cũ"
- Truyền vào:
{
    "routeId": "uuid",
    "description": "Tuyến mới cập nhật tháng 5",
    "orderedCheckpointIds": ["A", "B", "C", "D"]
}
- Kết quả:
description = "Tuyến mới cập nhật tháng 5"


📌 Tổng hợp các trường hợp xử lý trong API:

Trường hợp	  									|	Hành động xử lý

Thứ tự checkpoint không đổi						|	Không thay đổi gì
Thay đổi thứ tự checkpoint						|	Cập nhật theo thứ tự mới
Xóa checkpoint khỏi route						|	Xóa nếu checkpoint không có học sinh
Thêm checkpoint vào route						|	Thêm nếu checkpoint chưa thuộc route nào
Xóa checkpoint và thêm checkpoint đồng thời		|	Xử lý đồng thời các điều kiện trên
Cập nhật description của route					|	Cập nhật nếu description gửi lên khác giá trị hiện tại

📗 Ví dụ response khi thành công:
{
    "status": 200,
    "message": "Cập nhật thông tin và checkpoint route thành công",
    "data": {
        "id": "route-uuid",
        "code": "R001",
        "description": "Tuyến mới cập nhật tháng 5",
        "checkpoints": [
            {"id": "A", "name": "..."},
            {"id": "E", "name": "..."},
            {"id": "C", "name": "..."},
            {"id": "D", "name": "..."}
        ]
    }
}
📌 Ví dụ response lỗi (checkpoint có học sinh):
{
    "status": 400,
    "message": "Không thể xóa checkpoint [B] vì đang có học sinh đăng ký."
}
