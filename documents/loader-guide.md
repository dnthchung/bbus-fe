# Hướng dẫn sử dụng thành phần Loader

Tài liệu này hướng dẫn cách sử dụng hai thành phần `BusLoader` và `AdvancedBusLoader` trong dự án React.

---

## Mục lục

1. [Cài đặt / Import](#cài-đặt--import)
2. [BusLoader](#busloader)
   - [Props](#props)
   - [Ví dụ](#ví-dụ)
3. [AdvancedBusLoader](#advancedbusloader)
   - [Props](#props-1)
   - [Kiểu hoạt ảnh](#kiểu-hoạt-ảnh)
   - [Ví dụ](#ví-dụ-1)

---

## Cài đặt / Import

Cài đặt phụ thuộc Lucide React nếu chưa có:

```bash
npm install lucide-react
# hoặc
yarn add lucide-react
```

Import các component loader vào file của bạn:

```tsx
import { BusLoader } from "@/components/mine/loader/bus-loader";
import { AdvancedBusLoader } from "@/components/mine/loader/advanced-bus-loader";
```

---

## BusLoader

Một loader đơn giản với icon xe buýt nhảy lên và xuống, kèm tùy chọn hiển thị văn bản.

### Props

| Tên         | Kiểu                                                        | Mặc định     | Mô tả                                                  |
| ----------- | ----------------------------------------------------------- | ------------ | ------------------------------------------------------ |
| `size`      | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` \| `'2xl'` \| `'full'` | `'md'`       | Kích thước tổng thể của loader.                        |
| `variant`   | `'primary'` \| `'secondary'` \| `'default'`                 | `'default'`  | Chủ đề màu sắc cho icon và văn bản.                    |
| `showText`  | `boolean`                                                   | `true`       | Hiển thị văn bản bên dưới icon hay không.              |
| `text`      | `string`                                                    | `'Loading…'` | Văn bản tùy chỉnh khi `showText` là `true`.            |
| `className` | `string`                                                    | —            | Các lớp CSS Tailwind bổ sung cho phần wrapper `<div>`. |

### Ví dụ

<details>
<summary>Loader nhỏ dùng inline</summary>

```tsx
<BusLoader size="sm" text="Đang tải dữ liệu..." />
```

</details>

<details>
<summary>Loader trung bình cho bảng</summary>

```tsx
<BusLoader size="md" variant="primary" text="Đang tải bảng..." />
```

</details>

<details>
<summary>Loader toàn màn hình</summary>

```tsx
<BusLoader size="full" variant="secondary" text="Vui lòng chờ…" />
```

</details>

---

## AdvancedBusLoader

Phiên bản nâng cao với nhiều kiểu hoạt ảnh khác nhau và thêm “đường” khi sử dụng hoạt ảnh `drive`.

### Props

| Tên         | Kiểu                                                        | Mặc định     | Mô tả                                                  |
| ----------- | ----------------------------------------------------------- | ------------ | ------------------------------------------------------ |
| `size`      | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` \| `'2xl'` \| `'full'` | `'md'`       | Kích thước thành phần (icon, đường, và văn bản).       |
| `variant`   | `'primary'` \| `'secondary'` \| `'default'`                 | `'default'`  | Chủ đề màu cho icon, đường và văn bản.                 |
| `animation` | `'bounce'` \| `'pulse'` \| `'spin'` \| `'drive'`            | `'drive'`    | Kiểu hoạt ảnh cho icon (và đường khi `drive`).         |
| `showText`  | `boolean`                                                   | `true`       | Hiển thị văn bản bên dưới loader hay không.            |
| `text`      | `string`                                                    | `'Loading…'` | Văn bản tùy chỉnh khi `showText` là `true`.            |
| `className` | `string`                                                    | —            | Các lớp CSS Tailwind bổ sung cho phần wrapper `<div>`. |

### Kiểu hoạt ảnh

- **bounce**: nhảy lên xuống
- **pulse**: phóng to thu nhỏ (mờ dần)
- **spin**: quay vòng liên tục
- **drive**: di chuyển ngang qua lại trên “đường”

---

### Ví dụ

<details>
<summary>Hoạt ảnh drive (mặc định)</summary>

```tsx
<AdvancedBusLoader
  size="lg"
  variant="primary"
  animation="drive"
  text="Đang lấy dữ liệu…"
/>
```

</details>

<details>
<summary>Hoạt ảnh spin, không hiển thị chữ</summary>

```tsx
<AdvancedBusLoader
  size="xl"
  variant="secondary"
  animation="spin"
  showText={false}
/>
```

</details>

---

## Lưu ý

- Chế độ **toàn màn hình** (`size="full"`) sẽ cố định loader phủ toàn viewport với nền mờ trong suốt.
- Dùng `className` để điều chỉnh margin, vị trí hoặc z-index nếu cần.
- Cả hai loader đều sử dụng icon từ [Lucide‑React](https://github.com/lucide-icons/lucide).

```

```
