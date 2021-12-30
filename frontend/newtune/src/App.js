import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

//Pages
import Login from './pages/login';
import Search from './pages/search';
import SignUp from './pages/sign-up';

//Components
import NavigationBar from './components/navbar';

const AUTH_URL = 'https://accounts.spotify.com/authorize'
const REDIRECT_URI = 'http://localhost:3001/callback'


const CLIENT_ID = 'ea0c24e85e5445a6916390d0895c1232'


export default function App() {
    return (
        <div>
            <NavigationBar/>
            <Router>
                <Route path='/login' component={Login}/>
                <Route path='/logout' component={() => {
                    axios({
                        method: 'post',
                        url: '/logout',
                    }).then(() => {
                        window.location.href = 'http://localhost:3000/login';
                    }).catch(() => {
                        window.location.href = 'http://localhost:3000/login';
                    });
                    return null;
                }}/>
                <Route path='/sign-up' component={SignUp}/>
                <Route path='/sign-up/spotify' component={() => {
                    const query = {
                        client_id: CLIENT_ID,
                        response_type: 'code',
                        redirect_uri: REDIRECT_URI
                    };
                    window.location.href = AUTH_URL + '?' + queryString.stringify(query);
                    return null;
                }}/>
                <Route path='/search' component={Search}/>
            </Router>
        </div>
    );
}