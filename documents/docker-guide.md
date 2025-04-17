Rõ luôn! Dưới đây là nội dung chuẩn chỉnh cho một file hướng dẫn riêng:

> 📄 `documents/docker-compose-guide.md`

---

```md
# 🚀 Hướng Dẫn Chạy Dự Án Bằng Docker Compose

Dự án hỗ trợ chạy bằng **Docker Compose** để đơn giản hóa quá trình khởi động.  
Dưới đây là hướng dẫn từng bước để chạy dự án frontend thông qua `docker-compose`.

---

## ✅ Yêu cầu trước khi bắt đầu

- ✅ Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- ✅ Hệ điều hành Windows cần bật WSL 2
- ✅ Đảm bảo Docker đang ở trạng thái **"Docker is running"**

---

## 📁 Cấu trúc thư mục

Docker Compose và Dockerfile nằm trong thư mục `fe/`:
```

dnthchung-bbus-fe/
├── documents/
│ └── docker-compose-guide.md
└── fe/
├── Dockerfile
├── docker-compose.yml
└── ...

````

---

## 🚀 Cách Chạy Bằng Docker Compose

### 🔹 Bước 1: Di chuyển vào thư mục chứa `docker-compose.yml`

```sh
cd fe
````

---

### 🔹 Bước 2: Build image và chạy container

```sh
docker-compose up --build -d
```

- `--build`: Build lại image khi có thay đổi trong code
- `-d`: Chạy ở chế độ nền (background)

---

### 🔹 Bước 3: Truy cập ứng dụng

Sau khi container khởi chạy thành công, mở trình duyệt và truy cập:

👉 [http://localhost:5173](http://localhost:5173)

---

## 🔁 Cập nhật code và build lại

Mỗi khi bạn cập nhật code, chỉ cần chạy lại:

```sh
docker-compose up --build -d
```

Docker Compose sẽ tự động rebuild image và khởi động lại container với code mới.

---

## 🛑 Dừng và xoá container

Khi không cần sử dụng nữa, bạn có thể dừng toàn bộ container bằng lệnh:

```sh
docker-compose down
```

---

## 🧪 Kiểm tra container đang chạy

```sh
docker ps
```

---

## 🧩 Ghi chú

- Nếu `localhost:5173` không truy cập được, đảm bảo rằng port đang được ánh xạ đúng trong `docker-compose.yml`:

```yaml
ports:
  - "5173:5173"
```

- Nếu có lỗi liên quan đến WSL 2 trên Windows, có thể cần chạy:

```sh
wsl --update
```

hoặc cài thủ công từ: https://aka.ms/wsl2kernel

---

## ✅ Tóm tắt command

| Lệnh                           | Chức năng                    |
| ------------------------------ | ---------------------------- |
| `docker-compose up --build -d` | Build và chạy container      |
| `docker-compose down`          | Dừng và xoá container        |
| `docker ps`                    | Kiểm tra container đang chạy |

---

📄 _File này được tạo tự động để hỗ trợ khởi chạy dự án nhanh bằng Docker Compose._
