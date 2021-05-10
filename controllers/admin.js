const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid');

const User = require('../models/user');
const Tip = require('../models/tip');
const ProfitTable = require('../models/profit-table');

const transporter = nodemailer.createTransport(sendgrid({
    apiKey: process.env.SENDGRID_API_KEY
}));

exports.getPanel = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.render('admin/panel-login', {
            pageTitle: 'Panel Login'
        });
    }
    res.render('admin/panel', {
        pageTitle: 'Panel'
    });
};

exports.postPanelLogin = (req, res, next) => {
    if (req.body.token === process.env.PANEL_TOKEN) {
        req.session.isAdmin = true;
        req.session.save(err => {
            if (err) {
                console.log(err);
            }
            res.redirect('/panel?success=true&for=login');
        });
    } else {
        res.redirect('/panel');
    }
    
};

exports.getPanelTips = (req, res, next) => {
    res.render('admin/panel-tips', {
        pageTitle: 'Panel Tips'
    });
};

exports.postAddTip = (req, res, next) => {
    const vip = req.body.inlineRadioOptions;
    const vipText = req.body.tipText;

    if (!vip || !vipText) {
        return res.redirect('/panel-tips?error=true&for=panel-tips');
    }
    
    Tip
    .findOne({ name: vip })
    .then(tip => {
        if (!tip) {
            const newTip = new Tip({
                name: vip,
                text: vipText,
                updated: new Date()
            });
            return newTip.save();
        }
        tip.text = vipText;
        tip.updated = new Date()
        return tip.save();
    })
    .then(tip => {
        res.redirect('/panel-tips?success=true&for=panel-add-tips');
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteTip = (req, res, next) => {
    const vip = req.body.inlineRadioOptions;

    if (!vip) {
        return res.redirect('/panel-tips?error=true&for=panel-tips');
    }

    Tip
    .findOne({ name: vip })
    .then(tip => {
        tip.text = '';
        tip.updated = new Date(1)
        return tip.save();
    })
    .then(tip => {
        res.redirect('/panel-tips?success=true&for=panel-delete-tips');
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getPanelAccounts = (req, res, next) => {
    const currentDate = new Date();
    User
    .find({ expiration: { $lt: currentDate }, hidden: false })
    .then(accounts => {
        // console.log(accounts);
        res.render('admin/panel-accounts', {
            pageTitle: 'Panel Accounts',
            accounts: !accounts.length ? false : accounts,
            n: accounts.length
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postPanelAccountAccept = (req, res, next) => {
    const username = req.body.username;

    User
    .findOne({ username: username })
    .then(user => {
        let date = new Date();
        date.setDate(date.getDate() + 30);

        user.activated = true;
        user.expiration = date;
        return user.save();
    })
    .then(user => {
        res.redirect('/panel-accounts?success=true&for=account-accept');
        // transporter.sendMail({
        //     to: user.email,
        //     from: 'accounts@winwintips.se',
        //     subject: 'Registrera konto',
        //     html: `
        //         <h1>Win-Win Tips</h1>
        //         <hr>
        //         <h2>Grattis ${user.username}, ditt konto har (åter) aktiverats!</h2>
        //         <p>Du kan nu logga in på <a href="http://winwintips.se">vår webbplats</a>.</p>
        //     `
        // }, function (err, info) {
        //     if (err) {
        //         console.log(err);
        //         const error = new Error(err);
        //         error.httpStatusCode = 500;
        //         return next(error);
        //     }
        //     res.redirect('/panel-accounts?success=true&for=account-accept');
        // });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postPanelAccountReject = (req, res, next) => {
    const username = req.body.username;

    User
    .findOne({ username: username })
    .then(user => {
        if (!user.activated) {
            return User
            .deleteOne({ username: username })
            .catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        }
        user.hidden = true;
        return user.save();
    })
    .then(user => {
        res.redirect('/panel-accounts?success=true&for=account-reject');
        // return transporter.sendMail({
        //     to: user.email,
        //     from: 'farisdemirovic16@gmail.com',
        //     subject: 'Account Registration',
        //     html: `
        //         <h1>Win-Win Tips</h1>
        //         <hr>
        //         <h2>${user.username}, we write to you to inform you that the registration/extension of your membership has been rejected as you have not paid for it.</h2>
        //         <p>You can pay and submit another registration on <a href="http://localhost:3000/register">our website</a></p>
        //     `
        // });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getPanelTable = (req, res, next) => {
    res.render('admin/panel-table', {
        pageTitle: 'Panel Profit Table'
    });
}

exports.postPanelTable = (req, res, next) => {
    const tableMonth = req.body.tableMonth;
    const vip1Won = req.body.vip1Won;
    const vip1Total = req.body.vip1Total;
    const vip2Won = req.body.vip2Won;
    const vip2Total = req.body.vip2Total;
    const vip3Won = req.body.vip3Won;
    const vip3Total = req.body.vip3Total;
    const vip4Won = req.body.vip4Won;
    const vip4Total = req.body.vip4Total;
    const vip5Won = req.body.vip5Won;
    const vip5Total = req.body.vip5Total;
    const vip6Won = req.body.vip6Won;
    const vip6Total = req.body.vip6Total;

    if (!tableMonth || !vip1Won || !vip1Total || !vip2Won || !vip2Total || !vip3Won || !vip3Total || !vip4Won || !vip4Total || !vip5Won || !vip5Total || !vip6Won || !vip6Total) {
        return res.redirect('/panel-table?error=true&for=panel-table')
    }

    const newTable = new ProfitTable({
        month: tableMonth,
        vip1: {
            won: vip1Won,
            total: vip1Total
        },
        vip2: {
            won: vip2Won,
            total: vip2Total
        },
        vip3: {
            won: vip3Won,
            total: vip3Total
        },
        vip4: {
            won: vip4Won,
            total: vip4Total
        },
        vip5: {
            won: vip5Won,
            total: vip5Total
        },
        vip6: {
            won: vip6Won,
            total: vip6Total
        }
    });

    newTable
    .save()
    .then(table => {
        return res.redirect('/panel-table?success=true&for=panel-table');
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};