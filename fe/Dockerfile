# Bước 1: Chọn base image (Node.js để build)
FROM node:18 AS builder

# Bước 2: Đặt thư mục làm việc trong container
WORKDIR /app

# Bước 3: Copy package.json và lock file để cache dependencies
COPY package.json pnpm-lock.yaml ./

# Bước 4: Cài đặt pnpm để quản lý dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Build ứng dụng bằng Vite
RUN npm run build

# Bước 7: Sử dụng lightweight Nginx để chạy ứng dụng
FROM nginx:1.25-alpine AS runner

# Bước 8: Copy file build từ bước trước vào thư mục Nginx phục vụ web
COPY --from=builder /app/dist /usr/share/nginx/html

# Bước 9: Copy file cấu hình Nginx để xử lý SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

# Bước 10: Mở cổng 80
EXPOSE 80

# Bước 11: Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
