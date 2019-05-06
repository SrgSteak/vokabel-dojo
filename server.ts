import * as express from 'express';
import {Application} from "express";

const webpush = require('web-push');

const vapidKeys = {
    "publicKey":"BEf3AAasjVowk2heZKL_QLSM9AkUrEiiCaxdZNrA96Ffe3lPs66r7mguXTUAvzdmvBT44dcA-JjdTyzBXdUUKfM",
    "privateKey":"m3_xmk5uy_JR2oNf_bX7Q7ejzJdxBqi2pWlA5-S6WYU"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app: Application = express();
const firebase = require("firebase");

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

export function sendNewsletter(req, res) {

  subscriptions.get().then(collection => {

    const allSubscriptions = [];//... get subscriptions from database

    collection.forEach(sub => { allSubscriptions.push(sub.data())});

    console.log('Total subscriptions', allSubscriptions.length);
    // console.log(allSubscriptions[0].data());
    const notificationPayload = {
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

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });

    });
}

// launch an HTTP Server
const httpServer = app.listen(9000, () => {
  console.log("HTTP Server running at http://localhost:" + httpServer.address().port);
});