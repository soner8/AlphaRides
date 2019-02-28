const functions = require('firebase-functions');

// Remember we are setting the passenger cloud function to send notification to driver

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.sendNewTripNotification = functions.database.ref('drivers/{DriverUID}/{PassengerKey}/status').onUpdate((change, context)=>{
    console.log('About to send Notification')
    const uuid = context.params.DriverUID;
    const passengerKey = context.params.PassengerKey

    console.log('Driver to send notification', uuid);

    var ref = admin.database().ref(`drivers/${uuid}/NotificationId`);
    return ref.once("value", function(snapshot){
        console.log(snapshot)
        console.log(snapshot.val())
         const payload = {
              notification: {
                  title: 'You have been invited to Pick Up a passenger.',
                  body: 'Tap here to check it out!'
		  
              }
         };

         admin.messaging().sendToDevice(snapshot.val(), payload)

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
})