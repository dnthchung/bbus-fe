- side bar được import trong // src/routes/_authenticated/route.tsx
- <PasswordInput placeholder='Nhập mật khẩu mới' {...field} aria-label='password' autoComplete='current-password' />
- tanstack router doc :
    - `https://github.com/TanStack/router/tree/main/examples/react/start-basic-react-query/src/routes`
    - `https://tanstack.com/start/latest/docs/framework/react/api-routes`
    - `https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing#s-or-s`
    - `https://www.youtube.com/watch?v=xUrbLlcrIXY`
    - `https://github.com/TanStack/router/tree/main/examples/react/start-basic-react-query/src/routes`

Phần 1 : giới thiệu về hệ thống và chức năng

`Hệ thống BBus là giải pháp quản lý vận chuyển và điểm danh học sinh tự động, sử dụng hệ thống camera tích hợp công nghệ AI được lắp đặt trên xe buýt đưa đón học sinh. Hệ thống tự động hóa hoàn toàn việc điểm danh và theo dõi chính xác quá trình lên/xuống xe của từng học sinh, đảm bảo không xảy ra tình trạng bỏ quên hoặc sót học sinh trên xe thông qua công nghệ tracking tự động. Bên cạnh đó, giải pháp còn giúp giảm tải đáng kể công việc điểm danh thủ công của giáo viên phụ trách. Hệ thống bao gồm admin panel để quản lý vận hành tổng thể và ứng dụng di động dành cho phụ huynh, nhà xe, giáo viên, qua đó nâng cao hiệu quả quản lý, minh bạch hóa thông tin và đảm bảo an toàn tối đa cho học sinh trong suốt quá trình di chuyển.`

phần 2 : các actor tham gia vào hệ thống và vai trò, detail của từng actor
- nền tảng sử dụng :
    + admin web panel :
        system admin,
        admin
+ mobile app : parent, teacher, bus driver,assistant driver

phần 3 : quy trình hoạt động

A. Đưa / đón
- Đón : Phụ huynh sẽ đưa học sinh đến hoặc chờ tại các điểm đón đã đăng ký với hệ thống. Khi xe bus đến, phụ xe (đây là người của nhà trường) sẽ đón cháu từ phụ huynh lên trên xe. Khi học sinh lên xe, đi qua camera, camera sẽ tự động quét và nhận diện học sinh, nếu nhận diện thành công thì cháu sẽ được hệ thống tự động điểm danh cho. Sau đó hệ thống sẽ gửi thông báo về cho phụ huynh của cháu và lái xe (và cả phụ xe - thông báo in app - zalo là optional). Nếu camera có vấn đề, thì cũng gửi thông báo tới để cho phụ xe có thể thực hiện điểm danh thủ công in app.

- Trả : Xe bus sẽ trả học sinh tại các điểm đã đăng ký trước với hệ thống. Khi học sinh xuống xe, hệ thống camera AI tự động nhận diện và điểm danh học sinh, ghi nhận việc học sinh đã xuống xe an toàn. Sau khi xác nhận thành công, hệ thống sẽ lập tức gửi thông báo về ứng dụng di động cho phụ huynh, lái xe và phụ xe (thông báo qua Zalo là tùy chọn). Trường hợp camera gặp vấn đề không thể nhận diện, hệ thống sẽ cảnh báo ngay lập tức để phụ xe tiến hành xác nhận thủ công trạng thái xuống xe của học sinh trên ứng dụng, đảm bảo không xảy ra tình trạng bỏ sót hay nhầm lẫn trong suốt quá trình trả học sinh.

