// Local Imports
import { spotifyClient } from './spotify-client.js';

// Third Party Imports
import cron from 'node-cron';
import mongo from 'mongodb';
import nodemailer from 'nodemailer';

const EMAIL = 'newtune.noreply@gmail.com';
const PASSWORD = '1V3uu+un3';

let MongoClient = mongo.MongoClient;
let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) throw err;
    db = client.db('newTune');
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});

cron.schedule('59 11 * * 7', async function sendEmails(req, res) {
    users = await db.collection('users').find().toArray();

    for(let user of users) {
        albums = await newUserAlbums(user);
        if(albums) {
            sendEmail(user, albums);
        }
    }
});

async function newUserAlbums(user) {
    let artists = user.artists;
    let newAlbums = [];
    for(let artist of artists) {
        let albums = await newArtistAlbums(artist, user.accessToken);
        newAlbums = newAlbums.concat(albums);
    }
    return newAlbums;
}

async function newArtistAlbums(artist, token) {

    let offset = 0;
    let numEntities = -1;
    let albums = [];
    
    while(numEntities === -1 || offset < numEntities){

        response = await spotifyClient({
            method: 'get',
            url: `artists/${artist}/albums?offset=${offset}&limit=50`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        albums = albums.concat(response.data.items);

        offset += 50;
        numEntities = response.data.total;
    }
    
    let d = new Date();
    d.setDate(d.getDate()-7);

    let recentAlbums = albums.filter((el) => {
        releaseDate = new Date(el.release_date);
        return releaseDate >= d && !(el.album_group === 'appears_on' && el.album_type === 'compilation');
    });

    return recentAlbums;
}

function sendEmail(user, albums) {

    const email = user.email;
    let text = 'Here are the new songs by your favourite artists from the last week:\n';

    for(let album of albums) {
        let artists = '';
        for(let artist of album.artists) {
            if(artists.length) {
                artists += ', ';
            }
            artists += artist.name;
        }
        text += ' - ' + album.name + ' by '+ artists + ': ' + album.external_urls.spotify + '\n';
    }


    let mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'newTune: new songs available',
        text: text
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err);
        }else {
            console.log('Email sent: ' + info.response);
        }
    });
}

console.log("Running new music cron job");
