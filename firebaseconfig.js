import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCFb6tHxYEBWjpS3rdU5S3XxbjazDtuaI4",
  authDomain: "hacky2-47ad4.firebaseapp.com",
  databaseURL: "https://hacky2-47ad4.firebaseio.com",
  projectId: "hacky2-47ad4",
  storageBucket: "",
  messagingSenderId: "711837929478"
};

firebase.initializeApp(config);

var firebaseDbh = firebase.database();

module.exports = firebaseDbh;