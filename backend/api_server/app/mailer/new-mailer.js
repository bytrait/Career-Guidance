const nodemailer = require('nodemailer');
const fs = require('fs')

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'upcreet@gmail.com',
        pass: 'wciimahzjbliscnf'
    }
});

/*var mailOptions = {
    from: 'email.career.logy@gmail.com',
    to: 'mukulendra.singh@gmail.com',
  subject: 'This is test email using node js',
  text: 'Sending the test attachements!',
  attachments: [{   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        { 
            path: 'C:/mas/Image_Test_Data/Image Data Works A/Input for predict tab/image inputs/1.jpg' // stream this file
        },
        {   // stream as an attachment
            filename: 'a.pdf',
            content: fs.createReadStream('C:/Mukul/transactionHB5VG5.pdf')
        },
    ]
}*/




function sendOTP(toEmail, otp) {
    var mailOptions = {
        from: 'upcreet@gmail.com',
        to: toEmail,
        subject: 'Upcreet OTP for login',
        text: 'OTP for login is: ' + otp,
    }
    mailTransporter.sendMail(mailOptions, function (err, data) {

        if (err) {
            console.log('Error in sending email ' + err);
        } else {
            console.log('Email sent successfully');
        }
    });

}

//sendOTP('kishorekul@gmail.com', '987766')