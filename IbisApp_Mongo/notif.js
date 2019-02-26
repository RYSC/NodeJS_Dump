var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "alerts.summerstudio19",
        pass: "5ummer19"
    }
});

var fullBin = {
    from: "alerts.summerstudio19",
    to: "rachelcallaghanuts@gmail.com",
    subject: "Notif: Bin is full",
    text: "The bin is full"
};

module.exports = { 
    sendMail: function() {
        transporter.sendMail(fullBin, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }
}