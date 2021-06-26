import {Component} from "react";
import "../navigation.css";
import 'firebase/auth';
import "firebase/analytics";
import firebase from "firebase";
import {auth, firestore} from "../App"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap/dist/react-bootstrap.min.js"


//User is authenticated or not
interface INavState {
    isAuthenticated?: boolean
    loginMethod?: string
}

//Properties, so far none
interface INavProps {
}

export class Navigation extends Component<INavProps, INavState> {

    constructor(props: INavProps) {
        super(props);
        this.state = {
            isAuthenticated: false,
            loginMethod: undefined,
        }
        this.submitSearch = this.submitSearch.bind(this);
    }

    componentDidMount = () => {
        auth.onAuthStateChanged((user) => {
            console.log(user);
            this.setState({isAuthenticated: user != null});
        })
    }

    async addNewUser(Username: string) {
        const user = auth.currentUser!;
        await firestore.collection('Users').doc(user.email!).set({
            Username: user.displayName,
            followers: [],
            following: [],
            UserContent: [],
            pfpurl: user.photoURL,
        })
    }



    signInWithGoogle = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((account) => {
                    console.log("Logged in with Google");
                    let user = account.user;

                    auth.fetchSignInMethodsForEmail(user?.email!)
                        .then((arrayOfEmails) => {
                            if (!arrayOfEmails) {
                                console.log("ooh new user")
                                window.location.href = "/login";

                            } else {
                                console.log("this one smells")
                            }
                        })

                }, (error) => {
                    console.log(error);
                })
        })

        this.setState({
            loginMethod: "google",
            isAuthenticated: true,
        })
    }

    signOut = () => {
        firebase.auth().signOut().then((packet) => {
            console.log("Logout complete")
        });
        this.setState({
            loginMethod: undefined,
            isAuthenticated: false,
        })
    }

    submitSearch(event: any) {
        event.preventDefault();
        const search = document.querySelector("input[id='search-input']") as HTMLInputElement;
        window.location.href = '/marketplace?id=' + encodeURIComponent(search.value);
    }
}
