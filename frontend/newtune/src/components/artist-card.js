import React from 'react';
import { Card } from 'react-bootstrap';

export default function ArtistCard(props) {
    return (
        <Card style={{ width: '40%', display: 'inline-block' }}>
            <Card.Img variant='top' src={props.img}/>
            <Card.Body>
                <div className='h-center'>
                    <Card.Title>{props.artist}</Card.Title>
                </div>
                <div className='h-center'>
                    {props.actionButton()}
                </div>
            </Card.Body>
        </Card>
    );
}