import React, {ChangeEvent, FormEvent, useRef, useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Worker from "worker-loader!../../workers/videoUpload.worker"; //eslint-disable-line
import getBlobDuration from 'get-blob-duration';
import {Clip} from "../../Core/Clip";
import {auth, firestore as database} from "../../App";
import "../../css/Drag-Drop-File-Input-Upload.css";
import "../../css/Drag--Drop-Upload-Form.css";
import "../../css/Footer-Clean.css";
import "../../css/styles.css";
import "@fontsource/josefin-sans";
import {Col, Row} from "react-bootstrap";
import wave from "../../img/wave5.svg";
import ProgressBar from "react-bootstrap/ProgressBar";

const worker = new Worker();

function Upload() {
    const videoInput = useRef<HTMLInputElement>(null);
    const imageInput = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState<Buffer>();

    const videoChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files)
            return;
        const file = event.target.files[0];
        worker.postMessage({ file: file, message: "validate" });
    };

    const thumbnailChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files)
            return;
        const file = event.target.files[0];
        worker.postMessage({file: file, message: "imageTask"})
    }

    const submit = async (event : FormEvent) => {
        const queryTask = (database.collection("Users")
            .where("username", "==", auth.currentUser!.email)
            .limit(1)
            .get());

        event.preventDefault();
        const inputVideo = videoInput.current!;

        let data:any = {};
        document.querySelectorAll("#upload-form input")
            .forEach((input) => {
                const userInput = input as HTMLInputElement;
                if(userInput.name === "")
                    return;
                data[userInput.name] = userInput.value;
            }
            );
        const clip = data as Clip;

        const user = await queryTask;
        worker.postMessage({message: "upload", userId: user.docs[0].id, clip: clip, videoFile: inputVideo.files![0], imageBuffer: image});
    }

    useEffect(() => {
        worker.onmessage = async (event) => {
            if (event.data.message) {

                if(event.data.message === "upload"){
                    window.location.href = `/view?id=${event.data.clipId}`;
                    return;
                }

                else if (event.data.message === "image") {
                    if (event.data.error) {
                        imageInput.current?.setCustomValidity("Image cannot be above 1 MB");
                        return;
                    } else {
                        imageInput.current?.setCustomValidity("");
                        setImage(event.data.buffer);
                        return;
                    }
                }
            }

            if(event.data.loading){
                setProgress(event.data.loading);
                return;
            }

            const input = videoInput.current;
            if (!event.data.error) {
                if (await getBlobDuration(
                    URL.createObjectURL(
                        new Blob([event.data.file], {type: event.data.file.type}))) > 300) {
                    input?.setCustomValidity("Video cannot be longer than 5 minutes");
                    return;
                } else {
                    input?.setCustomValidity("");
                }
            }
        };
    }, [worker]);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user == null && auth.currentUser == null)
                window.location.href = "/";
        })
    });

    return (
        <section className="d-flex flex-column justify-content-between" id="hero" style={{background: `url(${wave}) center / cover no-repeat, #ffffff`, fontFamily: '"Anonymous Pro", monospace', height: '100%'}}>
            <div id="top" style={{borderBottom: '1px solid rgba(0,0,0,0.21)'}}>
            </div>
            <div className="text-center" id="middle" style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 600, color: 'rgb(34,104,255)', width: 600, marginTop: 30}}>
                <Container style={{width: 600}}>
                    <Row>
                        <Col md={12}>
                            <h1 style={{textAlign: 'center', fontWeight: 800, fontSize: 50, color: '#303030', fontFamily: '"Josefin Sans", sans-serif', width: 500, height: 70, margin: 'auto'}}>Upload Media</h1>
                        </Col>
                    </Row>
                    <Row className="d-xl-flex justify-content-xl-center align-items-xl-center">
                        <Col md={12} className="d-xl-flex justify-content-xl-center align-items-xl-center">
                            <div className="d-xl-flex justify-content-xl-center align-items-xl-center" style={{width: 600}}>
                                <Form onSubmit={submit} className="text-left" id="change-form" style={{width: 600, margin: 'auto', textAlign: 'center'}}>
                                    <Form.Group style={{width: 600, margin: 'auto', marginTop: 10}}>
                                        <p style={{marginBottom: 0, fontWeight: 400, color: '#4f4f4f', fontFamily: '"Josefin Sans", sans-serif'}}>Title:</p><Form.Control className="form-control-lg" type="text" name="title" required minLength={5} maxLength={50}/>
                                    </Form.Group>
                                    <Form.Group className="files color" style={{marginTop: 20, width: 600}}>
                                        <p style={{marginBottom: 0, fontWeight: 400, color: '#4f4f4f', width: 500, fontFamily: '"Josefin Sans", sans-serif'}}>Video:</p><Form.Control ref={videoInput} onChange={videoChanged} className="form-control-file" type="file" required accept="video/*" style={{color: 'rgb(34,104,255)', fontFamily: '"Josefin Sans", sans-serif'}} />
                                        <p style={{color: '#303030', fontFamily: '"Josefin Sans", sans-serif', fontSize: 12, marginTop: 5}}>Videos can only be up to 100 MB and 5 minutes long.</p>
                                    </Form.Group>
                                    <Form.Group className="files color" style={{marginTop: 10, width: 600}}>
                                        <p style={{marginBottom: 0, fontWeight: 400, color: '#4f4f4f', width: 500, fontFamily: '"Josefin Sans", sans-serif'}}>Image:</p><Form.Control ref={imageInput} onChange={thumbnailChanged} className="form-control-file" type="file" required accept="image/*" style={{fontFamily: '"Josefin Sans", sans-serif', color: 'rgb(34,104,255)'}} />
                                        <p style={{color: '#303030', fontFamily: '"Josefin Sans", sans-serif', fontSize: 12, marginTop: 4}}>Images can only be up to 1 MB. They will be condensed to 200 x 200 if necessary.</p>
                                    </Form.Group>
                                    <Form.Group style={{width: 600, margin: 'auto', marginTop: 10}}>
                                        <p style={{marginBottom: 0, fontWeight: 400, color: '#4f4f4f', fontFamily: '"Josefin Sans", sans-serif'}}>Description (Optional):</p><Form.Control className="form-control" type="text" minLength={8} maxLength={200} name="desc" />
                                    </Form.Group>
                                    <Form.Group style={{width: 600, margin: 'auto', marginTop: 10}}>
                                        <p style={{marginBottom: 0, fontWeight: 400, color: '#4f4f4f', fontFamily: '"Josefin Sans", sans-serif'}}>Category:</p><input className="form-control" type="text" name="category" required />
                                        <p style={{color: '#303030', fontFamily: '"Josefin Sans", sans-serif', fontSize: 12, marginTop: 4}}>Specify the area(s) of expertise that your video showcases. Ex. Cooking</p>
                                    </Form.Group>
                                    <Form.Group>
                                        <div><ProgressBar className="d-flex" now={progress} label={`${progress}%`}/></div>
                                    </Form.Group>
                                    <Form.Group className="d-xl-flex justify-content-xl-center align-items-xl-center" style={{marginTop: 20, width: 600}}>
                                        <div><Button variant={"primary"} block data-bss-hover-animate="pulse" type="submit" style={{background: 'rgba(77,163,255,0)', borderRadius: 25, color: '#303030', border: '2px solid #303030', fontWeight: 800, fontSize: 18, width: 300, fontFamily: '"Josefin Sans", sans-serif'}}>Upload</Button></div>
                                    </Form.Group>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </section>

        /*
        <Container className="d-flex flex-grow-1" id="form-container">
            <Form id="upload-form" onSubmit={submit}>
                <Form.Group>
                    <h3>Upload a clip</h3>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control name="title" type="text" minLength={5} maxLength={50} required
                                  placeholder={"How to fold clothes"}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Video:</Form.Label>
                    <Form.Control type="file" accept="video/*" required onChange={videoChanged} ref={videoInput}/>
                    <Form.Text className={"text-muted"}>5 minutes max!</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Image:</Form.Label>
                    <Form.Control type="file" accept="image/*" required onChange={thumbnailChanged} ref={imageInput}/>
                    <Form.Text className={"text-muted"}>The thumbnail will be resized to 200x200</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description (optional):</Form.Label>
                    <Form.Control name="desc" type="text" minLength={8} maxLength={200}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Category:</Form.Label>
                    <Form.Control name="category" type="text" required/>
                    <Form.Text className={"text-muted"}>Specify what your clip teaches. Be as specific or broad as you like!</Form.Text>
                </Form.Group>

                <Form.Group className="d-flex justify-content-between">
                    <Button variant={"primary"} type={"submit"}>Submit</Button>
                    <Spinner id={"upload-spinner"} animation={"border"} className={"d-none"} ref={spinner}/>
                </Form.Group>
            </Form>
        </Container>
         */
    );
}

export default Upload;
