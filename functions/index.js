const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const request = require('request-promise');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const app = express();

// Automatically allow cross-origin requests
app.use(cors({
    origin: true,
}));

app.use(express.urlencoded({
    extended: false
}));

const appId = "tVCvWnQp"
app.use((req, res, next) => {
    app.locals.appId = appId;
    next();
})



const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer btJQcQqukt3/aX8TXIj4UULx5hl7SMJdlLNtby9xJbzqLCJ/CGTMb0NBwqafAHs1HM+NXhk1YdvizPJ8zDwJH0xfO4WRdKCmYit7pfWkKPiiPOA2C6Qxb2GtMjbqzPLD/YnJEB+O0m8/DGOlBbONfwdB04t89/1O/w1cDnyilFU=`
};


const push = (res, msg, userId) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    type: `text`,
                    text: msg
                }
            ]
        })
    }).then(() => {
        return res.status(200).send(`Done`);
    }).catch((error) => {
        return Promise.reject(error);
    });
}

app.post("/webhook", (req, res) => {
    functions.logger.log(req);
    if (req.body.data) {
        const installer = req.body.data.recipient
        const buyer = req.body.data.sender
        if (req.body.type == "notification.triggered" && installer.role == "installer") {
            const userId = installer.custom.lineUserId
            return push(res, "you have " + req.body.data.messages.length + " new messages from " + buyer.name + `\n go to chat http://localhost:3000/installer/${buyer.id}`, userId)
        }
    }

    return res.end("Received POST request!");
});

exports.talkjs = functions.https.onRequest(app);