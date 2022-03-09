const mongoose = require('mongoose');
const Review = require('./review');

const { Schema } = mongoose;

const ImageUrl = new Schema({
    url: String,
    filename: String,
});

ImageUrl.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_250');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
    {
        title: String,
        price: Number,
        images: [ImageUrl],
        description: String,
        location: String,
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
    },
    opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong><a href="/campgrounds/${
        this._id
    }">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async (data) => {
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews,
            },
        });
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
