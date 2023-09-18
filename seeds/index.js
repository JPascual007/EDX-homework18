const connection = require('../config/connection');
const { User, Thought } = require('../models');
const userSeed = require('./userSeed');
const thoughtSeed = require('../seeds/thoughtSeed');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    //Dropping existing db
    let usersCheck = await connection.db.listCollections({name: 'user'}).toArray();
    if(usersCheck.length){ await connection.dropCollection('user') };

    let thoughtsCheck = await connection.db.listCollections({name: 'thought'}).toArray();
    if(thoughtsCheck.length){ await connection.dropCollection('thought') }

    // Creating db
    await User.collection.insertMany(userSeed);
    await Thought.collection.insertMany(thoughtSeed);

    //Show tables
    console.table(userSeed);
    console.table(thoughtSeed);
    console.info('Seeds planted! 🌱');
    process.exit(0);
});