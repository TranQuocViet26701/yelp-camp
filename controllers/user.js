const User = require('../models/user');

const renderRegisterForm = (req, res) => {
    res.render('users/register');
};

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcom to Yelp Camp');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        console.dir(err);
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

const renderLoginForm = (req, res) => {
    req.flash('error');
    res.render('users/login');
};

const login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

const logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logout successful');
    res.redirect('/');
};

module.exports = {
    renderRegisterForm,
    register,
    renderLoginForm,
    login,
    logout,
};
