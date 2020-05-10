import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Note from '../../model/note';
import User from '../../model/user';
import { login, updateNoteList } from '../../redux/actions';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import './component_login.css';

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertTitle: "",
            alertMessage: "",
            alertVariant: "",
            showAlert: false
        }

        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.getUserDocument = this.getUserDocument.bind(this);
    }

    render() {

        if (this.props.user !== null) {
            return <Redirect to="/home" />;
        }

        return(
            <Container className="login-container">
                <Row>
                    <Col>
                    <Alert show={ this.state.showAlert } variant={ this.state.alertVariant }>
                        <Alert.Heading>{ this.state.alertTitle }</Alert.Heading>
                        <p>
                            { this.state.alertMessage }
                        </p>
                    </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center" xs={{ span: 6, offset: 3 }}>
                        <h1 style={{ fontSize: 100 }}>MarkItDown</h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: 60 }}>
                    <Col className="d-flex justify-content-center" xs={{ span: 4, offset: 4 }}>
                        <Button onClick={ this.loginWithGoogle }>Login with Google</Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    loginWithGoogle() {
        const firebase = window.firebase
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
            "login_hint": "user@example.com"
        });
        var context = this;
        firebase.auth().signInWithPopup(provider).then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            // var user = result.user;
            // context.props.login({ user: user });
            return result.user;
            // ...
        }).then(user => {
            this.handleSuccess(user);
        }).catch(function(error) {
            // Handle Errors here.
            // var errorCode = error.code;
            var errorMessage = error.message;
            context.handleError(errorMessage);
            setTimeout(context.closeAlert, 7000);
            // The email of the user's account used.
            // var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            // ...
        });
    }

    async getUserDocument(username) {
        const userCollectionRef = window.firestore.collection('users');
        const existingDocument = await userCollectionRef.doc(username).get();
        return existingDocument;
    }

    async setupAndRetrieveNewUserData(username, displayName) {
        const userCollectionRef = window.firestore.collection('users');
        await userCollectionRef.doc(username).set({
            displayName: displayName
        });
        const newUserDocument = await userCollectionRef.doc(username).get();
        return newUserDocument;
    }

    async getUserNotesDocs(username) {
        return window.firestore.collection('users').doc(username).collection('notes').get()
            .then(collectionSnapshot => collectionSnapshot);
    }

    handleSuccess(user) {
        const username = user.email.split("@")[0];
        this.getUserDocument(username).then(
            userDocument => {
                if (!userDocument.exists) {
                    this.setupAndRetrieveNewUserData(username, user.displayName).then((newUserDocument) => {
                        this.props.login({ user: new User(newUserDocument.id, newUserDocument.data().displayName) });
                    });
                } else {
                    this.getUserNotesDocs(username).then(userNotesDocs => {
                        if (!userNotesDocs.empty) {
                            const listOfNotes = userNotesDocs.docs.map(doc => {
                                return new Note(doc.data().title, doc.data().text, doc.id);
                            });
                            this.props.updateNoteList({ updatedNoteList: listOfNotes });
                        }
                        this.props.login({ user: new User(userDocument.id, userDocument.data().displayName) });
                    })
                }
            }
        );
    }

    handleError(message) {
        var errorTitle = ""
        var errorMessage = ""
        if (message.includes("cookies")) {
            errorTitle = "Oops, there's an error!"
            errorMessage = "It seems that you have 3rd Party Cookies Disabled on your Browser. " +
            "For a Google-Sign In to work, that must be enabled.";
        } else {
            errorTitle = "UnHandled Error!"
            errorMessage = message;
        }
        this.setState({
            alertTitle: errorTitle,
            alertMessage: errorMessage,
            alertVariant: "danger",
            showAlert: true
        })
    }

    closeAlert() {
        this.setState({
            showAlert: false
        });
    }
}

const mapStateToProps = state => ({ user: state.userState.user })

export default connect(mapStateToProps, { login, updateNoteList })(LoginComponent);