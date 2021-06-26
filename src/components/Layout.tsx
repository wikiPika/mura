import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

function Layout(props: LayoutProps) {
    return (
        <React.Fragment>
            <Navigation />
            {props.children}
            <Footer />
        </React.Fragment>
    );
}

type LayoutProps = {
    children: JSX.Element | Array<JSX.Element>,
}

export default Layout;
