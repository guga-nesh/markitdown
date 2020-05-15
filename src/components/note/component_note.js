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
import { updateNoteList } from '../../redux/actions';
import { Redirect, Prompt } from "react-router-dom";
import { connect } from "react-redux";

class NoteComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        
        this.state =  {
            title: props.location.state.noteBeingModified.title,
            text: props.location.state.noteBeingModified.text,

            backToNoteList: false,

            isBlocking: false
        }

        this.updateText = this.updateText.bind(this);
        this.saveCurrentNote = this.saveCurrentNote.bind(this);
    }

    updateText(event) {
        this.setState({ isBlocking: event.target.value !== this.props.location.state.noteBeingModified.text, text: event.target.value });
    }

    async updateCurrentNoteOnFirestore() {
        const currentNoteDocRef = window.firestore.collection('users')
            .doc(this.props.user.username)
            .collection('notes')
            .doc(this.props.location.state.noteBeingModified.id);
        return currentNoteDocRef.set({
            title: this.props.location.state.noteBeingModified.title,
            text: this.state.text
        });
    }

    saveCurrentNote() {
        this.updateCurrentNoteOnFirestore().then(() => {
            const updatedNote = new Note(this.props.location.state.noteBeingModified.title, this.state.text, this.props.location.state.noteBeingModified.id);
            this.props.updateNoteList({ updatedNoteList: [updatedNote, ...this.props.noteList.filter(note => note.id !== updatedNote.id)]});
            this.setState({ isBlocking: false });
        });
    }

    componentDidUpdate() {
        // Leaving this on Permanently at the moment till
        // route protection is implemented.
        window.onbeforeunload = () => true;
    }

    render(){
        return (
            <>
                <Prompt
                    when={this.state.isBlocking}
                    message={() => "There are unsaved changes to this note.\nAre you sure you wish to leave this page?"}
                />
                <Container fluid>
                    {this.state.backToNoteList ? <Redirect to="/home"/> : null}
                    <Row style={{marginTop: '70px'}} className="d-flex justify-content-center">
                        <Col>
                            <Button
                                onClick={() => this.setState({ backToNoteList: true },
                                    () => this.state.isBlocking ? this.setState({ backToNoteList: false }) : null )}
                            >
                                Back
                            </Button>
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
                                <NoteInput defaultValue={this.state.text} onChange={this.updateText} />
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
            </>
        );
    }

}

const mapStateToProps = state => ({
    user: state.userState.user,
    noteList: state.noteListState.noteList
})

export default connect(mapStateToProps, { updateNoteList })(NoteComponent);

