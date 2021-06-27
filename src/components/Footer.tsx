import React from "react";
import "../css/Footer-Clean.css"

function Footer(props: FooterProps) {
    return (
        <div className="bg-light text-center py-2 text-black-50 footer-clean">
            © 2021 doinb hut. some rights reserved. <br />
            we haven't picked which ones yet, so check back later.
        </div>
    )
}

type FooterProps = {

}

export default Footer;