B. Quản lý hệ thống
- admin panel là nơi quản lý hệ thống cao nhất, cho phép quản lý:
    + Tài khoản người dùng
    + Danh sách học sinh đăng ký sử dụng dịch vụ
    + Tuyến đường
        + Danh sách tuyến đường
        + Lịch trình
        + Danh sách các điểm check point
    + Danh sách xe bus (từ nhà cung cấp (bên thứ 3))
    + Báo cáo
        + Báo cáo điểm danh tự động
            + Danh sách học sinh đã điểm danh thành công khi lên/xuống xe. Thời gian, tuyến đường, xe buýt, giáo viên phụ trách.
        + Báo cáo học sinh vắng mặt
            + Danh sách học sinh vắng mặt theo ngày/tháng. Lý do vắng (nếu có thông báo từ phụ huynh).
        + Báo cáo điểm danh thủ công (Issue Report)
            + cái này là báo cáo khi học sinh k điểm danh tự động được mà phải thực hiện điểm danh thủ công. Trường hợp phải điểm danh thủ công do lỗi hệ thống (camera không nhận diện). Lý do lỗi, thời gian, tuyến đường.
        + Báo cáo vận hành phương tiện
            + Số chuyến xe theo kế hoạch & thực tế.Thời gian xe hoạt động, thời gian đến muộn.
        + Báo cáo phản hồi phụ huynh
            + Phản hồi về điểm danh sai, sự cố xe buýt, an toàn học sinh.
        + Báo cáo trạng thái thiết bị/camera
            + Hiệu suất nhận diện của camera AI.Lịch sử bảo trì & lỗi kỹ thuật.


