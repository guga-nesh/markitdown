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
                    <Col className="d-flex justify-content-center" xs={{ span: 6, offset: 3}}>
                        <h1 style={{fontSize: 100}}>MarkItDown</h1>
                    </Col>
                </Row>
                <Row style={{marginTop: 60}}>
                    <Col className="d-flex justify-content-center" xs={{ span: 4, offset: 4}}>
                        <Button>Login with Google</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default LoginComponent;