class NoteInput extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.ARROW_KEYCODES = {
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40
        };

        this.QUOTATION_KEYCODES = {
            BACKTICK_KEYCODE: 192,
            QUOTATIONMARK_KEYCODE: 222
        };

        this.TAB_KEYCODE = 9;

        this.CHARACTERREMOVAL_KEYCODES = {
            BACKSPACE_KEYCODE: 8,
            DELETE_KEYCODE: 46
        };

        this.QUOTEESCAPE_KEYCODES = {
            END_KEYCODE: 35,
            HOME_KEYCODE: 36,
            ENTER_KEYCODE: 13,
            ESCAPE_KEYCODE: 27
        };

        this.TAB_SUBSTITUTION = '  ';

        this.state = {
            currentSelectorPosition: -1,
            startQuotePosition: -1,
            endQuotePosition: -1,
            quoteCharacter: null,
            isSelectorInQuote: false
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    resetQuotationRecognition() {
        this.setState({
            currentSelectorPosition: -1,
            startQuotePosition: -1,
            endQuotePosition: -1,
            quoteCharacter: null,
            isSelectorInQuote: false
        });
    };

    isTabKeyEvent(event) {
        return event.keyCode === this.TAB_KEYCODE;
    }

    isQuotationKeyEvent(event) {
        return Object.values(this.QUOTATION_KEYCODES)
        .reduce((accumulatedBoolean, currentValue) => accumulatedBoolean || currentValue === event.keyCode, false);
    }

    isArrowKeyEvent(event) {
        return Object.values(this.ARROW_KEYCODES)
            .reduce((accumulatedBoolean, currentValue) => accumulatedBoolean || currentValue === event.keyCode, false);
    }

    isCharacterRemovalKeyEvent(event) {
        return Object.values(this.CHARACTERREMOVAL_KEYCODES)
            .reduce((accumulatedBoolean, currentValue) => accumulatedBoolean || currentValue === event.keyCode, false);
    }

    isArrowMovementOutOfQuotation(event) {
        const isArrowMovingOutOfRightQuote = event.keyCode === this.ARROW_KEYCODES.RIGHT_ARROW
            && event.target.selectionStart === this.state.endQuotePosition;

        const isArrowMovingOutOfLeftQuote = event.keyCode === this.ARROW_KEYCODES.LEFT_ARROW
            && event.target.selectionStart === this.state.startQuotePosition + 1;
        
        return isArrowMovingOutOfRightQuote || isArrowMovingOutOfLeftQuote;
    }

    isInputOutOfQuotation(event) {
        return (event.target.selectionStart <= this.state.startQuotePosition || event.target.selectionStart > this.state.endQuotePosition || event.target.selectionEnd > this.state.endQuotePosition);
    }

    isQuoteEscapeKeyEvent(event) {
        return Object.values(this.QUOTATION_KEYCODES)
            .reduce((accumulatedBoolean, currentValue) => accumulatedBoolean || currentValue === event.keyCode, false);
    }

    handleKeyPress(event) {

        if (this.isTabKeyEvent(event)) {

            event.preventDefault();
            event = this.mutateTabKeyEvent(event);
            
        } else if (this.isQuotationKeyEvent(event)) {

            event = this.mutateQuotationKeyEvent(event);

        } else {

            if (this.state.isSelectorInQuote) {
                
                if (this.isCharacterRemovalKeyEvent(event)) {

                    this.setState({
                        currentSelectorPosition: event.target.selectionStart,
                        endQuotePosition: this.state.endQuotePosition - 1
                    });

                } else if (this.isQuoteEscapeKeyEvent(event)) {
                    
                    this.resetQuotationRecognition();
                    
                } else if (this.isArrowKeyEvent(event)) {

                    if (this.isArrowMovementOutOfQuotation(event)) {
                        
                        this.resetQuotationRecognition();

                    } else {

                        this.setState({
                            currentSelectorPosition: event.target.selectionStart
                        });

                    }

                } else if (this.isInputOutOfQuotation(event)) {
                    
                    this.resetQuotationRecognition();
                    
                } else {
                    
                    this.setState({
                        currentSelectorPosition: event.target.selectionStart,
                        endQuotePosition: this.state.endQuotePosition + 1
                    });

                }
                
            }
        }

        return event;
    }

    mutateTabKeyEvent(event) {

        if (this.state.isSelectorInQuote) {

            event.target.selectionStart = this.state.endQuotePosition + 1;
            event.target.selectionEnd = this.state.endQuotePosition + 1;
            this.resetQuotationRecognition();

        } else {

            const finalSelectorPosition = event.target.selectionStart + 2;
            event.target.value = this.getTextInsertedString(event.target.value, this.TAB_SUBSTITUTION, event.target.selectionStart);
            event.target.selectionStart = finalSelectorPosition;
            event.target.selectionEnd = finalSelectorPosition;
        }
        
        return event;
    }

    mutateQuotationKeyEvent(event) {
        
        if (this.state.isSelectorInQuote && this.state.quoteCharacter === event.key && event.target.selectionStart >= this.state.endQuotePosition) {

            event.preventDefault();
            event.target.selectionStart = event.target.selectionStart + 1
            event.target.selectionEnd = event.target.selectionStart + 1
            this.resetQuotationRecognition();

        } else {
            
            this.setState({
                currentSelectorPosition: event.target.selectionStart,
                startQuotePosition: event.target.selectionStart,
                endQuotePosition: event.target.selectionStart + 1,
                quoteCharacter: event.key,
                isSelectorInQuote: true
            });

            const finalSelectorPosition = event.target.selectionStart;
            event.target.value = this.getTextInsertedString(event.target.value, event.key, event.target.selectionStart);
            event.target.selectionStart = finalSelectorPosition;
            event.target.selectionEnd = finalSelectorPosition;

        }
        
        return event;
    }

    getTextInsertedString(currentString, stringToBeInserted, insertionLocation) {
        return currentString.substring(0, insertionLocation)
            + stringToBeInserted
            + currentString.substring(insertionLocation);
    }

    render() {
        return (
            <InputGroup>
                <FormControl as="textarea" className="p-4"
                    style={{height: '700px', resize: 'none'}}
                    onKeyDown={this.handleKeyPress}
                    {...this.props}>
                </FormControl>
            </InputGroup>
        );
    }
}