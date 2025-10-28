const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");
var AWS = require('aws-sdk');
const dotenv = require("dotenv");


const express = require("express");
const emailRouterAws = express.Router();



AWS.config.update({ region: 'ap-south-1' });

const emailTemplate = (username, link) => `    
<html lang="en-US">

    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password.">
            <style type="text/css">
                a:hover {text - decoration: underline !important;}
            </style>
    </head>

    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">

            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <a href="" title="Stoani" target="_blank">
                                    <img style="width:200px" src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/crsxowlz8doxltfaxpz3" alt="Stonai" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:20px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h2>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Hi ${username}
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                               Please click the Reset Password Button 
                                            </p>
                                            <a href=${link}
                                                style="background:#3f77bc;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.stonai.com</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>

</html>`;

emailRouterAws.post("/sendForgetMail", async (req, res) => {
    let { username, link } = req.body;

    console.log(username);
    const pools2 = await pools.getPool();

    try {
        const emailAdress = await pools2.query(
            `select email_address,username from users where username='${username}'`
        );
        console.log(emailAdress);
        if (emailAdress.rows.length > 0) {
            var params = {
                Destination: { /* required */
                    // CcAddresses: [
                    //     'syedharoon544@gmail,com',
                    //     /* more items */
                    // ],
                    ToAddresses: [
                        `${emailAdress.rows[0].email_address}`,
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: emailTemplate(username, link)
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "Reset Password"
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Reset Password'
                    }
                },
                Source: 'no-reply@stonai.com', /* required */
                // ReplyToAddresses: [
                //     'EMAIL_ADDRESS',
                //     /* more items */
                // ],
            };

            // Create the promise and SES service object
            var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
                function (data) {
                    console.log("send", data.MessageId);
                }).catch(
                    function (err) {
                        console.error(err, err.stack);
                    });
            res.send("created");

        }
        else {
            console.log("not created");

            res.send("not created");

        }
    } catch (error) {
        console.error("error", error.message);
        res.status(500).send("Server error");
    }

});

emailRouterAws.post("/sendTestEmail", async (req, res) => {
    let { email, password, username } = req.body;
    console.log(email, password, username);
    var params = {
        Destination: { /* required */
            // CcAddresses: [
            //     'syedharoon544@gmail,com',
            //     /* more items */
            // ],
            ToAddresses: [
                email,
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `You have been registered to the stonai and your credentails are username:${username} and password:${password}`
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `You have been registered to the stonai and your credentails are username:${username} and password:${password}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `You have been registered to the stonai`
            }
        },
        Source: 'no-reply@stonai.com', /* required */
        // ReplyToAddresses: [
        //     'EMAIL_ADDRESS',
        //     /* more items */
        // ],
    };
    try {
        // Create the promise and SES service object
        var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        // Handle promise's fulfilled/rejected states
        sendPromise.then(
            function (data) {
                console.log("send", data);
            }).catch(
                function (err) {
                    console.error(err, err.stack);

                    res.send("error");
                });
        res.send("created");




    } catch (error) {
        console.error("error", error.message);
        res.status(500).send("Server error");
    }

});




module.exports = emailRouterAws;