Directory structure:
└── dnthchung-bbus-fe/
    ├── README.md
    ├── documents/
    │   ├── api-list.md
    │   ├── docker-guide.md
    │   ├── local-setup-guide.md
    │   ├── notes.md
    │   └── todos.md
    └── fe/
        ├── README.md
        ├── components.json
        ├── cz.yaml
        ├── docker-compose.yml
        ├── Dockerfile
        ├── eslint.config.js
        ├── index.html
        ├── knip.config.ts
        ├── mock-data.json
        ├── nginx.conf
        ├── package.json
        ├── pnpm-lock.yaml
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        ├── .dockerignore
        ├── .env.example
        ├── .gitignore
        ├── .prettierignore
        ├── .prettierrc
        ├── public/
        │   ├── backup/
        │   │   └── images/
        │   └── images/
        ├── src/
        │   ├── index.css
        │   ├── main.tsx
        │   ├── routeTree.gen.ts
        │   ├── vite-env.d.ts
        │   ├── api/
        │   │   ├── api-client.ts
        │   │   ├── api-endpoint.ts
        │   │   ├── api-methods.ts
        │   │   └── api-services.ts
        │   ├── assets/
        │   │   └── images/
        │   ├── components/
        │   │   ├── common/
        │   │   │   ├── coming-soon.tsx
        │   │   │   ├── command-menu.tsx
        │   │   │   ├── confirm-dialog.tsx
        │   │   │   ├── long-text.tsx
        │   │   │   ├── password-input.tsx
        │   │   │   ├── pin-input.tsx
        │   │   │   ├── profile-dropdown.tsx
        │   │   │   ├── search.tsx
        │   │   │   ├── select-dropdown.tsx
        │   │   │   ├── skip-to-main.tsx
        │   │   │   └── theme-switch.tsx
        │   │   ├── layout/
        │   │   │   ├── app-sidebar.tsx
        │   │   │   ├── header.tsx
        │   │   │   ├── main.tsx
        │   │   │   ├── nav-group.tsx
        │   │   │   ├── nav-user.tsx
        │   │   │   ├── team-switcher.tsx
        │   │   │   ├── top-nav.tsx
        │   │   │   └── sidebar/
        │   │   │       ├── sidebar-data.ts
        │   │   │       └── sidebar-type.ts
        │   │   └── ui/
        │   │       ├── alert-dialog.tsx
        │   │       ├── alert.tsx
        │   │       ├── avatar.tsx
        │   │       ├── badge.tsx
        │   │       ├── button.tsx
        │   │       ├── calendar.tsx
        │   │       ├── card.tsx
        │   │       ├── checkbox.tsx
        │   │       ├── collapsible.tsx
        │   │       ├── command.tsx
        │   │       ├── dialog.tsx
        │   │       ├── dropdown-menu.tsx
        │   │       ├── form.tsx
        │   │       ├── input.tsx
        │   │       ├── label.tsx
        │   │       ├── popover.tsx
        │   │       ├── radio-group.tsx
        │   │       ├── scroll-area.tsx
        │   │       ├── select.tsx
        │   │       ├── separator.tsx
        │   │       ├── sheet.tsx
        │   │       ├── sidebar.tsx
        │   │       ├── skeleton.tsx
        │   │       ├── switch.tsx
        │   │       ├── table.tsx
        │   │       ├── tabs.tsx
        │   │       ├── textarea.tsx
        │   │       ├── toast.tsx
        │   │       ├── toaster.tsx
        │   │       └── tooltip.tsx
        │   ├── config/
        │   │   └── fonts.ts
        │   ├── context/
        │   │   ├── font-context.tsx
        │   │   ├── search-context.tsx
        │   │   └── theme-context.tsx
        │   ├── features/
        │   │   ├── apps/
        │   │   │   ├── index.tsx
        │   │   │   └── data/
        │   │   │       └── apps.tsx
        │   │   ├── auth/
        │   │   │   ├── auth-api.tsx
        │   │   │   ├── auth-hook.tsx
        │   │   │   ├── auth-layout.tsx
        │   │   │   ├── forgot-password/
        │   │   │   │   ├── index.tsx
        │   │   │   │   └── components/
        │   │   │   │       └── forgot-password-form.tsx
        │   │   │   ├── otp/
        │   │   │   │   ├── index.tsx
        │   │   │   │   └── components/
        │   │   │   │       └── otp-form.tsx
        │   │   │   ├── sign-in/
        │   │   │   │   ├── index.tsx
        │   │   │   │   ├── sign-in-2.tsx
        │   │   │   │   ├── components/
        │   │   │   │   │   └── user-auth-form.tsx
        │   │   │   │   └── utils/
        │   │   │   │       └── language.ts
        │   │   │   └── sign-up/
        │   │   │       ├── index.tsx
        │   │   │       └── components/
        │   │   │           └── sign-up-form.tsx
        │   │   ├── dashboard/
        │   │   │   ├── index.tsx
        │   │   │   └── components/
        │   │   │       ├── overview.tsx
        │   │   │       └── recent-sales.tsx
        │   │   ├── errors/
        │   │   │   ├── forbidden.tsx
        │   │   │   ├── general-error.tsx
        │   │   │   ├── maintenance-error.tsx
        │   │   │   ├── not-found-error.tsx
        │   │   │   └── unauthorized-error.tsx
        │   │   ├── reports/
        │   │   │   └── index.tsx
        │   │   ├── settings/
        │   │   │   ├── index.tsx
        │   │   │   ├── account/
        │   │   │   │   ├── account-form.tsx
        │   │   │   │   └── index.tsx
        │   │   │   ├── appearance/
        │   │   │   │   ├── appearance-form.tsx
        │   │   │   │   └── index.tsx
        │   │   │   ├── components/
        │   │   │   │   ├── content-section.tsx
        │   │   │   │   └── sidebar-nav.tsx
        │   │   │   ├── notifications/
        │   │   │   │   ├── index.tsx
        │   │   │   │   └── notifications-form.tsx
        │   │   │   └── profile/
        │   │   │       ├── index.tsx
        │   │   │       └── profile-form.tsx
        │   │   ├── students/
        │   │   │   ├── index.tsx
        │   │   │   ├── components/
        │   │   │   │   ├── avatar-thumbnail.tsx
        │   │   │   │   ├── students-primary-buttons.tsx
        │   │   │   │   ├── students-table.tsx
        │   │   │   │   ├── dialog/
        │   │   │   │   │   ├── students-action-dialog.tsx
        │   │   │   │   │   ├── students-add-dialog.tsx
        │   │   │   │   │   ├── students-delete-dialog.tsx
        │   │   │   │   │   ├── students-dialogs.tsx
        │   │   │   │   │   ├── students-export-dialog.tsx
        │   │   │   │   │   ├── students-import-excel-dialog.tsx
        │   │   │   │   │   └── students-invite-dialog.tsx
        │   │   │   │   └── table/
        │   │   │   │       ├── data-table-column-header.tsx
        │   │   │   │       ├── data-table-faceted-filter.tsx
        │   │   │   │       ├── data-table-pagination.tsx
        │   │   │   │       ├── data-table-row-actions.tsx
        │   │   │   │       ├── data-table-toolbar.tsx
        │   │   │   │       ├── data-table-view-options.tsx
        │   │   │   │       └── students-columns.tsx
        │   │   │   ├── context/
        │   │   │   │   └── students-context.tsx
        │   │   │   └── data/
        │   │   │       ├── data.ts
        │   │   │       ├── schema.ts
        │   │   │       └── students.ts
        │   │   ├── transportation/
        │   │   │   ├── index.tsx
        │   │   │   ├── bus/
        │   │   │   │   └── index.tsx
        │   │   │   └── routes/
        │   │   │       └── index.tsx
        │   │   └── users/
        │   │       ├── index.tsx
        │   │       ├── note.md
        │   │       ├── components/
        │   │       │   ├── users-dialogs.tsx
        │   │       │   ├── users-primary-buttons.tsx
        │   │       │   ├── users-table.tsx
        │   │       │   ├── dialog/
        │   │       │   │   ├── users-action-dialog.tsx
        │   │       │   │   ├── users-delete-dialog.tsx
        │   │       │   │   ├── users-import-excel-dialog.tsx
        │   │       │   │   └── users-invite-dialog.tsx
        │   │       │   └── table/
        │   │       │       ├── data-table-column-header.tsx
        │   │       │       ├── data-table-faceted-filter.tsx
        │   │       │       ├── data-table-pagination.tsx
        │   │       │       ├── data-table-row-actions.tsx
        │   │       │       ├── data-table-toolbar.tsx
        │   │       │       ├── data-table-view-options.tsx
        │   │       │       └── users-columns.tsx
        │   │       ├── context/
        │   │       │   └── users-context.tsx
        │   │       └── data/
        │   │           ├── data.ts
        │   │           ├── notes.md
        │   │           ├── schema.ts
        │   │           └── users.ts
        │   ├── guards/
        │   │   └── with-guest-route.tsx
        │   ├── helpers/
        │   │   ├── error-code.ts
        │   │   ├── extract-user-name.ts
        │   │   ├── handle-server-error.ts
        │   │   ├── jwt-decode.ts
        │   │   └── regex.ts
        │   ├── hooks/
        │   │   ├── use-auth.ts
        │   │   ├── use-dialog-state.tsx
        │   │   ├── use-mobile.tsx
        │   │   └── use-toast.ts
        │   ├── lib/
        │   │   └── utils.ts
        │   ├── routes/
        │   │   ├── __root.tsx
        │   │   ├── (auth)/
        │   │   │   ├── 500.tsx
        │   │   │   ├── forgot-password.lazy.tsx
        │   │   │   ├── otp.tsx
        │   │   │   ├── sign-in-2.lazy.tsx
        │   │   │   ├── sign-in.tsx
        │   │   │   └── sign-up.lazy.tsx
        │   │   ├── (errors)/
        │   │   │   ├── 401.lazy.tsx
        │   │   │   ├── 403.lazy.tsx
        │   │   │   ├── 404.lazy.tsx
        │   │   │   ├── 500.lazy.tsx
        │   │   │   └── 503.lazy.tsx
        │   │   └── _authenticated/
        │   │       ├── index.tsx
        │   │       ├── route.tsx
        │   │       ├── apps/
        │   │       │   └── index.lazy.tsx
        │   │       ├── help-center/
        │   │       │   └── index.lazy.tsx
        │   │       ├── reports/
        │   │       │   └── index.lazy.tsx
        │   │       ├── settings/
        │   │       │   ├── account.lazy.tsx
        │   │       │   ├── appearance.lazy.tsx
        │   │       │   ├── index.lazy.tsx
        │   │       │   ├── notifications.lazy.tsx
        │   │       │   └── route.lazy.tsx
        │   │       ├── students/
        │   │       │   └── index.lazy.tsx
        │   │       ├── transportation/
        │   │       │   ├── bus.lazy.tsx
        │   │       │   ├── index.lazy.tsx
        │   │       │   └── routes.tsx
        │   │       └── users/
        │   │           └── index.lazy.tsx
        │   ├── stores/
        │   │   └── authStore.ts
        │   └── types/
        │       ├── api.ts
        │       ├── auth.ts
        │       ├── index.ts
        │       ├── user.ts
        │       └── response/
        │           └── error-response.ts
        └── .github/
            ├── CODE_OF_CONDUCT.md
            ├── CONTRIBUTING.md
            ├── FUNDING.yml
            ├── PULL_REQUEST_TEMPLATE.md
            ├── ISSUE_TEMPLATE/
            │   ├── config.yml
            │   ├── ✨-feature-request.md
            │   └── 🐞-bug-report.md
            └── workflows/
                ├── ci.yml
                └── stale.yml


----

