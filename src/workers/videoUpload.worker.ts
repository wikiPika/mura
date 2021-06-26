import { storage } from "../App";
import {v4 as uuidv4} from "uuid";

const ctx: Worker = self as any; //eslint-disable-line

export const workerCode = async (event:MessageEvent) => {
    switch(event.data.message) {
        case "validate":
            validateFile(event.data.file);
            break;
        case "upload":
            await uploadVid(event.data.file);
            break;
    }
};

const validateFile = (file:File) => {
    if(file.size >= 100_000_000) {
        ctx.postMessage({file : file, error: "Video cannot be greater than 100 MB"});
        return;
    }
    ctx.postMessage({file: file});
}

const uploadVid = async (file:File) => {
    const id = uuidv4();
    const fileType = file.name.substring(file.name.lastIndexOf('.'));
    const ref = storage.ref(`images/${id}.${fileType}`);
    await ref.put(file);
};

ctx.addEventListener('message', event => workerCode(event));
