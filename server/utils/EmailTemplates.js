module.exports.PasswordResetTemplate = (resetOTP, name) => {
	return `
            
        <!DOCTYPE html 
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>Learn n Earn Account Recovery</title>
        </head>

        <body>
            <table cellspacing="0" cellpadding="5" width="605" style="margin: 40px auto;  background-color: #ffffff;">
                <tr>
                    <td align="middle" valign="middle">
                        <img style="height: 70px;"
                            src="cid:password-reset@learnnearn" />
                    </td>
                </tr>
                <tr>
                    <td width="596" align="center">
                        <p
                            style="margin: 0; font-size: 22px;text-align: center; font-weight: bold; color: #494a48; font-family: arial; line-height: 110%;">
                            Password Reset</p>
                    </td>
                </tr>

                <tr>
                    <td style="text-align: center; height: 50px" align="center">
                        <p style="font-size: 18px; padding: 0 10%;">Hello ${name}, seems like you forgot the password for
                            Learn n Earn. if it’s true, click below to reset it.</p>
                        <p>
                    </td>
                </tr>

                <tr>
                    <td style="text-align: center; height: 90px" align="center">
                        <span href="" style="text-decoration: none; font-size: 18px; padding: 15px 25px; background-color: #00B3FF; color: #ffffff;">${resetOTP}</span>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; height: 50px" align="center">
                        <p style="font-size: 14px;">If you didn’t forgot your password you can safely <br />ignore this email.</p>
                    </td>
                </tr>


            </table>


        </body>

        </html>

    `;
};

module.exports.EmailVerificationTemplate = (otp, name) => {
	return `
            
    <!DOCTYPE html 
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Learn n Earn Account Recovery</title>
    </head>

    <body>
        <table cellspacing="0" cellpadding="5" width="605" style="margin: 40px auto;  background-color: #ffffff;">
            <tr>
                <td align="middle" valign="middle">
                    <img style="height: 70px;"
                        src="cid:email-verify@learnnearn" />
                </td>
            </tr>
            <tr>
                <td width="596" align="center">
                    <p
                        style="margin: 0; font-size: 22px;text-align: center; font-weight: bold; color: #494a48; font-family: arial; line-height: 110%;">
                        Verify Email</p>
                </td>
            </tr>

            <tr>
                <td style="text-align: center; height: 50px" align="center">
                    <p style="font-size: 18px; padding: 0 10%;">Hello ${name}, Your OTP for email verification is given below. It will be vaild for 10 minutes</p>
                    
                </td>
            </tr>

            <tr>
                <td style="text-align: center; height: 90px" align="center">
                    <span style="margin:auto; width: 30%;text-decoration: none; font-size: 30px; padding: 15px 25px; background-color: #00B3FF; color: #ffffff;">${otp}</span>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; height: 50px" align="center">
                    <p style="font-size: 14px;">If you received any error, simply try to login again.</p>
                </td>
            </tr>


        </table>


    </body>

    </html>
    `;
};

module.exports.OfferTemplate = (name, company) => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Offer Letter</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
        </head>
        <body >
            <p>Congratulation ${name} </p>
            <p>Greeting from Learn n Earn!! The Offer letter for ${company} has been sent to your dashboard, Kindly download it</p>
            
        </body>
    </html>
`;
};

module.exports.ExamNotification = () => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Offer Letter</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
        </head>
        <body >
            <p>Dear candidate kindly attend online examination within 3 days. </p>
            <footer>Regards Learn n Earn Team. </footer>
            
        </body>
    </html>
`;
};

module.exports.ExamCompleted = () => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Offer Letter</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
        </head>
        <body >
            <p>Dear candidate, you have successfully passed the examination. Please wait for the further process of Interview, our team will contact you. </p>
            <footer>Regards Learn n Earn Team. </footer>
            
        </body>
    </html>
`;
};

module.exports.InterviewCompleted = () => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Offer Letter</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
        </head>
        <body >
            <p>Dear candidate, you have successfully passed the interview. Please wait for the further process of Admission, our team will contact you. </p>
            <footer>Regards Learn n Earn Team. </footer>
            
        </body>
    </html>
`;
};
