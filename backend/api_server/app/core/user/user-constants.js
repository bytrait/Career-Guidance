const passRegexPattern = /(?=^.{8,200}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
const usernameRegexPattern = /^[a-zA-Z][\w-_.@]{4,50}$/

const USER_ERROR_MSGS = {
    AUTH_FAILED: 'Incorrect details',
    OTP_FAILED: 'Incorrect OTP',
    USERNAME_UNAVAILABLE: 'Email already exists. If you are an existing user, click on Login. Else use a different email to sign up',
    PASSWORD_CONFIRM_PASS_MISMATCH: 'Password and confirm password are not matching',
    INCORRECT_CURR_PASSWORD: 'Incorrect current password',
    INVALID_USERNAME: 'Invalid username',
    INVALID_EMAIL: 'Invalid email address',
    EMPTY_NAME: 'Please provide name',
    INVALID_MOBILE: 'Invalid mobile number',
    USER_NOT_VALID: 'User does not exist with this email',
    INVALID_REGISTRATION_TOKEN: 'Invalid registration token'
}

const USER_SUCCESS_MSGS = {
    AUTH_SUCCESS: 'Authentication successful',
    LOGOUT_SUCCESS: 'logout successfully',
    OTP_GENERATED: 'OTP generated successfully',
    REGISTER_SUCCESS: 'Registration successful',
    STUDENTS_RETRIEVED: 'Students retrieved',
    CHAT_RETRIEVED: 'Chat retrieved',
    CHAT_ANSWER_RETRIEVED: 'Chat answer retrieved',
    STUDENT_LIMIT_EXCEEDED: 'Students limit exceeded'
}

module.exports = {   USER_ERROR_MSGS, USER_SUCCESS_MSGS, passRegexPattern, usernameRegexPattern }