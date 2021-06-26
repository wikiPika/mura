import React, {ChangeEvent, FormEvent, useRef, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import "../../css/upload.css";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Worker from "worker-loader!../../workers/videoUpload.worker"; //eslint-disable-line
import getBlobDuration from 'get-blob-duration';

function Upload() {
    const fileInput = useRef<HTMLInputElement>(null);
    const worker = useRef(new Worker());

    const videoChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files)
            return;
        worker.current.postMessage({ file: event.target.files[0], message: "validate" });
    };

    const submit = (event : FormEvent) => {
        const input = fileInput.current!;
        event.preventDefault();
        worker.current.postMessage({message: "upload", file: input.files![0]});
    }


    /*
    useEffect(() => {
        worker.current.onmessage = async (event) => {
            const input = fileInput.current;
            if(!event.data.error) {
                if(await getBlobDuration(event.data.file) > 300)
                    input?.setCustomValidity("Video cannot be longer than 5 minutes");
                else {
                    input?.setCustomValidity("");
                }
                return;
            }
            input?.setCustomValidity(event.data.error);
        };
    }, []);
     */


    return (
        <Container className="d-flex flex-grow-1" id="form-container">
            <Form id="upload-form" onSubmit={submit}>
                <Form.Group>
                    <h3>Upload a clip</h3>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type="text" minLength={5} maxLength={50} required
                                  placeholder={"How to fold clothes"}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Video:</Form.Label>
                    <Form.Control type="file" accept="video/*" required onChange={videoChanged} ref={fileInput}/>
                    <Form.Text className={"text-muted"}>5 minutes max!</Form.Text>
                    {/*<Form.Text className={"text-danger"}>{videoError}</Form.Text>*/}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description (optional):</Form.Label>
                    <Form.Control type="text" minLength={8} maxLength={200}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Category:</Form.Label>
                    <Form.Control type="text" required/>
                    <Form.Text className={"text-muted"}>Specify what your clip teaches. Be as specific or broad as you like!</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Button variant={"primary"} type={"submit"}>Submit</Button>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default Upload;
