import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from 'react-bootstrap/FormControl';
import './component_notelist.css';
import { connect } from "react-redux";
import { updateNoteList, logout } from "../../redux/actions";
import Note from '../../model/note';
import { Redirect } from 'react-router-dom';

class NoteList extends React.PureComponent {

    constructor(props) {
        super(props);
        
        this.state = {
            showNoteCreationModal: false,
            redirectToEditNote: false,
            redirectToLogin: false,
            noteToBeModified: null
        }

        this.populateListOfNotes = this.populateListOfNotes.bind(this);
        this.activateNoteCreationModal = this.activateNoteCreationModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSave = this.onSave.bind(this);
        this.updateFirestoreNoteListAndRetrieveNoteID = this.updateFirestoreNoteListAndRetrieveNoteID.bind(this);
    }

    async deleteNoteFromFirestore(noteId) {
        const deletingNoteRef = window.firestore.collection('users')
            .doc(this.props.user.username)
            .collection('notes')
            .doc(noteId);
        return deletingNoteRef.delete();
    }

    deleteNote(noteId) {
        this.deleteNoteFromFirestore(noteId).then(() => {
            const updatedNoteList = this.props.noteList.filter(note => note.id !== noteId);
            this.props.updateNoteList({ updatedNoteList });
        });
    }

    populateListOfNotes() {
        return this.props.noteList.map(note => {
            return (
                <Container key={note.id} className="individual-note"
                    onClick={ () => this.setState({ noteToBeModified: note, redirectToEditNote: true }) }>
                    <Row>
                        <Col sm="9" >
                            <h2>{note.title}</h2>
                        </Col>
                        <Col className="buttonDeleteColumn">
                            <Button variant="danger" onClick={e => { e.stopPropagation(); this.deleteNote(note.id); }}>
                                Delete
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>{note.text}</p>
                        </Col>
                    </Row>
                </Container>
            );
        })
    }

    activateNoteCreationModal() {
        this.setState({ showNoteCreationModal: true });
    }

    onClose() {
        this.setState({ showNoteCreationModal: false });
    }

    async updateFirestoreNoteListAndRetrieveNoteID(noteTitle) {
        const database = window.firestore;
        const currentUserDocRef = database.collection('users').doc(this.props.user.username);
        const newNoteRef = await currentUserDocRef.collection('notes').add({
            title: noteTitle,
            text: ""
        });
        return newNoteRef.id;
    }

    onSave(newNoteName) {
        this.updateFirestoreNoteListAndRetrieveNoteID(newNoteName)
            .then(noteId => new Note(newNoteName, "", noteId))
            .then(newNote => {
                this.props.updateNoteList({ updatedNoteList: [newNote, ...this.props.noteList] });
                this.setState({  noteToBeModified: newNote, showNoteCreationModal: false, redirectToEditNote: true });
            });
    }

    render() {
        return (
            <>
                { this.state.redirectToEditNote ? <Redirect  to={ { pathname: "/edit", state: { noteBeingModified: this.state.noteToBeModified }} } /> : null }
                { this.state.redirectToLogin ? <Redirect to="/login" /> : null }
                <NewNoteModalComponent show={this.state.showNoteCreationModal}
                    onClose={this.onClose} onSave={this.onSave} />
                <Container>
                    <Row className="py-2">
                        <Col>
                            <Button variant="success" onClick={this.activateNoteCreationModal}>Create Note</Button>
                        </Col>
                        <Col>
                            <Button variant="outline-dark" onClick={() => {this.props.logout(); this.setState({ redirectToLogin: true })}}>
                                Logout
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-4">
                        <Col sm="6">
                            <Container className="notes-container">
                                <Row>
                                    <Col>
                                        {this.populateListOfNotes()}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

}

function NewNoteModalComponent(props) {
    const [newNoteName, setNewNoteName] = useState("");
    return(
        <Modal show={props.show} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Enter New Note's Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row style={{ marginTop: '13px' }}>
                        <Col>
                            <InputGroup>
                            <   FormControl as="input" onChange={(event) => setNewNoteName(event.target.value)}></FormControl>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '28px' }}>
                        <Col className="modalNewNoteButtonColumn">
                            <Button className="mx-1" variant="secondary" onClick={props.onClose}>Close</Button>
                            <Button className="mx-1" variant="success" onClick={() => props.onSave(newNoteName)}>Create New Note</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

const mapStateToProps = state => ({
    user: state.userState.user,
    noteList: state.noteListState.noteList
})

export default connect(mapStateToProps, { updateNoteList, logout })(NoteList);