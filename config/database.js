import { db } from "./MyFirebase";
/**
 
static setUserName(userId, Name) {

    let userName = "/user/" + userId + "/details";

    return db.database().ref(userName).set({
        Name: Name
    })

}
 */

export const listen4Drivers = () => {

    db.database().ref('drivers').once('value', (snap) => {
        var drivers = [];
        snap.forEach((child) => {

            drivers.push({
                latitude: child.val().latitude,
                longitude: child.val().longitude,


            });
        });
        console.log(drivers)
        return (drivers);

    });
}

export const listenUserName = (userId, callback) => {

    let userName = "/user/" + userId + "/details";

    db.database().ref(userName).on('value', (snapshot) => {

        var Name = "";



        if (snapshot.val()) {

            Name = snapshot.val().Name

        }

        callback(Name)
    });
}



