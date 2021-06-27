import {Component} from "react";
import {ItemProps} from "./ItemData";
import {Button, Form, FormGroup} from "react-bootstrap";
import {auth, firestore} from "../App"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap/dist/react-bootstrap.min.js"
import firebase from "firebase";


interface ImageData {
    imgUrl?: string
}

export default class CreateItem extends Component<ItemProps, ImageData> {
    constructor(props:ItemProps) {
        super(props);
        this.state = {
            imgUrl: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.renderImage = this.renderImage.bind(this);
    }

    async createItem(title: string, desc: string, contentLink: string, category: string, thumbnail: string){

        await firestore.collection("Content").doc().set({
            title: title,
            creator: auth.currentUser!.email,
            desc: desc,
            category: category,
            contentLink: contentLink,
            thumbnail: thumbnail,
            likes: 0
        })
    }

    async componentDidMount() {
        //Requires a logged in user
        auth.onAuthStateChanged(user => {
            if(user == null)
            {
                auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(
                    (success) => {console.log("Successfully logged in with Google")},
                    (error) => {console.log(error)}
                );
            }
        })
    }

    async onSubmit(event:any) {
        const link = document.querySelector("input[name='image']") as HTMLInputElement;
        const response = await fetch(link.value);
        if(!response.headers.get("Content-Type")?.startsWith("image"))
        {
            event.preventDefault();
            return;
        }

        const thumbnail = link.value;
        const title = (document.querySelector("input[name='title']") as HTMLInputElement).value;
        const desc = (document.querySelector("input[name='desc']") as HTMLInputElement).value;
        const category = ((document.querySelector("input[name='category']") as HTMLInputElement).value);
        const contentLink = ((document.querySelector("input[name='contentLink']") as HTMLInputElement).value);
        await this.createItem(title, desc, contentLink, category, thumbnail);
    }
      //    async createItem(title: string, desc: string, contentLink: string, category: string, thumbnail: string){


    async renderImage(event:any){
        //Test for a url
        //eslint-disable-next-line no-control-regex
        let url;
        try{
            url =  new URL(event.target.value);
        }
        catch(_){
            return;
        }
        this.setState({
            imgUrl : url.toString()
        });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} style={{alignContent: "center"}}>
                <h2>Create a new item</h2>
                <img id="present" width="200px" height="200px" src={this.state.imgUrl} alt="an image was supposed to be here"/>
                <FormGroup>
                    <label>Name:</label>
                    <input name="name" required/>
                </FormGroup>
                <FormGroup>
                    <label>Description:</label>
                    <input name="desc" required/>
                </FormGroup>
                <FormGroup>
                    <label>Cost:</label>
                    <input name="cost" type="decimal" required/>
                </FormGroup>
                <FormGroup>
                    <label>Image:</label>
                    <input name="image" type="url" onBlur={this.renderImage} required/>
                </FormGroup>
                <Button type="submit" variant="primary">Submit</Button>
            </Form>);
    }
}
