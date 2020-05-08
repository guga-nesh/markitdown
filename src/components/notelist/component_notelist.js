import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './component_notelist.css';
import { connect } from "react-redux";
import { updateNoteList } from "../../redux/actions";

class NoteList extends React.PureComponent {

    constructor(props) {
        super(props);

        this.populateListOfNotes = this.populateListOfNotes.bind(this);
    }

    deleteNote(noteId) {
        const updatedNoteList = this.props.noteList.filter(note => note.id !== noteId);
        this.props.updateNoteList({ updatedNoteList })
    }

    populateListOfNotes() {
        return this.props.noteList.map(note => {
            return (
                <Container key={note.id} className="individual-note">
                    <Row>
                        <Col sm="9" >
                            <h2>{note.title}</h2>
                        </Col>
                        <Col className="buttonDeleteColumn">
                            <Button variant="danger" onClick={() => this.deleteNote(note.id)}>Delete</Button>
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

    render() {
        return (
            <Container>
                <Row className="py-2">
                    <Col>
                        <Button variant="success">Create Note</Button>
                    </Col>
                    <Col>
                        <Button variant="outline-dark">Logout</Button>
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
        );
    }

}

const mapStateToProps = state => ({
    noteList: state.noteList.noteList
})

export default connect(mapStateToProps, {updateNoteList})(NoteList);