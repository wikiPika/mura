import React, {useState, useEffect} from "react";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/home.css"
import "../css/sidebar.css"
import {Button, Carousel} from "react-bootstrap";

function Home() {
    return (
        <div className="row d-flex flex-grow-1 align-content-center justify-content-center">
            <Carousel className="carouselX">
                <Carousel.Item className="carouselX">
                    <img
                        className="d-block w-100 carouselImage"
                        src="https://wallpapercave.com/wp/wp2034926.jpg"
                    />
                    <Carousel.Caption>
                        <h3 className="textOutline h3-font">Learning, re-reimagined.</h3>
                        <p className="textOutline p-font">Dare to know the world's boundless secrets.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className="carouselX">
                    <img
                        className="d-block w-100 carouselImage"
                        src="https://i.imgur.com/OnOg2JJ.png"
                    />

                    <Carousel.Caption>
                        <h3 className="textOutline h3-font">Discover your talents.</h3>
                        <p className="textOutline p-font">In every human lies infinite untapped potential.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className="carouselX">
                    <img
                        className="d-block w-100 carouselImage"
                        src="https://media.wonderlandmagazine.com/uploads/2019/09/TAKE-CENTRE-STAGE-LOST-VILLAGE-2019-ANDREW-WHITTON-04540.jpg"
                    />
                    <Carousel.Caption>
                        <h3 className="textOutline h3-font">Share your wisdom.</h3>
                        <p className="textOutline p-font">It takes a village to raise a child; a country to raise a man.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div className="jumbotron jumbotron-fluid w-100 jumbo">
                <div className="container position-relative">
                    <h3 className="display-4">Learn with Mura.</h3>
                    <p className="lead">Created by four incredibly intelligent creatures.</p>
                    <div className="d-inline align-content-end justify-content-center" style={{position: "absolute", top: "-3%", left: "70%",}}>
                        <li><b>David Mun</b> (Frontend)</li>
                        <li><b>Jackie Liu</b> (Frontend)</li>
                        <li><b>Tymur Arsentiev</b> (Backend)</li>
                        <li><b>Lawrence Zhang</b> (Backend)</li>
                    </div>
                    <div className="d-inline d-flex align-content-center justify-content-center">
                        <Button className="gradient3 nav-link d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center" data-bss-hover-animate="pulse" href="#" style={{color: '#ffffff', fontSize: 30, fontFamily: '"Josefin Sans", sans-serif', width: "calc(200px + 10vmin)", borderRadius: 10, paddingTop: 12, fontWeight: 'bold', margin: "45px 0px 0px 0px", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000"}} onClick={() => window.location.href = "/discover"}>Discover</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Home;
