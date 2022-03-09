const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection errror:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '620b63bdbf360f1d779f3698',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            price: randomPrice,
            images: [
                {
                    url: 'https://res.cloudinary.com/dilh6ijxi/image/upload/v1645247897/YelpCamp/yfwazk6imvaqrclg4vex.jpg',
                    filename: 'YelpCamp/yfwazk6imvaqrclg4vex',
                },
                {
                    url: 'https://res.cloudinary.com/dilh6ijxi/image/upload/v1645247900/YelpCamp/ymz07glbgz5uwz5nslzv.jpg',
                    filename: 'YelpCamp/ymz07glbgz5uwz5nslzv',
                },
            ],
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt sapiente eius sunt excepturi omnis laudantium laborum debitis, dolores, odit quisquam molestiae sed nulla voluptas architecto culpa quaerat suscipit quibusdam repudiandae!',
        });

        await c.save();
    }
};

seedDB().then(() => {
    db.close(); // mongoose.connection.close()
});
