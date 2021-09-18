// Third Party Imports
import axios from 'axios';
import mongo from 'mongodb';
import querystring from 'querystring';

let MongoClient = mongo.MongoClient;
let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) throw err;
    db = client.db('newTune');
});

export let spotifyClient = axios.create({baseURL: 'https://api.spotify.com/v1/'});

spotifyClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        
        axios.interceptors.response.eject(interceptor);

        const accessToken = error.response.config.headers.Authorization.substring(7);
        const user = await db.collection('users').findOne({accessToken: accessToken});

        return axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
              grant_type: 'refresh_token',
              refresh_token: user.refreshToken
            })
        }).then(async response => {
            const _result = await db.collection('users').updateOne(
                {refreshToken: user.refreshToken},  //TODO: Use a different property to find the user to update (two users use the same spotify account)
                {
                    $set: {
                        accessToken: response.data.access_token,
                    }
                }
            );
            error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
            return axios(error.response.config);
        }).catch(error => {
            console.log(error);
            console.log(error.response.config);
            return Promise.reject(error);
        }).finally(createAxiosResponseInterceptor);
    }
);
