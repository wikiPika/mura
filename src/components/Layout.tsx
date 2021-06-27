import React, {useState, useEffect} from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import {Container} from "react-bootstrap";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

function checkHref() {
    if (window.location.href === "http://localhost:3000/upload" || window.location.href === "http://localhost:3000/"
    || window.location.href === "http://99.34.109.26:8000/upload" || window.location.href === "http://99.34.109.26:8000/") {
        return true;
    }
    return false;
}

function Layout(props: LayoutProps) {
    return (
        <React.Fragment>
            <Navigation bubbleUpSugs={props.setDb}/>
            {props.children}
            <Footer />
        </React.Fragment>
    );
}

type LayoutProps = {
    children: JSX.Element | Array<JSX.Element>,
    setDb: Function;
}

export default Layout;
