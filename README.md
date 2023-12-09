# College Community Center

clone the repository in your system
set up a firebase account and create a new project and copy the config details.
now add those configuration details like apikey in the firebaseHelper.js file.
open terminal go to this repository address and run "npm install" or "yarn" to install the dependencies
then open your emulator and run "npm start". and run the project.

set up data base and put the below code in rules section in firebase database

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read, write: if
request.time < timestamp.date(2023, 3, 28);
}
}
}
