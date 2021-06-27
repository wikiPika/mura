import firebase from "firebase";
import {v4 as uuidv4} from "uuid"
import {Clip} from "../Core/Clip";
import Jimp from 'jimp';
//import User from "../Core/User";

firebase.initializeApp({
    apiKey: "AIzaSyCy9qPjxwBgaFj3HWGWE6DqVdBZNeIaTvc",
    authDomain: "croudskill.firebaseapp.com",
    projectId: "croudskill",
    storageBucket: "croudskill.appspot.com",
    messagingSenderId: "406351603351",
    appId: "1:406351603351:web:ab5394242d49b272c9abd2",
    measurementId: "G-DZGQRTZMGQ",
});

const storage = firebase.storage();
const database = firebase.firestore();

const ctx: Worker = self as any; //eslint-disable-line

export const workerCode = async (event:MessageEvent) => {
    switch(event.data.message) {
        case "validate":
            validateVideo(event.data.file);
            break;
        case "imageTask":
            await imageTask(event.data.file);
            break;
        case "upload":
            await uploadVid(event.data.userId, event.data.clip, event.data.videoFile, event.data.imageBuffer);
            break;
    }
};

const validateVideo = (file:File) => {
    if(file.size >= 100_000_000) {
        ctx.postMessage({error: "Video cannot be greater than 100 MB"});
        return;
    }
    ctx.postMessage({file: file});
}

const imageTask = async (file:File) => {
    if(file.size >= 1_000_000) {
        ctx.postMessage({error: "Image cannot be greater than 1 MB", message: "image"});
        return;
    }

    const image = await Jimp.read(await file.arrayBuffer() as Buffer);
    image.resize(200, 200);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    ctx.postMessage({ buffer: buffer, message: "image" });
}

const uploadVid = async (userId: string, clip:Clip, videoFile:File, imageBuffer: Buffer) => {

    const videoFileName = uuidv4() + videoFile.name.substring(videoFile.name.lastIndexOf('.'));
    const imageFileName = uuidv4() + ".jpg";
    const image = new Blob([imageBuffer], {type : "image/jpeg"});
    const ref = storage.ref();
    const videoRef = ref.child(`videos/${videoFileName}`);
    const imageRef = ref.child(`images/${imageFileName}`);
    ctx.postMessage({loading : 20});

    const t1 = videoRef.put(videoFile);
    const t2 = imageRef.put(image);

    const videoUser = database.collection("Users").doc(userId);
    clip.creator = videoUser;
    ctx.postMessage({loading : 30});

    await Promise.all([t1,t2]);
    clip.contentLink = await videoRef.getDownloadURL();
    clip.thumbnail = await imageRef.getDownloadURL();
    ctx.postMessage({loading : 50});

    const clipDoc = await database.collection("Content").add(clip);
    ctx.postMessage({loading: 75});
    await database.collection("Users").doc(videoUser.id).update({
        UserContent : firebase.firestore.FieldValue.arrayUnion(clipDoc)
    });
    ctx.postMessage({loading: 90});
    ctx.postMessage({message : "upload", clipId : clipDoc.id});
    ctx.postMessage({loading: 100});
};

ctx.addEventListener('message', event => workerCode(event));
