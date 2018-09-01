/**
 * @class Database
 */

import {db}  from "firebase";

class Database {

    /**
     * Sets a users mobile number
     * @param userId
     * @param Name
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserName(userId, Name) {

        let userName = "/user/" + userId + "/details";

        return db.database().ref(userName).set({
            Name: Name
        })

    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserName(userId, callback) {

        let userName = "/user/" + userId + "/details";

        db.database().ref(userName).on('value', (snapshot) => {

            var Name = "";

            if (snapshot.val()) {
                Name = snapshot.val().Name
            }

            callback(Name)
        });
    }

}

module.exports = Database;