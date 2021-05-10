exports.get404 = (req, res, next) => {
    res.status(404).render('errors/404', {
        pageTitle: 'Error 404'
    });
};

exports.get500 = (error, req, res, next) => {
    console.log(error);
    res.status(500).render('errors/500', {
        pageTitle: 'Error 500'
    });
};