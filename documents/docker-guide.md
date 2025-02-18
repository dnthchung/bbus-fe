### 🚀 **Hướng Dẫn Chạy Docker Lần Đầu & Cập Nhật Khi Code Thay Đổi**

Dưới đây là các bước **từ lần chạy đầu tiên** đến khi **cập nhật code và build lại**.

---

## ✅ **1️⃣ Lần Đầu Chạy Docker (Initial Setup)**
Nếu đây là **lần đầu tiên** bạn chạy Docker cho project, làm theo các bước sau:

```sh
# 1. Build Docker Image từ Dockerfile
docker build -t fe-app .

# 2. Chạy Container từ image đã build
docker run -d -p 5173:80 --name fe-container fe-app

# 3. Kiểm tra container đang chạy
docker ps
```

📌 **Giải thích**:
- `docker build -t fe-app .` → Build Docker Image từ Dockerfile.
- `docker run -d -p 5173:80 --name fe-container fe-app` → Chạy container từ image, ánh xạ **port 80 trong container** ra **port 5173 trên máy host**.
- `docker ps` → Kiểm tra xem container có đang chạy không.

**Sau đó, mở trình duyệt và truy cập:**
👉 **http://localhost:5173**

---

## ✅ **2️⃣ Khi Code Thay Đổi (Rebuild & Restart)**
Khi bạn cập nhật code và muốn build lại, hãy thực hiện:

```sh
# 1. Dừng container cũ
docker stop fe-container

# 2. Xóa container cũ
docker rm fe-container

# 3. Build lại Docker Image (không sử dụng cache để đảm bảo code mới nhất)
docker build --no-cache -t fe-app .

# 4. Chạy lại container mới
docker run -d -p 5173:80 --name fe-container fe-app

# 5. Kiểm tra container mới có đang chạy không
docker ps
```

📌 **Giải thích**:
- `docker stop fe-container` → Dừng container đang chạy.
- `docker rm fe-container` → Xóa container cũ.
- `docker build --no-cache -t fe-app .` → Build lại image mà không dùng cache.
- `docker run -d -p 5173:80 --name fe-container fe-app` → Chạy container mới với code mới nhất.

---

## ✅ **3️⃣ Dùng `docker-compose` để dễ quản lý (Tuỳ chọn)**
Nếu bạn sử dụng **Docker Compose**, bạn có thể thay thế các lệnh trên bằng:
```sh
docker-compose up --build -d
```

📌 **Giải thích**:
- `--build` → Build lại image khi code thay đổi.
- `-d` → Chạy container ở chế độ nền.

### **Dừng & Xoá toàn bộ container với Docker Compose**
```sh
docker-compose down
```

---

## 🎯 **Tóm tắt command quan trọng**
| Command | Mô tả |
|---------|-------------|
| `docker build -t fe-app .` | Build Docker Image lần đầu |
| `docker run -d -p 5173:80 --name fe-container fe-app` | Chạy container ở port 5173 |
| `docker stop fe-container` | Dừng container |
| `docker rm fe-container` | Xóa container |
| `docker build --no-cache -t fe-app .` | Build lại image khi code thay đổi |
| `docker ps` | Kiểm tra container đang chạy |
| `docker-compose up --build -d` | (Nếu dùng `docker-compose`) Build & chạy container |
| `docker-compose down` | Dừng & xóa container với `docker-compose` |

---

💡 **Sau khi thực hiện xong, bạn có thể mở trình duyệt và truy cập:**
👉 **http://localhost:5173** 🚀
