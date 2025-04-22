import { API_SERVICES } from '@/api/api-services'

//file url : fe/src/api/api-endpoint.ts
//send oyt to mail
//input : email string
//url : /auth/forgot-password/request?email=tuanvmhe173334@fpt.edu.vn
//{ "detail": "Đã gửi mã OTP (954400) đến email: tuanvmhe173334@fpt.edu.vn", "status": 200, "message": "Đã gửi mã OTP đến email: tuanvmhe173334@fpt.edu.vn" }
//false : { "timestamp": "2025-04-22T16:11:30.857+00:00", "status": 404, "path": "/auth/forgot-password/request", "error": "Not Found", "message": "Email không tồn tại trong hệ thống.", "details": {} }
export async function sendOtpToMail(email: string) {
  try {
    const response = await API_SERVICES.auth.send_otp_to_mail(email)
  } catch (error) {}
}

//check otp , nhập otp và gửi để verify otp
//input : otp string + email string
//ủl : /auth/forgot-password/verify?email=tuanvmhe173334@fpt.edu.vn&otp=573595
// false : { "timestamp": "2025-04-22T15:11:03.557+00:00", "status": 409, "path": "/auth/forgot-password/verify", "error": "Conflict", "message": "Mã OTP không đúng", "details": {} }
//true :
export async function verifyOtp(otp: string, email: string) {}

//reset password
//input: { "sessionId": "dde98a2e-20b6-405e-a19f-4a2784f6f9b3", "password": "admin2003", "confirmPassword": "admin2003" }
//auth/forgot-password/reset
//true
//false
export async function resetPassword() {}
