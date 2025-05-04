Dựa trên ba hình ảnh bạn cung cấp về các định nghĩa báo cáo, dưới đây là mô tả chi tiết cho từng loại báo cáo tương ứng với ba tab download:

---

### **1. Báo cáo tổng kết năm học (`summary`)**

**Mục tiêu:**
Tổng hợp toàn bộ thông tin vận hành hệ thống đưa đón học sinh bằng xe buýt trong suốt năm học.

**Nội dung báo cáo gồm:**

* **Thông tin tổng quát:**

  * Năm học (vd: 2024–2025)
  * Ngày bắt đầu và kết thúc
  * Tổng số ngày xe hoạt động thực tế

* **Số lượng học sinh tham gia:**

  * Thống kê theo từng khối/lớp
  * Tổng số học sinh đăng ký sử dụng xe buýt
  * Số học sinh nghỉ/ngừng tham gia giữa chừng
  * Ghi chú lý do nghỉ (vd: nghỉ học, chuyển trường…)

* **Số lượng xe buýt hoạt động:**

  * Danh sách biển số xe, tài xế, phụ xe
  * Tổng số chuyến thực hiện trong năm học

* **Tổng số tuyến đã vận hành:**

  * Danh sách tuyến xe
  * Các điểm đón phục vụ, số học sinh theo tuyến
  * Tổng số chuyến theo tuyến

---

### **2. Báo cáo điểm danh học sinh (`attendance`)**

**Mục tiêu:**
Thống kê chi tiết việc điểm danh của từng học sinh sử dụng xe buýt trong năm học.

**Nội dung báo cáo gồm:**

* **Tổng số lượt đi và về trong năm cho mỗi học sinh:**

  * Họ tên, lớp học
  * Số lượt **lên xe (đi)** và **xuống xe (về)**
  * Tổng số lượt (đi + về)
  * Ghi chú nếu có (vd: học điều)

* **Giải thích định nghĩa:**

  * “Lượt đi” là điểm danh lúc lên xe buổi sáng
  * “Lượt về” là điểm danh lúc xuống xe cuối ngày
  * “Attended = 1” nghĩa là điểm danh thành công

---

### **3. Báo cáo hoạt động của xe bus (`activity`)**

**Mục tiêu:**
Tổng hợp hoạt động của tài xế và phụ xe, đặc biệt là hỗ trợ điểm danh thủ công.

**Nội dung báo cáo gồm:**

* **Số học sinh được ghi nhận điểm danh thủ công:**

  * Tài xế và phụ xe cụ thể
  * Số học sinh được điểm danh thủ công (thường do lỗi nhận diện)
  * Ghi chú lý do: camera lỗi, FaceID lỗi hoặc không nhận diện kịp thời

---

Dưới đây là mô tả sơ bộ UI **của từng loại báo cáo** sử dụng cú pháp **Markdown**, kết hợp **bảng**, **danh sách**, và **heading** để bạn có thể dễ dàng hình dung hoặc dùng trong tài liệu nội bộ hoặc thiết kế Figma/Notion.

---

## 📘 Báo cáo 1: Báo cáo tổng kết năm học (`summary`)


# Báo cáo tổng kết năm học - [Tên Trường]

## 1. Thông tin tổng quát
- 🗓️ Năm học: 2024–2025
- 📅 Ngày bắt đầu: 05/09/2024
- 📅 Ngày kết thúc: 25/05/2025
- 🚌 Tổng số ngày xe hoạt động: [số ngày thực tế]

---

## 2. Số lượng học sinh tham gia

| STT | Khối/Lớp | Tổng học sinh đăng ký | Số học sinh nghỉ giữa chừng | Ghi chú         |
|-----|----------|------------------------|------------------------------|------------------|
| 1   | Lớp 1    | 40                     | 1                            | -                |
| 2   | Lớp 2    | 38                     | 0                            | -                |
| ... | ...      | ...                    | ...                          | ...              |
|     | **Tổng** | **191**                | **2**                        |                  |

- Tổng số học sinh đăng ký sử dụng xe buýt: **191**
- Số học sinh nghỉ: nghỉ học, chuyển trường, ngừng đi xe buýt…

---

## 3. Số lượng xe buýt hoạt động

| STT | Biển số xe | Tài xế | Phụ xe | Tổng số chuyến | Ghi chú     |
|-----|------------|--------|--------|----------------|-------------|
| 1   | 29A-12345  | Nguyễn A | Trần B | 320 chuyến     | Xe 45 chỗ   |
| 2   | 29B-67890  | Lê C     | Phạm D | 310 chuyến     | Xe 29 chỗ   |
|     | ...        | ...      | ...    | ...            | ...         |
|     |            |         |        | **630 chuyến** |             |

---

## 4. Tổng số tuyến xe đã vận hành

| STT | Tuyến | Các điểm đón | Số học sinh phục vụ | Tổng chuyến | Ghi chú |
|-----|-------|---------------|----------------------|-------------|---------|
| 1   | Tuyến 1 | Mỹ Đình 1, 2… | 30                   | 300 chuyến |         |
| 2   | Tuyến 2 | Trường Yên…  | 28                   | 310 chuyến |         |




## 📗 Báo cáo 2: Báo cáo điểm danh học sinh (`attendance`)


# Báo cáo điểm danh học sinh

## 1. Tổng số lượt đi/về trong năm cho từng học sinh

| STT | Họ tên học sinh | Lớp | Lượt đi | Lượt về | Tổng lượt đi+về | Ghi chú   |
|-----|------------------|------|----------|----------|------------------|-----------|
| 1   | Nguyễn Văn A     | 1A   | 180      | 180      | 360              | Đi học đều |
| 2   | Trần Thị Bích    | 2B   | 175      | 174      | 349              |           |
| ... | ...              | ...  | ...      | ...      | ...              |           |

**🟢 Ghi chú:**
- Lượt đi: điểm danh khi học sinh lên xe buổi sáng
- Lượt về: điểm danh khi học sinh xuống xe chiều
- attended = 1 là thành công


---

## 📕 Báo cáo 3: Báo cáo hoạt động của xe buýt (`activity`)

# Báo cáo hoạt động của tài xế và phụ xe

## 1. Số học sinh được hỗ trợ điểm danh thủ công

| STT | Tài xế       | Phụ xe        | Số học sinh thủ công | Ghi chú                     |
|-----|--------------|---------------|------------------------|-----------------------------|
| 1   | Nguyễn Văn A | Trần Thị B    | 6 học sinh             | Camera lỗi nhận diện       |
| 2   | Lê Văn C      | Phạm Thị D    | 10 học sinh            | FaceID lỗi hoặc nhận chậm  |
| ... | ...          | ...           | ...                    | ...                         |


---

💡 **Gợi ý thêm cho UI thực tế (Figma/React):**

* **Header mỗi báo cáo**: Dùng `<Card>` hoặc `<Section>` với tiêu đề + mô tả.
* **Tables**: Responsive, có scroll ngang trên mobile.
* **Tổng kết (tổng cộng)**: Hiển thị rõ ràng với font bold hoặc nền khác biệt.
* **Mỗi tab download**: Có thể preview nội dung dạng collapsible trước khi tải.

