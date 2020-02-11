const express = require('express');
const router = express.Router()
const tasks = require('../models/task')
const Task = new tasks

router.get('/tasks', (req, res) => {
    Task.getAll().then(result => {
        console.log(result)
            res.render('tasks', result)
        },
        error => {
            console.log(error)
        }
    )
});

router.get('/tasks/:id',  (req, res) => {
    console.log(req.params)
    Task.getById(req.params.id).then(result => {
        res.json(result)
    },
    error => {
        console.log(error)
    }
)
})


router.post('/tasks',  (req, res) => {
    console.log(req.body)
    switch (req.body._method)  {
       case "DELETE" :
            Task.deleteById(req.body.tasks_id).then(result => {
                res.redirect('/tasks')
        },
        error => {
            console.log(error)
        })
        break

        case "PUT" :
            console.log (req.body)
            Task.updateById(req.body.tasks_id, req.body).then(result => {
                res.redirect('/tasks')
            },
            error => {
                console.log(error)
            } 
            )
            break

        default: 
        Task.add(req.body).then(result => {
            res.redirect('/tasks')
        },
        error => {
            console.log(error)
            res.redirect('/tasks')
        } 
        ) 
        break
}
})


module.exports = router