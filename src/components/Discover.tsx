import React, {useState, useEffect} from "react";
import ViewVideo from "./Video/ViewVideo";

function Discover(props: DiscoverType) {

    useEffect(() => {
        console.log(props.db);
    }, [])

    return (
        <div className="d-flex flex-column flex-grow-1 align-content-center justify-content-center">
            Discover goes here.
            <br />
            You have come across a barren page.
            <br />
            <div style={{height: 1280, width: 720, maxHeight: 1280, maxWidth: 720}}>
                <ViewVideo />
            </div>
        </div>
    )
}

type DiscoverType = {
    db: Array<any>;
}

export default Discover;
