const express = require('express');
const passport = require('passport');
const router = express.Router();
const user = require('../controllers/user');

const catchAsync = require('../utils/catchAsync');

// render register form, register
router
    .route('/register')
    .get(user.renderRegisterForm)
    .post(catchAsync(user.register));

// render login form, login
router
    .route('/login')
    .get(user.renderLoginForm)
    .post(
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        user.login
    );

// logout
router.get('/logout', user.logout);

module.exports = router;
