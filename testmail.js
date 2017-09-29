const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'LoopDevX@gmail.com',
        pass: 'loopDevX2017!',
    },
});
const mailOptions = {
    from: 'LoopDevX@gmail.com',
    to: 'lawrencechen98@gmail.com',
    subject: 'hello world!',
    html: 'hello world!',
};
transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    }
    console.log(`Message sent: ${info.response}`);
});