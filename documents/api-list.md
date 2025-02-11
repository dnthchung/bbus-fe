# API Documentation

## 1. Thông tin chung

### Cổng kết nối
- **Frontend**: `5173`
- **Backend**: `4004`

### Xác thực và Bảo mật
- Sử dụng cookie `httpOnly` cho `accessToken` và `refreshToken`
- Các API cần xác thực sẽ kiểm tra token qua:
  - Cookie: `accessToken`
  - Hoặc Header: `Authorization`

### Format Response Lỗi
```json
{
  "error": "Tên lỗi",
  "message": "Chi tiết lỗi"
}
```

## 2. Danh sách API

### 2.1 Quản lý Xác thực (Authentication)

#### Đăng ký tài khoản
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
  ```

#### Đăng nhập
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Đăng xuất
- **Endpoint**: `POST /auth/logout`
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

#### Làm mới token
- **Endpoint**: `POST /auth/refresh`
- **Response**:
  ```json
  {
    "message": "Access token refreshed"
  }
  ```

#### Xác thực email
- **Endpoint**: `GET /auth/verify-email/{code}`
- **Response**:
  ```json
  {
    "message": "Email was successfully verified"
  }
  ```

#### Yêu cầu đặt lại mật khẩu
- **Endpoint**: `POST /auth/send-password-reset`
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset email sent"
  }
  ```

#### Đặt lại mật khẩu
- **Endpoint**: `POST /auth/reset-password`
- **Body**:
  ```json
  {
    "token": "reset-token",
    "password": "newpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password was reset successfully"
  }
  ```

### 2.2 Quản lý Người dùng (User)

#### Lấy thông tin người dùng
- **Endpoint**: `GET /user`
- **Yêu cầu**: Cần xác thực
- **Cơ chế hoạt động**:
  1. **Xác thực**:
     - Client gửi request kèm JWT token (qua cookie hoặc header)
     - Server kiểm tra token và trích xuất userId

  2. **Xử lý**:
     - Tìm kiếm user theo userId trong database
     - Lọc bỏ thông tin nhạy cảm (password)
     - Trả về thông tin user

- **Response thành công**:
  ```json
  {
    "_id": "user_id",
    "email": "user@example.com",
    "verified": true,
    "role": "user",
    "createdAt": "2024-02-11T00:00:00.000Z",
    "updatedAt": "2024-02-11T00:00:00.000Z"
  }
  ```

- **Xử lý lỗi**:
  - `401`: Token không hợp lệ hoặc hết hạn
  - `404`: Không tìm thấy người dùng
