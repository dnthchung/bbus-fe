Dưới đây là bản cập nhật API documentation với các nội dung bổ sung mà bạn yêu cầu, bao gồm các mã HTTP, mã lỗi `errorCode`, và chi tiết cho các lỗi có thể xảy ra trong các API.

---

## 1. Thông tin chung

### Cổng kết nối
- **Frontend**: 5173
- **Backend**: 4004

### Xác thực và Bảo mật
- Sử dụng cookie httpOnly cho accessToken và refreshToken
- Các API cần xác thực sẽ kiểm tra token qua:
  - Cookie: accessToken
  - Hoặc Header: Authorization

### Format Response Lỗi
```json
{
  "error": "Tên lỗi",
  "message": "Chi tiết lỗi",
  "errorCode": "Mã lỗi chi tiết"
}
```

---

## 2. Danh sách API

### 2.1 Quản lý Xác thực (Authentication)

#### Đăng ký tài khoản
- **Endpoint**: POST /auth/register
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Validation Error",
      "message": "Email is already taken",
      "errorCode": "USER_EXISTS"
    }
    ```

#### Đăng nhập
- **Endpoint**: POST /auth/login
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid Credentials",
      "message": "Email or password is incorrect",
      "errorCode": "INVALID_CREDENTIALS"
    }
    ```

#### Đăng xuất
- **Endpoint**: POST /auth/logout
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Logout successful"
    }
    ```

#### Làm mới token
- **Endpoint**: POST /auth/refresh
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Access token refreshed"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid or Expired Token",
      "message": "Refresh token is invalid or expired",
      "errorCode": "INVALID_REFRESH_TOKEN"
    }
    ```

#### Xác thực email
- **Endpoint**: GET /auth/verify-email/{code}
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Email was successfully verified"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Verification Error",
      "message": "Verification code not found or expired",
      "errorCode": "VERIFICATION_CODE_INVALID"
    }
    ```

#### Yêu cầu đặt lại mật khẩu
- **Endpoint**: POST /auth/send-password-reset
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Password reset email sent"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Email Not Found",
      "message": "No account found with that email address",
      "errorCode": "USER_NOT_FOUND"
    }
    ```

#### Đặt lại mật khẩu
- **Endpoint**: POST /auth/reset-password
- **Body**:
  ```json
  {
    "token": "reset-token",
    "password": "newpassword123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Password was reset successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Invalid Token",
      "message": "The reset token is invalid or expired",
      "errorCode": "INVALID_RESET_TOKEN"
    }
    ```

---

### 2.2 Quản lý Người dùng (User)

#### Lấy thông tin người dùng
- **Endpoint**: GET /user
- **Yêu cầu**: Cần xác thực
- **Cơ chế hoạt động**:
  1. **Xác thực**:
     - Client gửi request kèm JWT token (qua cookie hoặc header)
     - Server kiểm tra token và trích xuất userId
  2. **Xử lý**:
     - Tìm kiếm user theo userId trong database
     - Lọc bỏ thông tin nhạy cảm (password)
     - Trả về thông tin user
- **Response**:
  - **200 OK**:
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
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid or Expired Token",
      "message": "Token is invalid or expired",
      "errorCode": "INVALID_TOKEN"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "User Not Found",
      "message": "User with the provided ID does not exist",
      "errorCode": "USER_NOT_FOUND"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "error": "Server Error",
      "message": "An unexpected error occurred while retrieving the user data",
      "errorCode": "SERVER_ERROR"
    }
    ```

---

Các mã lỗi và `errorCode` trong responses sẽ giúp phân biệt rõ các tình huống lỗi cho frontend, từ đó có thể xử lý các lỗi một cách cụ thể và dễ dàng hơn.
