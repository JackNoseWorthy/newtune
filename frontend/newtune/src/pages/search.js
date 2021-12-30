import axios from 'axios';
import React from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import ArtistCard from '../components/artist-card';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        let userArtists = [];
        if(this.props.location.state) {
            userArtists = this.props.location.state.artists;
        }
        this.state = {
            query: '',
            artists: [],
            currArtist: 0,
            userArtists: userArtists
        };
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.addArtist = this.addArtist.bind(this);
        this.deleteArtist = this.deleteArtist.bind(this);
        this.actionButton = this.actionButton.bind(this);
        this.search = this.search.bind(this);
        this.getArtist = this.getArtist.bind(this);
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
    }

    addArtist() {
        const mod = (a, b) => ((a % b) + b) % b;

        let artist = this.state.artists[mod(this.state.currArtist, this.state.artists.length)];
        axios({
            method: 'post',
            url: '/artist',
            data: {artist: artist.id}
        }).then((response) => {
            this.setState({userArtists: response.data.artists});
            console.log(this.state);
        });
    }

    deleteArtist() {
        const mod = (a, b) => ((a % b) + b) % b;

        let artist = this.state.artists[mod(this.state.currArtist, this.state.artists.length)];
        axios({
            method: 'delete',
            url: '/artist',
            data: {artist: artist.id}
        }).then((response) => {
            this.setState({userArtists: response.data.artists});
            console.log(this.state);
        });
    }

    actionButton() {
        const mod = (a, b) => ((a % b) + b) % b;

        let artist = this.state.artists[mod(this.state.currArtist, this.state.artists.length)];
        if(this.state.userArtists.includes(artist.id)){
            return (
                <Button variant='danger' onClick={this.deleteArtist}>Remove</Button>
            );
        }

        return (
            <Button variant='success' onClick={this.addArtist}>Add</Button>
        );
    }

    handleQueryChange(event) {
        this.setState({query: event.target.value});
    }

    search(event) {
        event.preventDefault();

        if(this.state.query){
            axios({
                method: 'get',
                url: '/search?artist=' + this.state.query,
            }).then((response) => {
                this.setState({artists: response.data.artists.items, currArtist: 0 })
            });
        }
    }

    right() {
        let curr = this.state.currArtist + 1;
        this.setState({currArtist: curr});
    }

    left() {
        let curr = this.state.currArtist - 1;
        this.setState({currArtist: curr});
    }

    getArtist() {
        if(!this.state.artists.length)
            return null;

        const mod = (a, b) => ((a % b) + b) % b;

        let artist = this.state.artists[mod(this.state.currArtist, this.state.artists.length)]
        let image = artist.images[0]
        let url = image ? image.url : '';

        return (
            <div className='flex-center'>
                <span type='button'><i className='arrow bi bi-arrow-left-circle' onClick={this.left}></i></span>
                <ArtistCard
                img={url}
                artist={artist.name}
                actionButton={this.actionButton}
                />
                <span type='button'><i className='arrow bi bi-arrow-right-circle' onClick={this.right}></i></span>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className='h-center'>
                    <div className='search-bar'>
                        <Form className='d-flex'>
                            <InputGroup>
                                <FormControl
                                type='search'
                                placeholder='Search'
                                className='me-2'
                                aria-label='Search'
                                onChange={this.handleQueryChange}
                                />
                            </InputGroup>
                            <Button variant='outline-success' type='submit' onClick={this.search}>Search</Button>
                        </Form>
                    </div>
                </div>
                <div className='h-center'>
                    {this.getArtist()}
                </div>
            </div>
        );
    }
}