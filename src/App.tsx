import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import {Route} from "react-router";
import Upload from "./components/Video/Upload"


export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCy9qPjxwBgaFj3HWGWE6DqVdBZNeIaTvc",
  authDomain: "croudskill.firebaseapp.com",
  projectId: "croudskill",
  storageBucket: "croudskill.appspot.com",
  messagingSenderId: "406351603351",
  appId: "1:406351603351:web:ab5394242d49b272c9abd2",
  measurementId: "G-DZGQRTZMGQ",
});


export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
export const storage = firebase.storage();

function App() {
    return (
        <Layout>
            <Route component={Upload} path="/upload"/>
        </Layout>
    );
}

export default App;
