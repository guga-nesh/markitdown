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
import { updateNote } from '../../redux/actions';
import { connect } from "react-redux";

class NoteComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        
        this.state =  {
            title: props.currentNote.title,
            text: props.currentNote.text
        }

        this.updateText = this.updateText.bind(this);
        this.saveCurrentNote = this.saveCurrentNote.bind(this);
    }

    updateText(event) {
        this.setState({ text: event.target.value });
    }

    saveCurrentNote() {
        const updatedNote = Note.getTextUpdatedNote(this.props.currentNote, this.state.text);
        this.props.updateNote({ noteBeingModified: updatedNote });
    }

    render(){
        return (
            <Container fluid>

                <Row style={{marginTop: '70px'}} className="d-flex justify-content-center">
                    
                    <Col>

                        <Button>Back</Button>

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
    currentNote: state.noteBeingModified
})

export default connect(mapStateToProps, { updateNote })(NoteComponent);