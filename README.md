API Protect for TOP 10 OWASP 

API 1: Broken Object Level Authorization 
Description: BOLA (Business Logic or Application Logic Abuse) là một lỗ hổng bảo mật trong các ứng dụng web, trong đó cơ chế xác thực không kiểm tra đúng quyền của người dùng để thực hiện các hành động trên một đối tượng nào đó.
Gồm 2 loại chính: 
Loại 1: Get ra dữ liệu của đối tượng thông qua params URL 
/api/endpoint/get_profile?user_id=101
user thực hiện get dữ liệu người dùng ứng với user_id=?. Nếu server ko xử lý xác thực người dùng, tương ứng với id khác nhau, attacker có thể lấy hết toàn bộ dữ liệu user.
TH1: Ứng dụng ko thực hiện xác thực người dùng đã login để truy cập api trên. 
TH2: Ứng dụng thực hiện xác thực người dùng. nhưng ko kiểm tra quyền truy cập api. điều kiện các param tường ứng. 
vd: 
khi người dùng login => nhận được user_id => get api với user_id tường ứng (nếu ko handle error)
manager có thể get ra toàn bộ user với user_id param tương ứng với mỗi user. phân quyền dựa vào role (user, admin, root).

Loại 2: Thực hiện cập nhật role người dùng.
Yêu cầu các yếu tố, authentication, authorization. 
Kịch bản khác. tất cả cuốn sách đều có được thông tin (uuid của người nhập). Người dùng bình thường có thể show ra toàn bộ thông của tất cả cuốn sách. thì nếu như thấy được uuid thì có thể get ra toàn bộ thông tin của người dùng đó.

