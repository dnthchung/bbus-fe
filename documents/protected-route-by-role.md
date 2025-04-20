# Role-Based Access Control Guide

## Configuration Files
To manage role-based permissions in the application:

1. **Permission Map**: 
   - Location: `src/permissions/routePermissionMap.ts`
   - Example: `'/users': ['SYSADMIN','ADMIN']`

2. **Protected Routes**:
   - Location: `routes/_authenticated/...` files
   - Example: `component: withRoleRoute(Users, ['SYSADMIN','ADMIN'])`

---

## Hướng dẫn triển khai

### 1️⃣ Khi nào cần dùng `withRoleRoute()`

| Cách tiếp cận | Trường hợp sử dụng | Triển khai |
|----------|----------|----------------|
| **Chỉ lọc menu** | Ẩn các mục sidebar nhưng cho phép truy cập URL trực tiếp | Không dùng `withRoleRoute()` |
| **Bảo vệ hoàn toàn** | Chặn người dùng không có quyền truy cập qua URL | Sử dụng `withRoleRoute()` |

> 💡 **Thực hành tốt nhất**: Để bảo mật thực sự, bạn **nên** dùng cả 2:  
> - Lọc các mục sidebar để duy trì giao diện gọn gàng
> - Sử dụng `withRoleRoute()` để ngăn chặn truy cập trực tiếp trái phép

Lựa chọn dựa trên yêu cầu của bạn - chỉ lọc menu cho các tính năng ít quan trọng, và thêm `withRoleRoute()` cho các khu vực nhạy cảm.

---

### 2️⃣ Luồng xác thực & phân quyền

Kiểm soát truy cập dựa trên vai trò tuân theo 5 bước sau:

#### Bước 1: Đăng nhập
- Người dùng đăng nhập → Backend trả về `accessToken` chứa thông tin vai trò
- Frontend lưu token trong localStorage (`accessToken`, `refreshToken`, cờ `isAuthenticated`)

#### Bước 2: Lấy thông tin người dùng
- Frontend sử dụng `useAuthQuery` để giải mã token (trích xuất userId, role)
- Gọi `API_SERVICES.auth.fetchUser(userId)` để lấy thông tin chi tiết người dùng
- Nếu người dùng thiếu quyền thích hợp (không phải "ADMIN" hoặc "SYSADMIN"), token sẽ bị xóa và người dùng được chuyển hướng đến `/sign-in`

#### Bước 3: Lọc sidebar
- `AppSidebar` gọi `filterSidebarData()` với vai trò người dùng hiện tại
- Với mỗi mục menu, `hasAccessByUrl(item.url, userRole)` xác định khả năng hiển thị
- `hasAccessByUrl` kiểm tra đối chiếu với `routePermissionMap`:
  - Nếu URL không có trong map → Hiển thị mặc định
  - Nếu URL có trong map → So sánh vai trò người dùng với các vai trò được phép
    - Khớp → Hiển thị mục
    - Không khớp → Ẩn mục

#### Bước 4: Hiển thị giao diện
- Người dùng chỉ thấy các mục menu được phép bởi `hasAccessByUrl()`
- Các mục có thể thu gọn (có thuộc tính `items`) không nên có thuộc tính `url`
- Các mục liên kết (không có thuộc tính `items`) phải có thuộc tính `url`

#### Bước 5: Ngăn chặn truy cập trực tiếp
- Khi sử dụng `withRoleRoute(Component, [...roles])`:
  - Lấy vai trò người dùng
  - Kiểm tra đối chiếu với các vai trò được phép
  - Nếu không được phép → Hiển thị thông báo "Từ chối truy cập" và chuyển hướng
- Không có `withRoleRoute`, bất kỳ người dùng đã xác thực nào cũng có thể truy cập route

**Kết quả**:
- Chỉ lọc menu → Các mục bị ẩn nhưng URL vẫn có thể truy cập nếu biết
- Với `withRoleRoute` → Bảo vệ hoàn toàn khỏi truy cập trái phép

---

### 3️⃣ Tóm tắt các thực hành tốt nhất

✅ **Luôn sử dụng `filterSidebarData()`** để có giao diện người dùng gọn gàng, phù hợp với vai trò

✅ **Thêm `withRoleRoute()`** cho các route quan trọng yêu cầu kiểm soát truy cập nghiêm ngặt

⚠️ **Tránh `userRole.includes(...)`** trừ khi bạn cố ý muốn khớp chuỗi con (ví dụ: 'SYSADMIN' khớp với 'ADMIN')

🔍 **Xác minh chuỗi vai trò** từ server ('ADMIN' vs 'SYSADMIN' vs 'ROLE_ADMIN')

---

## Giải pháp hoàn chỉnh

1. Lấy thông tin người dùng & vai trò qua `useAuthQuery`
2. Xây dựng sidebar với `filterSidebarData` + `routePermissionMap`
3. Bảo vệ các route với `withRoleRoute` khi cần thiết