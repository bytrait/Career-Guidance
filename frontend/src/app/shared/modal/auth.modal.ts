
export interface I_SignUp {
    email: string,
    name: string,
    mobile: number
}

export interface I_SignUp_Response {
    success: boolean,
    message: string
}

export interface I_SignIn_Response {
    success: boolean,
    message: string,
    reportGenerated: boolean,
    user?: any
    testAnswers: any
}


export interface I_Login {
    email: string,
    otp: number
}