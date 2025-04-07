//define các mess response trả về từ api vdu login sai : Unauthorized: phone or password is invalid
//path : src/features/auth/sign-in/data.ts// src/features/auth/sign-in/data.ts

export const AUTH_MESSAGES = {
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại.',
    UNAUTHORIZED: 'Số điện thoại hoặc mật khẩu không hợp lệ',
    TOKEN_NOT_FOUND: 'Không tìm thấy token!',
    USER_ID_NOT_FOUND: 'Không thể lấy userId từ token!',
    INVALID_ROLE: 'Tài khoản không có quyền truy cập hệ thống',
  }
  