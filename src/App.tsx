import React, {useEffect, useState} from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import {Route} from "react-router";
import Upload from "./components/Video/Upload";
import ViewVideo from "./components/Video/ViewVideo";
import Discover from "./components/Discover";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./components/Home";
import Profile from "./components/Profile";

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

AOS.init();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function App() {

    const [db, setDb] = useState<Array<any>>([]);

    return (
        <Layout setDb={setDb}>
            <Route component={Profile} path="/profile"/>
            <Route path="/discover">
                <Discover db={db}/>
            </Route>
            <Route component={Upload} path="/upload"/>
            <Route component={ViewVideo} path="/view"/>
            <Route component={Home} exact path="/" />
        </Layout>
    );
}

export default App;
