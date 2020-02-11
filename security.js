const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const consolidate = require('consolidate')
const user = require('./models/user')
const User = new user
const routes = require("./routes/tasks")

const app = express();

app.use(bodyParser())

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use('/styles', express.static(path.resolve(__dirname, 'assets/')));
app.use('/', routes)

app.get('/users', (req, res) => {
    User.getAll().then(result => {
            res.json(result)
        },
        error => {
            console.log(error)
        }
    )
});

app.get('/users/:id',  (req, res) => {
    User.getById(req.params.id).then(result => {
        res.json(result)
    },
    error => {
        console.log(error)
    }
)
})

app.post('/users',  (req, res) => {
    switch (req.body._method)  {
       case "DELETE" :
            User.deleteById(req.body.users_id).then(result => {
            res.send("Пользователь удален")
        },
        error => {
            console.log(error)
        })
        break

        case "PUT" :
            User.updateById(req.body.users_id, req.body).then(result => {
                res.json(`Обновлено записей ${result.affectedRows}`)
            },
            error => {
                console.log(error)
            } 
            )
            break

        default: 
        User.add(req.body).then(result => {
            res.json({id:result})
        },
        error => {
            console.log(error)
        } 
        ) 
        break
}
})




app.listen(8888, () => {
    console.log('Server has been started!');
});