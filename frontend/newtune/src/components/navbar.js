import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function NavigationBar(props) {
    return (
        <Navbar bg='primary' variant='dark'>
            <Container>
                <Navbar.Brand href='#home'>newTune</Navbar.Brand>
                <Nav>
                    <Nav.Link href='/logout'>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}