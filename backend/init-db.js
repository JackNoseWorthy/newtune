import mongo from 'mongodb';

let MongoClient = mongo.MongoClient;

const EMAIL_PATTERN = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
const PASSWORD_PATTERN = '[A-Za-z\\d@$!%*#?&]{8,}$'

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if(err) throw err;
    let db = client.db('newTune');

    //Delete any existing collections
    try{
        db.collection('users').drop();
        console.log('An old users collection was found and has been deleted');
    }catch{
        console.log('No existing users collection was found. Skipping...');
    }
    

    db.createCollection('users', {
        validator: { $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password', 'artists'],
            additionalProperties: false,
            properties: {
                _id: {bsonType: 'objectId'},
                email: {
                    bsonType: 'string',
                    pattern: EMAIL_PATTERN
                },
                password: {
                    bsonType: 'string',
                    pattern: PASSWORD_PATTERN
                },
                accessToken: {bsonType: 'string'},
                refreshToken: {bsonType: 'string'},
                dbToken: {bsonType: 'string'},
                artists: {
                    bsonType: [ 'array' ],
                    items: {
                        bsonType: 'string'
                    }
                }
            }
        }}
    });

    db.collection('users').createIndex({email: 1}, {unique: true});

    console.log('newTune database successfully provisioned');
});