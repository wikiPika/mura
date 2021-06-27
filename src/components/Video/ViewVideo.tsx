import React, {useEffect, useState, useRef} from "react";
import {useLocation} from "react-router-dom";
import Worker from "worker-loader!../../workers/videoLoader.worker"; //eslint-disable-line
import {Clip} from "../../Core/Clip";

const worker = new Worker();

export default function ViewVideo() {
    const location = useLocation();
    const [id, setId] = useState<string>();
    const [user, setUser] = useState();
    const [clip, setClip] = useState<Clip>();
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const search = new URLSearchParams(location.search);
        const id = search.get("url");
        console.log(id)
        if(!id)
            window.location.href = "/";
        setId(id!);
    }, [location.search]);

    useEffect(() => {
        video.current!.load();
        worker.onmessage = (event:MessageEvent) => {
            if (event.data.clip) {
                setClip(event.data.clip as Clip);
            }
            else if (event.data.user) {
                setUser(JSON.parse(event.data.user));
            }
            else
                window.location.href = "/";
        };

    });

    useEffect(() => {
        if(!id)
            return;
        worker.postMessage({videoId : id});
    }, [id]);


    return (
        <div>
            <video title={"Clip video"} width={"100%"} height={"50%"} ref={video} controls>
                <source src={clip?.contentLink}/>
            </video>
        </div>
    )
}
