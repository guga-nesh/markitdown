import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './component_login.css';

class LoginComponent extends React.Component {

    render() {
        return(
            <Container className="login-container">
                <Row>
                    <Col className="d-flex justify-content-center" xs={{ span: 6, offset: 3 }}>
                        <h1 style={{ fontSize: 100 }}>MarkItDown</h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: 60 }}>
                    <Col className="d-flex justify-content-center" xs={{ span: 4, offset: 4 }}>
                        <Button onClick={() => this.loginWithGoogle()}>Login with Google</Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    loginWithGoogle() {
        console.log("Jere")
        const firebase = window.firebase
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
            "login_hint": "user@example.com"
        });
        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log("SUCCESS")
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
          }).catch(function(error) {
            console.log("NOT SUCCESS")
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }
}

export default LoginComponent;