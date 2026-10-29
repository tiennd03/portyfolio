# Portfolio — Hướng dẫn chỉnh sửa, chạy và deploy

## 1. Sửa nội dung thành của bạn

Toàn bộ thông tin cá nhân nằm trong 2 file, không phải sửa component:

| File | Sửa gì |
| --- | --- |
| `src/app/core/site-config.ts` | Tên đầy đủ, link LinkedIn / Upwork / CV, link demo của từng dự án, danh sách kỹ năng, `siteUrl` |
| `src/app/core/content.ts` | Mọi câu chữ trên trang, bản tiếng Anh (`en`) và tiếng Việt (`vi`) |

Các chỗ cần điền có ghi `TODO`. Link để trống (`''`) thì nút tương ứng tự ẩn.

Nếu bạn quên dịch một trường, TypeScript sẽ báo lỗi khi build. Nếu danh sách hai ngôn ngữ lệch số lượng (ví dụ thêm câu hỏi FAQ tiếng Anh mà quên tiếng Việt), test `content.spec.ts` sẽ báo đỏ.

## 2. Form liên hệ gửi email thật (tùy chọn)

Mặc định, khi khách bấm **Send**, trình duyệt mở ứng dụng email của họ với nội dung điền sẵn. Muốn nhận thẳng vào hộp thư mà khách không cần mở app email:

1. Đăng ký miễn phí tại https://formspree.io, tạo form mới với email của bạn.
2. Formspree cho một đường dẫn dạng `https://formspree.io/f/abcdwxyz`. Copy phần `abcdwxyz`.
3. Dán vào `formspreeId` trong `site-config.ts`.

## 3. Chạy, test, build

```powershell
npm install
npm start          # http://localhost:4200
npm test           # chạy unit test
npm run build      # tạo trang tĩnh đã prerender
```

Sau khi build, mở `dist/portfolio/browser/index.html` bằng Notepad: bạn sẽ thấy toàn bộ nội dung trang đã nằm sẵn trong HTML. Đó là **prerender**, giúp Google đọc được trang và trang hiện ngay khi mở.

**Nếu build báo lỗi liên quan `BootstrapContext` hoặc `main.server.ts`:** bản Angular bạn cài có thể khác. Cách lùi an toàn là tắt prerender: trong `angular.json` xóa hai dòng `"server": ...` và `"outputMode": ...`. App vẫn chạy bình thường, chỉ mất phần HTML dựng sẵn. Gửi lỗi cho mình để sửa đúng cách.

## 4. Deploy

Tạo project Firebase tên `portfolio`, rồi:

```powershell
npx firebase-tools use --add
npm run build
npx firebase-tools deploy --only hosting
```

Sau khi có link, điền vào `siteUrl` trong `site-config.ts`, build và deploy lại.

Đây là link bạn sẽ dán vào hồ sơ Upwork, LinkedIn và chữ ký email.

## 5. Kiểm tra chất lượng bằng Lighthouse

1. Mở trang đã deploy trong Chrome → F12 → tab **Lighthouse**.
2. Chọn **Mobile**, tick cả 4 mục → **Analyze page load**.
3. Mục tiêu: cả 4 điểm (Performance, Accessibility, Best Practices, SEO) từ 90 trở lên. Chụp màn hình kết quả đưa vào README — khách rất thích thấy điều này.
