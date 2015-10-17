
var path = require('path');
var fs = require('fs');

var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;

var fromEmail = 'NodeApp Team <no-reply@youremail.com>';

// setup transporter
var transporter = nodemailer.createTransport({
    service: config.emailer.service,
    auth: {
        user: config.emailer.user,
        pass: config.emailer.pass,
    },
});
transporter.use('compile', htmlToText());

// supported email templates
var emailTypes = {

    /*
      data: {
        firstName,
        lastName,
        verificationLink,
        email
      }

      template: {FIRSTNAME} {LASTNAME} {VERIFICATIONLINK}
    */
    emailVerification: {
        file: 'email_verification.html',
        subject: 'NodeApp email verification',
        replacer: function(body, data) {
            var emailBody = body.
            replace('{FIRSTNAME}', data.firstName).
            replace('{LASTNAME}', data.lastName).
            replace('{VERIFICATIONLINK}', data.verificationLink).
            replace('{VERIFICATIONLINK}', data.verificationLink);
            return emailBody;
        },
    },
};

module.exports = {

    send: function(type, data, cb) {

        // only process supported type
        var emailTypeData = emailTypes[type];

        if (emailTypeData) {

            var filePath = __dirname + '/emails/' + emailTypeData.file;
            fs.readFile(filePath, function(err, emailBodyMd) {
                if (err) {
                    console.error(err);
                }                else {
                    var emailBody = emailBodyMd.toString();
                    emailBody = emailTypeData.replacer(emailBody, data);

                    var mailOptions = {
                        from: fromEmail,
                        to: data.email,
                        subject: emailTypeData.subject,
                        html: emailBody,
                    };

                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            console.error(err);
                            cb(err);
                        }                        else {
                            console.log('Email with type ' + type + ' is sent: ' + info.response, JSON.stringify(data));
                            cb(null, info);
                        }
                    });
                }
            });

        }        else {
            console.error('Email with type ' + type + ' is not supported');
        }

    },

};
