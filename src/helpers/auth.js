const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error:msg', 'Debe Logearse primero');
    res.redirect('/');
}

module.exports = helpers;