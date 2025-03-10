- side bar được import trong // src/routes/_authenticated/route.tsx


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
