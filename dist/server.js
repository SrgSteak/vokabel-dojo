"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var webpush = require('web-push');
var vapidKeys = {
    "publicKey": "BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo",
    "privateKey": "PkVHOUKgY29NM7myQXXoGbp_bH_9j-cxW5cO-fGcSsA"
};
webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);
var app = express();
var firebase = require("firebase");
firebase.initializeApp({
    apiKey: "AIzaSyDDqoCe1KVK-UBZoJrBHm8xQoQD4HtYug8",
    authDomain: "vokabeldojo.firebaseapp.com",
    databaseURL: "https://vokabeldojo.firebaseio.com",
    projectId: "vokabeldojo",
    storageBucket: "vokabeldojo.appspot.com",
    messagingSenderId: "818974977616"
});
var db = firebase.firestore();
var subscriptions = db.collection('subscriptions');
app.route('/api/newsletter').get(sendNewsletter);
function sendNewsletter(req, res) {
    subscriptions.get().then(function (collection) {
        var allSubscriptions = []; //... get subscriptions from database
        collection.forEach(function (sub) { allSubscriptions.push(sub.data()); });
        console.log('Total subscriptions', allSubscriptions.length);
        // console.log(allSubscriptions[0].data());
        var notificationPayload = {
            "notification": {
                "title": "Angular News",
                "body": "Newsletter Available!",
                "icon": "assets/main-page-logo-small-hat.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                        "action": "explore",
                        "title": "Go to the site"
                    }]
            }
        };
        Promise.all(allSubscriptions.map(function (sub) { return webpush.sendNotification(sub, JSON.stringify(notificationPayload)); }))
            .then(function () { return res.status(200).json({ message: 'Newsletter sent successfully.' }); })
            .catch(function (err) {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
    });
}
exports.sendNewsletter = sendNewsletter;
// launch an HTTP Server
var httpServer = app.listen(9000, function () {
    console.log("HTTP Server running at http://localhost:" + httpServer.address().port);
});
//# sourceMappingURL=server.js.map