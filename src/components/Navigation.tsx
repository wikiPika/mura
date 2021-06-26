import React, {useState} from "react";
import {Button, Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
//import Autosuggest from "react-autosuggest";

type SuggestionType = {
    title: string,
    topic: string,
    subtopic: string,
}

function Navigation(props: NavProps) {

    const [search, setSearch] = useState<string>("");
    const [sug, setSug] = useState<SuggestionType | Array<SuggestionType>>([]);

    function fetchSugs() {

    }

    // based on search input, returns an array of suggestions from database
    function calculateSugs(input: string) {

        return {
            title: "testing",
            topic: "mental health",
            subtopic: "depression",
        }
    }

    // called when a suggestion is clicked to fill search value
    function getSugTitle(x: SuggestionType) {
        return x.title;
    }

    function renderSug(x: SuggestionType) {
        return (
            <div>
                {x.title}
            </div>
        )
    }

    function onSearchChange(event: any, newValue: string) {
        setSearch(newValue)
    }

    function onSugFetchReq(input: string) {
        setSug(calculateSugs(input))
    }

    function onSugClearReq(input: string) {
        setSug([])
    }



    return (
        <Navbar bg="light" expand="md">
            <Navbar.Brand href="#home" className="col-md-4">The Thing You Use to Learn Stuff (tm)
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Form className={"d-flex flex-grow-1 col-md-6"}>
                    {/*<FormControl type="text" placeholder="Find a topic!" className="mr-sm-2 w-75 align-self-center rounded-pill" />*/}
                    {/*<Autosuggest suggestions={sugs}
                                    onSuggestionsFetchRequested={onSugFetchReq}
                                    onSuggestionsClearRequested={onSugClearReq}
                                    getSuggestionValue={getSugTitle}
                                    renderSuggestion={renderSug}
                                    inputProps={{
                                        placeholder: "Learn about anything!",
                                        search,
                                        onChange={onSearchChange}

                                    }}

                    />*/}
                    <Button variant="outline-info" className={"rounded-pill"}>Search</Button>
                </Form>
                <Nav>
                    <div className="btn-group">
                        <Button variant="light" className="mr-sm-2 border-secondary rounded-pill">Upload</Button>
                        <Button variant="primary" className={"rounded-pill"}>Login</Button>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

type NavProps = {

}

export default Navigation;
