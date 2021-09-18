// Local Imports
import { spotifyClient } from './spotify-client.js';

// Third Party Imports
import axios from 'axios';
import express from 'express';
import mongo from 'mongodb';
import session from 'express-session';
import querystring from 'querystring';

const CLIENT_ID = 'ea0c24e85e5445a6916390d0895c1232';
const CLIENT_SECRET = '0222cb8963424436b7dfdbb9c62f0e3a';
const REDIRECT_URI = 'http://localhost:3001/callback';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

let MongoClient = mongo.MongoClient;
let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) throw err;
    db = client.db('newTune');
});

let app = express();
app.use(express.json());
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: true,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60*60*1000
    }
}));

app.get('/callback', authResponse);
app.get('/search', getUser, search);

app.post('/login', login);
app.post('/logout', logout);
app.post('/sign-up', signUp);
app.post('/artist', addArtist);

app.delete('/artist', deleteArtist);

//
// Middleware
//

async function getUser(req, _res, next) {
    req.user = await db.collection('users').findOne({dbToken: req.session.token});
    next();
}

//
// Endpoints
//

async function login(req, res) {
    const token = generateToken();
    let result;
    try{
        result = await db.collection('users').updateOne(
            {email: req.body.email, password: req.body.password},
            {
                $set: {
                    dbToken: token
                }
            },
        );
    }catch(err) {
        res.status(500).send('Error querying db');
    }

    if(result.modifiedCount === 0){
        res.status(404).send('User not found');
    }else {
        req.session.token = token;
        req.session.save();
        let user = await db.collection('users').findOne({dbToken: req.session.token});
        res.status(200).send({artists: user.artists});
    }    
}

async function signUp(req, res) {
    try {
        let token = generateToken();
        let user = {
            email: req.body.email,
            password: req.body.password,
            dbToken: token,
            artists: []
        };

        const result = await db.collection('users').insertOne(user);
        req.session.token = token;
        res.sendStatus(204);

    }catch(err) {
        console.log(err);
        res.sendStatus(409);
    }
}

async function logout(req, res) {
    req.session.destroy();
    res.sendStatus(204);
}

async function authResponse(req, res) {
    /*
        Handles the auth response from spotify and retrieves the access and refresh tokens
    */ 
    let code = req.query.code;

    axios({
        method: 'post',
        url: TOKEN_URL,
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async (response) => {
        const result = await db.collection('users').updateOne(
            {dbToken: req.session.token},
            {
                $set: {
                    accessToken: response.data.access_token,
                    refreshToken: response.data.refresh_token
                }
            }
        );

        if(result.modifiedCount === 0) {
            res.status(404).send('user not found');
        }else{
            res.redirect('http://localhost:3000/search');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });

}

async function search(req, res) {
    if(!req.user) {
        res.sendStatus(401);
    }

    spotifyClient({
        method: 'get',
        url: `search?q=${req.query.artist}&type=artist`,
        headers: {
            Authorization: 'Bearer ' + req.user.accessToken
        }
    }).then((response) => {
        res.status(200).send(response.data);
    }).catch(() => {
        res.sendStatus(500);
    });

}

async function addArtist(req, res) {
    let user = await db.collection('users').findOneAndUpdate(
        {dbToken: req.session.token},
        {$addToSet: {artists: req.body.artist}},
        {returnDocument: 'after'}
    );
    console.log(user);
    res.status(200).send({artists: user.value.artists}); 
}

async function deleteArtist(req, res) {
    let user = await db.collection('users').findOneAndUpdate(
        {dbToken: req.session.token},
        {$pull : {artists: req.body.artist}},
        {returnDocument: 'after'}
    );
    res.status(200).send({artists: user.value.artists});
}

//
// Helpers
//

function generateToken() {
    return Math.random().toString(36).substr(2);
}

const server = app.listen(3001);
console.log('Server listening at http://localhost:3001');