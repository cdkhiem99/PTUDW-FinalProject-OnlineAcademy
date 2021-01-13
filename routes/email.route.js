const nodemailer = require("nodemailer");

module.exports = {
    sendConfirmationEmail(user, token ,callback) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: `18clc6.ai@gmail.com`,
                pass: `Clc6@hcmus`
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const url = `http://localhost:3000/account/confirmation/${token}`;
        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Message',
            text: 'Hi',
            html:   `<p>Hello ${user.username},</p>
                    <p>Follow this link to verify your email address.</p>
                    <p><a href='${url}'>${url}</a></p>
                    <p>If you didn’t ask to verify this address, you can ignore this email.</p>
                    <p>Thanks,</p>
                    <p>Your Yanghoco team</p>`
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log("Error: ", err.message);
            }
            else {
                console.log("Email send!!!");
            }
            callback(err, data);
        });
    }
};