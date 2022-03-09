const express = require('express');
const router = express.Router({ mergeParams: true }); // option mergeParams: we can get param which is not in this file
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/review');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// post a review
router.post('/', isLoggedIn, validateReview, catchAsync(review.addReview));

// delete a review of a campground
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(review.deleteReview)
);

module.exports = router;
