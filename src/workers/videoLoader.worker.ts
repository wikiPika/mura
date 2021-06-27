import firebase from "firebase";
import {Clip} from "../Core/Clip";

firebase.initializeApp({
    apiKey: "AIzaSyCy9qPjxwBgaFj3HWGWE6DqVdBZNeIaTvc",
    authDomain: "croudskill.firebaseapp.com",
    projectId: "croudskill",
    storageBucket: "croudskill.appspot.com",
    messagingSenderId: "406351603351",
    appId: "1:406351603351:web:ab5394242d49b272c9abd2",
    measurementId: "G-DZGQRTZMGQ",
});

const database = firebase.firestore();

const ctx: Worker = self as any; //eslint-disable-line

export const workerCode = async (event:MessageEvent) => {
    const videoId = event.data.videoId;
    const videoDoc = await database.collection("Content").doc(videoId).get();
    const clip = videoDoc.data() as Clip;
    const uploadedClip = clip;
    uploadedClip.creator = null;
    ctx.postMessage({clip: uploadedClip});

    const userDoc = await clip.creator.get();
    ctx.postMessage({user: JSON.stringify(userDoc.data())});
};

ctx.addEventListener("message", workerCode);
