const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campground');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// get all campgrounds, add new campground
router
    .route('/')
    .get(catchAsync(campground.index))
    .post(
        isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campground.createCampground)
    );

// create a new camground
router.get('/new', isLoggedIn, campground.renderNewForm);

// get detail campground, update campground, delete campground
router
    .route('/:id')
    .get(catchAsync(campground.detailCampground))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateCampground,
        catchAsync(campground.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

// render update campground form
router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campground.renderEditForm)
);

module.exports = router;
