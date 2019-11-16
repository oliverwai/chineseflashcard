# Hanzi Application

The Hanzi Application is a simple Flashcard application for studying Chinese made using React.js and Firebase. The application implements several gamification features and the Supermemo-2 algorithm (SM-2) for spaced repetition (SRS).

A video outlining the program can be found at: https://drive.google.com/open?id=1yaMFOg14MDT2SgC9PROH-V_udyA3Q9Db

# Setup
To run the program, navigate to the main folder and type:

    yarn start

To run the file, the user must specify their own firebase config, located in the /src/config/firebase.js file. Firebase must be configured on the website to enable Google Oauth access. 

The file should look like this: 

    // src/config/firebase.js
    
    import firebase from "firebase";
    // Initialize Firebase
    var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);

    export const provider = new firebase.auth.GoogleAuthProvider();
    export const auth = firebase.auth();

Inside Firebase Firestore, a user should also specify three collections:
+ users
+ decks
+ flashcards

# Notice
Graphic assets are property of their original creator and used the Pexel fair license for personal and commercial use. Please see https://www.pexels.com/photo-license/ for more details
