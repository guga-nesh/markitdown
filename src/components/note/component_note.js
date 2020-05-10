import "./component_note.css";
import React from 'react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from 'react-bootstrap/FormControl';
import ReactMarkdown from 'react-markdown';
import Note from '../../model/note';
import { updateNoteBeingModified, updateNoteList } from '../../redux/actions';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class NoteComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        
        this.state =  {
            title: props.currentNote.title,
            text: props.currentNote.text,

            backToNoteList: false
        }

        this.updateText = this.updateText.bind(this);
        this.saveCurrentNote = this.saveCurrentNote.bind(this);
    }

    updateText(event) {
        this.setState({ text: event.target.value });
    }

    async updateCurrentNoteOnFirestore() {
        const currentNoteDocRef = window.firestore.collection('users')
            .doc(this.props.user.username)
            .collection('notes')
            .doc(this.props.currentNote.id);
        return currentNoteDocRef.set({
            title: this.props.currentNote.title,
            text: this.state.text
        });
    }

    saveCurrentNote() {
        this.updateCurrentNoteOnFirestore().then(() => {
            const updatedNote = new Note(this.props.currentNote.title, this.state.text, this.props.currentNote.id);
            this.props.updateNoteBeingModified({ noteBeingModified: updatedNote });
            this.props.updateNoteList({ updatedNoteList: [updatedNote, ...this.props.noteList.filter(note => note.id !== updatedNote.id)]});
        });
    }

    render(){
        return (
            <Container fluid>
                {this.state.backToNoteList ? <Redirect to="/home"/> : null}
                <Row style={{marginTop: '70px'}} className="d-flex justify-content-center">
                    <Col>
                        <Button
                            onClick={() => { this.setState({ backToNoteList: true });
                                this.props.updateNoteBeingModified({ noteBeingModified: null }) }}>Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <h1>
                            {this.state.title}
                        </h1>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-start">
                        <Button variant="success" onClick={this.saveCurrentNote}>Save</Button>
                    </Col>
                </Row>
                <Row className="mt-4" style={{padding: '100px'}}>
                    <Col>
                        <InputGroup>
                            <FormControl as="textarea" defaultValue={this.state.text} className="p-4"
                             style={{height: '700px', resize: 'none'}} onChange={this.updateText}>
                            </FormControl>
                        </InputGroup>
                    </Col>
                    <Col xs={{ span: 1 }} className="d-flex align-items-center justify-content-center">
                        <h3>---></h3>
                    </Col>
                    <Col className="border-red">
                        <InputGroup>
                                <ReactMarkdown className="p-4" style={{height: '700px', resize: 'none', objectFit: 'cover'}}
                                 source={this.state.text}></ReactMarkdown>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        );
    }

}

const mapStateToProps = state => ({
    user: state.userState.user,
    noteList: state.noteListState.noteList,
    currentNote: state.noteBeingModifiedState.noteBeingModified
})

export default connect(mapStateToProps, { updateNoteBeingModified, updateNoteList })(NoteComponent);