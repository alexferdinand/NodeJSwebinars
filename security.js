const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const consolidate = require('consolidate')
const user = require('./models/user')
const session = require('express-session')
const MysqlStore = require('express-mysql-session')(session)
const config = require('./models/config.json')
const passport = require('./auth')

const sessionStore = new MysqlStore(config)

const User = new user
const app = express()

app.use(session({
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize);
app.use(passport.session);

app.use(bodyParser())

app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'))


const mustBeAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth')
    }
}

app.get('/auth', (req, res) => {
    const error = !!req.query.error; // string -> false -> true
    res.render('auth', {
        error
    });
});

app.post('/auth', passport.authenticate)
app.use('/tasks', mustBeAuthenticated)
//app.use('/users', mustBeAuthenticated)

app.use('/styles', express.static(path.resolve(__dirname, 'assets/')))
const routes = require("./routes/tasks")
app.use('/', routes)


app.get('/users', (req, res) => {
    User.getAll().then(result => {
            res.render('users', result)
        },
        error => {
            console.log(error)
        }
    )
});

app.get('/users/:id', (req, res) => {
    User.getById(req.params.id).then(result => {
            res.json(result)
        },
        error => {
            console.log(error)
        }
    )
})

app.post('/users', (req, res) => {
    switch (req.body._method) {
        case "DELETE":
            User.deleteById(req.body.users_id).then(result => {
                    res.send("Пользователь удален")
                },
                error => {
                    console.log(error)
                })
            break

        case "PUT":
            User.updateById(req.body.users_id, req.body).then(result => {
                    res.redirect('/users')
                },
                error => {
                    console.log(error)
                }
            )
            break

        default:
            User.add(req.body).then(result => {
                    res.redirect('/users')
                },
                error => {
                    console.log(error)
                }
            )
            break
    }
})

app.get('/auth', (req, res) => {
    res.render('auth')
})


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
  });


app.listen(8888, () => {
    console.log('Server has been started!');
});