const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

const renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

const createCampground = async (req, res, next) => {
    const mapData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const c = new Campground(req.body.campground);
    c.geometry = mapData.body.features[0].geometry;
    c.author = req.user;
    c.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    await c.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${c._id}`);
};

const detailCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/detail', { campground });
};

const renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

// update campground
const updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    // add images
    const imgs = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    campground.images.push(...imgs);
    // delete images
    if (req.body.deleteImages) {
        req.body.deleteImages.forEach(async (filename) => {
            await cloudinary.uploader.destroy(filename);
        });
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};

module.exports = {
    index,
    renderNewForm,
    createCampground,
    detailCampground,
    renderEditForm,
    updateCampground,
    deleteCampground,
};
