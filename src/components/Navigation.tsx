import React, {useState, useEffect} from "react";
import {Button, Form, Nav, Navbar, DropdownButton, Badge} from "react-bootstrap";
import {auth, firestore} from "../App";
import Autosuggest from "react-autosuggest";
import firebase from "firebase";
import DropdownItem from "react-bootstrap/DropdownItem";
import "../css/navigation.css";
import "../css/sidebar.css";
import "aos/dist/aos.css";
import {FaSearch} from "react-icons/all";
import MuraBanner from "../img/Mura.png";

type SuggestionType = {
    creator: string,
    title: string,
    category: string,
    desc: string,
    contentLink: string,
    thumbnail: string,
}

function Navigation(props: NavProps) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [sug, setSug] = useState<Array<any> | any>([]);
    const [sugDb, setSugDb] = useState<Array<any> | any>([]);

    async function fetchSugs() {
        let objs: object[] = [];

        let snapshot = await firestore.collection("Content").get();

        snapshot.forEach(doc => {
            let data = doc.data();
            objs.push({
                creator: data.creator,
                title: data.title,
                category: data.category,
                desc: data.desc,
                contentLink: data.contentLink,
                thumbnail: data.thumbnail,
            })
        })

        setSugDb(objs);
    }

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(async (account) => {
                console.log("Logged in with Google");
                let user = account.user;
                if(account.additionalUserInfo?.isNewUser){
                    console.log("Running adding new user")
                    await firestore.collection("Users").add({
                        username: user!.email,
                        pfpurl: user!.photoURL,
                        bio: "",
                        followers: [],
                        following: []
                    });
                }
            }, (error) => {
                console.log(error);
            });
    }

    // based on search input, returns an array of suggestions from database
    // @ts-ignore
    function calculateSugs(input: string): Array<SuggestionType> {
        let match: any[] = [];
        let clonedDb: any[] = [];

        for (let doc of sugDb) {
            clonedDb.push({
                creator: doc.creator,
                title: doc.title,
                category: doc.category,
                desc: doc.desc,
                contentLink: doc.contentLink,
                thumbnail: doc.thumbnail,
            })
        }

        let arrInput: string[] = scrub(input);
        let arrCreator: string[] = [];
        let arrCategory: string[] = [];
        let arrDesc: string[] = [];

        arrInput.forEach(el => {
            if (el.charAt(0) === "@") arrCreator.push(el.substring(1));
            else if (el.charAt(0) === "#") arrCategory.push(el.substring(1));
            else arrDesc.push(el);
        });

        let data;

        for (let doc of clonedDb) {
            let score = 0;

            getCreatorName(doc.creator).then((x) => {
                // @ts-ignore
                data = x.data();
                // @ts-ignore
                score += 4 * similarity (arrCreator, data.Username);
                // @ts-ignore
                doc["author"] = data.Username;
            })

            score += 2 * similarity(arrCategory, scrub(doc.category));
            score += 1 * similarity(arrDesc, scrub(doc.title));
            score += 1 * similarity(arrDesc, scrub(doc.desc));

            doc["score"] = score;
            if (score > 0) match.push(doc)
        }
        return match.sort((a, b) => Math.sign(a.score - b.score)).slice(0, 10);
    }

    async function getCreatorName(reference: any) {
        let name: string = "";
        return await firestore.collection("Users").doc(reference.id).get();
    }

    function scrub(input: string): Array<string> {
        if (input == undefined || input === "") return [""];
        return input.trim().toLowerCase().replace(/[.,\/!$%\^&\*;:{?}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ");
    }

    function similarity(arrA: Array<string>, arrB: Array<string>) {
        return arrA.filter(i => arrB.indexOf(i) >= 0).length
    }

    // called when a suggestion is clicked to fill search value
    // @ts-ignore
    function getSugTitle(x) {
        return x.title;
    }

    // @ts-ignore
    function renderSug(x, {query, isHighlighted}) {
        return (
            <div className="justify-content-between">
                <div className="d-flex flex-grow-1">
                    {x.title}
                </div>
                <div className="d-flex flex-grow-1">
                {
                    (x.author != undefined && x.author !== "") ?
                        <Badge variant="info" className="mr-sm-2" style={{fontWeight: "normal"}}>@{x.author}</Badge>
                        :
                        <React.Fragment />
                }
                {
                    (x.category != undefined && x.category !== "") ?
                        <Badge variant="primary" style={{fontWeight: "normal"}}>#{x.category}</Badge>
                        :
                        <React.Fragment />
                }
                </div>
            </div>
        )
    }

    // @ts-ignore
    function onSearchChange(event, {newValue, method}) {
        setSearch(newValue)
        if (method === "enter" || method === "click") {
            window.location.href = "/discover/?url=" + calculateSugs(search)[0].contentLink.substring(8);
            props.bubbleUpSugs(sug);
        }
    }

    // @ts-ignore
    function onSugFetchReq({value, reason}) {
        setSug(calculateSugs(value as string))
        props.bubbleUpSugs(sug)
    }

    function onSugClearReq() {
        setSug([])
    }

    useEffect(() => {
        setAuthenticated(auth.currentUser != null);
        auth.onAuthStateChanged((user) => {
            setAuthenticated(user?.uid != null);
        })
    }, []);

    useEffect(() => {
        let initialTime = Date.now();
        fetchSugs().then(
            () => {
                console.log(`Firestore content caching complete. (${Date.now() - initialTime}ms)`)
            }
        );
    }, [])

    useEffect(() => {
        setAuthenticated(auth.currentUser != null);
    })

    return (
        <Navbar bg="light" expand="md">
            <Navbar.Brand className="col-md-4"><a href="/"><img src={MuraBanner} style={{
                maxHeight: "38px",
                width: "auto",
            }}/></a></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Form className={"d-flex flex-grow-1 align-middle col-md-6"}>
                    <Autosuggest
                                 suggestions={sug}
                                 onSuggestionsFetchRequested={onSugFetchReq}
                                 onSuggestionsClearRequested={onSugClearReq}
                                 getSuggestionValue={getSugTitle}
                                 renderSuggestion={renderSug}
                                 inputProps={{
                                     placeholder: "Learn something new!",
                                     value: search,
                                     onChange: onSearchChange,
                                 }}
                                 theme={{
                                     container: "search-container align-self-center w-75 autoContainer",
                                     suggestionsContainerOpen: "autoSuggestionContainerOpen",
                                     suggestion: "autoSuggestion",
                                     suggestionHighlighted: "autoSuggestionHighlighted",
                                     suggestionsList: "autoSuggestionsList",
                                     input: "inputBar w-100",
                                     inputOpen: "inputBar w-100",
                                     inputFocused: "inputBar w-100",
                                 }}

                    />
                    <Button className="gradient3" data-bss-hover-animate="pulse" style={{width: 57, height: 38, borderRadius: "0px 8px 8px 0px", margin: "0px 0px 0px -1px", padding: "0px", borderWidth: "1px 1px 1px 0px", borderStyle: "solid", borderColor: "gray"}} onClick={() => {
                        window.location.href = "/discover/?url=" + calculateSugs(search)[0].contentLink.substring(8);
                    }}><FaSearch color="white" className="hovering" style={{zIndex: 200}}/></Button>
                </Form>
                <Nav>
                    <div className="btn-group">
                        <Button variant="light" className="nav-link d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center mr-sm-2" data-bss-hover-animate="pulse" href="#" style={{width: 100, borderRadius: 10, paddingTop: 12, fontFamily: '"Josefin Sans", sans-serif', color: 'rgb(0,0,0)', fontSize: 16, fontWeight: 400}} onClick={() => window.location.href = "/discover"}>Discover</Button>
                        <Button variant="light" className="nav-link d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center mr-sm-2" data-bss-hover-animate="pulse" href="#" style={{width: 100, borderRadius: 10, paddingTop: 12, fontFamily: '"Josefin Sans", sans-serif', color: 'rgb(0,0,0)', fontSize: 16, fontWeight: 400}} onClick={() => window.location.href = "/profile"}>Profile</Button>
                        <Button variant="light" className="nav-link d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center mr-sm-2" data-bss-hover-animate="pulse" href="#" style={{width: 100, borderRadius: 10, paddingTop: 12, fontFamily: '"Josefin Sans", sans-serif', color: 'rgb(0,0,0)', fontSize: 16, fontWeight: 400}} onClick={() => window.location.href = "/upload"}>Upload</Button>
                        {
                            isAuthenticated
                            ?
                            <Button variant="light" className="gradient1 sidebarItem d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center" data-bss-hover-animate="pulse" href="#" style={{fontSize: 16, fontFamily: '"Josefin Sans", sans-serif', width: 100, borderRadius: 10, paddingTop: 10, fontWeight: 300, color: "#fff"}} onClick={() => {auth.signOut()}}>Sign Out</Button>
                            :
                            <Button variant="light" className="gradient3 sidebarItem d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center" data-bss-hover-animate="pulse" href="#" style={{fontSize: 16, fontFamily: '"Josefin Sans", sans-serif', width: 100, borderRadius: 10, paddingTop: 10, fontWeight: 300, color: "#fff"}} onClick={signInWithGoogle}>Login</Button>
                        }
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

type NavProps = {
    bubbleUpSugs: Function;
}

export default Navigation;
