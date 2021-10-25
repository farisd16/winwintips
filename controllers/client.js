const crypto = require('crypto');
const { stringify } = require('querystring');

const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Tip = require('../models/tip');
const ProfitTable = require('../models/profit-table');

const transporter = nodemailer.createTransport(sendgrid({
    apiKey: process.env.SENDGRID_API_KEY
}));

exports.getIndex = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('client/index', {
            pageTitle: 'Win-Win Tips'
        });
    }
    Tip
    .find()
    .then(tips => {
        const findTip = (vip) => {
            return tip = tips.find(obj => {
                return obj.name === vip;
            });
        };

        const isToday = (someDate) => {
            const today = new Date()
            return someDate.getDate() == today.getDate() &&
              someDate.getMonth() == today.getMonth() &&
              someDate.getFullYear() == today.getFullYear()
        }

        const vip1 = findTip('vip1');
        const vip2 = findTip('vip2');
        const vip3 = findTip('vip3');

        res.render('client/tips', {
            pageTitle: 'Win-Win Tips',
            vip1: vip1,
            vip1Updated: isToday(vip1.updated) ? true : false,
            vip2: vip2,
            vip2Updated: isToday(vip2.updated) ? true : false,
            vip3: vip3,
            vip3Updated: isToday(vip3.updated) ? true : false
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getAbout = (req, res, next) => {
    res.render('client/about', {
        pageTitle: 'Om oss',
        path: 'about'
    });
};

exports.getTable = (req, res, next) => {
    ProfitTable
    .find()
    .sort({ createdAt: -1 })
    .limit(5)
    .then(tables => {
        // console.log(tables);
        res.render('client/table', {
            pageTitle: 'Vinsttabell',
            path: 'table',
            tables: tables
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getRules = (req, res, next) => {
    res.render('client/rules', {
        pageTitle: 'Spelregler',
        path: 'rules'
    });
}

exports.getRegister = (req, res, next) => {
    res.render('client/register', {
        pageTitle: 'Skapa konto'
    });
};

exports.postRegister = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const captcha = req.body.captcha;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        // return res.redirect(`/register?error=true&for=${errorMessage}`);
        return res.json({ success: false, for: errorMessage });
    }

    if (!captcha) {
        return res.json({ success: false, for: 'captcha' });
    }

    const query = stringify({
        secret: process.env.V2_PRIVATE,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    fetch(verifyURL)
    .then(res => res.json())
    .then(body => {
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, for: 'captcha' });
        }

        bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const newuser = new User({
                username: username,
                email: email,
                password: hashedPassword,
                admission: new Date()
            });
            return newuser.save();
        })
        .then(user => {
            // return res.redirect('/register?success=true&for=registration');
            return res.json({ success: true, for: 'registration' });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const captcha = req.body.captcha;

    if (!captcha) {
        return res.json({ success: false, for: 'captcha' });
    }
    
    User
    .findOne({ username: username })
    .then(user => {
        if (!user) {
            return res.json({ success: false, for: 'login-username' });
        }
        if (!user.activated) {
            return res.json({ success: false, for: 'login-activation' });
        }
        if (user.expiration < new Date()) {
            return res.json({ success: false, for: 'login-expiration' });
        }

        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if (!doMatch) {
                return res.json({ success: false, for: 'login-password' });
            }

            const query = stringify({
                secret: process.env.V2_PRIVATE,
                response: req.body.captcha,
                remoteip: req.connection.remoteAddress
            });
            const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

            fetch(verifyURL)
            .then(res => res.json())
            .then(body => {
                if (body.success !== undefined && !body.success) {
                    return res.json({ success: false, for: 'captcha' });
                }

                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    if (err) {
                        console.log(err);
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    }

                    return res.json({ success: true, for: 'login' });
                });
            })
            .catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        }
        res.redirect('/');
      });
};

exports.getResetPassword = (req, res, next) => {
    res.render('client/reset-password', {
        pageTitle: 'Återställ lösenord'
    });
};

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    const captcha = req.body.captcha;

    if (!captcha) {
        return res.json({ success: false, for: 'captcha' });
    }

    const query = stringify({
        secret: process.env.V2_PRIVATE,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    fetch(verifyURL)
    .then(res => res.json())
    .then(body => {
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, for: 'captcha' });
        }

        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
            }
            const token = buffer.toString('hex');
            User
            .findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.json({ success: false, for: 'login-email' });
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(user => {
                if (user) {
                    transporter.sendMail({
                        to: user.email,
                        from: 'accounts@winwintips.se',
                        subject: 'Återställning av lösenord',
                        html: `
                            <h1>Win-Win Tips</h1>
                            <hr>
                            <h2>Du har begärt en återställning av lösenordet.</h2>
                            <p>Du kan återställa ditt lösenord <a href="http://winwintips.se/reset-password/${token}">här</a>.</p>
                        `
                    }, function (err, info) {
                        if (err) {
                            console.log(err);
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                            return next(error);
                        }
                        return res.json({ success: true, for: 'password-reset' });
                    });
                    return res.json({ success: true, for: 'password-reset' });
                }
            })
            .catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        });              
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    if (token === 'sweetalert2.all.min.js') {
        return res.redirect('/');
    }
    
    User
    .findOne({ resetToken: token })
    .then(user => {
        if (user.resetTokenExpiration < new Date()) {
            return res.redirect('/reset-password');
        }
        
        res.render('client/new-password', {
            pageTitle: 'Ställ in nytt lösenord',
            userId: user._id.toString(),
            token: token
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const token = req.body.token;
    const userId = req.body.userId;
    let resetUser;

    User
    .findOne({ resetToken: token, _id: userId })
    .then(user => {
        if (user.resetTokenExpiration < new Date()) {
            return res.redirect('/reset-password');
        }

        resetUser = user;
        return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(user => {
        res.redirect('/?success=true&for=new-password');
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getActivate = (req, res, next) => {
    res.render('client/activate', {
        pageTitle: 'Aktivera konto'
    });
};

exports.postActivate = (req, res, next) => {
    const username = req.body.username;
    const captcha = req.body.captcha;

    if (!captcha) {
        return res.json({ success: false, for: 'captcha' });
    }

    const query = stringify({
        secret: process.env.V2_PRIVATE,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    fetch(verifyURL)
    .then(res => res.json())
    .then(body => {
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, for: 'captcha' });
        }

        User
        .findOne({ username: username })
        .then(user => {
            if (!user) {
                // return res.redirect('/activate?error=true&for=login-username');
                return res.json({ success: false, for: 'login-username' });
            }
            user.hidden = false;
            user.admission = new Date();
            return user.save();
        })
        .then(user => {
            if (user) {
                // return res.redirect('/activate?success=true&for=account-activation')
                return res.json({ success: true, for: 'account-activation' });
            }
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });        
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};