API 2: Broken User Authentication
Description: Broken User Authentication (Sự sai lệch trong xác thực người dùng) đề cập đến bất kỳ điểm yếu nào trong quá trình xác thực API. Những lỗ hổng này thường xảy ra khi nhà cung cấp API không triển khai cơ chế bảo vệ xác thực hoặc triển khai cơ chế một cách không chính xác.
Prevent: 
Để đạt được tính stateless (không lưu trạng thái), nhà cung cấp API không nên cần nhớ thông tin người dùng từ yêu cầu này sang yêu cầu khác. 
Để đáp ứng yêu cầu này, các API thường yêu cầu người dùng trải qua quá trình đăng ký để nhận một mã thông báo duy nhất.
Case vulnerable:
• Cho phép tấn công credential stuffing, trong đó kẻ tấn công có một danh sách các tên người dùng và mật khẩu hợp lệ.
• Cho phép kẻ tấn công thực hiện tấn công brute force trên cùng một tài khoản người dùng mà không cần hiển thị captcha hoặc cơ chế khóa tài khoản.
• Cho phép sử dụng mật khẩu yếu.
• Gửi thông tin xác thực nhạy cảm, như mã thông báo xác thực và mật khẩu, trong URL.
• Không xác thực tính xác thực của các mã thông báo.
• Chấp nhận các mã thông báo JWT chưa được ký hoặc được ký yếu ("alg":"none")/không xác thực ngày hết hạn của chúng.
• Sử dụng mật khẩu dưới dạng văn bản thuần, không được mã hóa hoặc được băm yếu.
• Sử dụng khóa mã hóa yếu.
Hiện thực kịch bản: 
Kịch bản 1: 
Chức năng reset password. 
endpoint: /api/users/verification-codes?username=?. khi call api, server sẽ gửi 1 mã sms 6 digits đến email nạn nhân. bởi vì api ko implement rate limiting policy, attacker có thể thực hiện brute force sử dụng multi-threaded script.
=> Thực hiện implement rate limiting thời gian 
Đồng thời sử dụng thêm queue để đưa vào trong queue để sử lý.
Xử lý nginx, load balancing để tối ưu performaning ứng dụng. 
Kịch bản 2: 
Jwt, sử dụng key secret quá dễ đoán. nguy hiểm khi key secret của bạn nằm trong list brute force của attacker. 
attacker tiến hành multi-threaded script brute force để tìm ra secret. 
=> Sử dụng key secret mạnh mẽ, được mã hóa.
( related: https://www.youtube.com/watch?v=-JAf08oGrcc&t=563s)
Ngăn chặn:
Kịch bản 3:
Lưu trạng thái người dùng với việc xác thực 1 lần. Nếu user chiếm quyền, tự đặt cấp lên thành admin 


API 3: Broken Object Property Level Authorization 
Description: Khi cho phép một user có thể truy cập một đối tượng từ một APi nào đó, việc xác thực là rất quan trọng để chỉ đinh rằng user có thể truy cập đối tượng hoặc các thuộc tính của đối tượng
Các API chứa lỗ hổng nếu: 
Dữ liệu trả về từ API bao gồm các thuộc tính của một đối tượng trong đó có bao gồm các thuộc tính được xem là dữ liệu nhạy cảm ( không được show ) trực tiếp cho người dùng thấy. ref: Excessive Data exposure
Api cho phép người dùng thay đổi. update/delete một giá trị nhạy cảm (được bảo vệ) của đối tượng. Giá trị mà người dùng ko thể truy cập (thao tác). ref: Mass assignment
Hiện thực kịch bản: 
Kịch bản 1: 
Mass assignment: có 1 api /uers dùng để cập nhật thông tin cơ bản của người dùng 
Tuy nhiên, server ko thực hiện xác thực chắc chẽ các giá trị gửi lên từ body. attacker lợi dụng để cập nhật thông tin số dư tài khoản của người dùng. từ đó người dung có thể mua ma không bị mất phí. 

API 4: Broken Object Function Level Authorization 
Description: xảy ra khi kiểm soát quyền truy cập không được thực hiện chính xác ở mức chức năng trong một API. Điều này có nghĩa là người dùng có thể thực hiện các chức năng hoặc thao tác mà họ không có quyền hoặc không được phép. Lỗ hổng này có thể xảy ra khi các kiểm tra quyền truy cập được thực hiện sai hoặc bị bỏ qua trong mã API.

Kịch bản 1: Ví dụ khi một người dùng đăng ký tài khoản trên ứng dụng. status của người dùng là pending. và chỉ có admin cấp cao mới có thể thực hiện update trạng thái người dùng. 
-> Nếu server ko thực hiện xác thực chặc chẽ, chính người dùng sau khi call api 
/api/users/{id}/update-status?status=’confirm|pending|denied’
Kịch bản 2: 
api: /api/v2/user/bookId: get ra thông tin của cuốn sách (method GET)
api: /api/v2/admin/bookId: xóa cuốn sách (method DELETE)
Trường hợp nếu api admin không được xách thực danh tính người dùng. họ có thể xóa cuốn sách đó ra khỏi database, điều này rất nguy hiểm

API 5: SSRF
Description:  xảy ra khi một ứng dụng API cho phép kẻ tấn công thực hiện các yêu cầu HTTP tới các nguồn tài nguyên bên ngoài mà không kiểm soát được. Lỗ hổng này có thể xảy ra khi ứng dụng API không xác thực hoặc không kiểm tra đầy đủ các yêu cầu gửi đến từ người dùng hoặc không chặn các yêu cầu gửi đến các nguồn tài nguyên nội bộ hay các hệ thống khác trong mạng nội bộ.
Khi tấn công SSRF thành công, kẻ tấn công có thể khai thác ứng dụng API để truy cập các nguồn tài nguyên nhạy cảm trong hệ thống nội bộ, chẳng hạn như cơ sở dữ liệu, tệp tin hệ thống, hoặc các dịch vụ khác mà ứng dụng có quyền truy cập. Điều này có thể dẫn đến việc lộ thông tin nhạy cảm, thực hiện tấn công từ chối dịch vụ (DoS), hoặc thậm chí chiếm quyền kiểm soát toàn bộ hệ thống.
Kịch bản 1: Ứng dụng thực hiện call api đến một server khác để get ra tất cả thông tin của user (http:192.168.10.156/users). với một field stockApi được đính kèm trong phần body gửi lên.
Lỗ hổng xảy ra khi attacker thay field đó thành api internal source (http://127.0.0.1:8080/admins) api này dùng để delete users. 
