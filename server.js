'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())

let bodyParserJson = bodyParser.json()

app.listen(8888, function () {
    console.log('Example app listening on 8888');
  });

app.post('/', function(req, res) {
    console.log(req.body.sendArray[0].value)
    res.send({uri: 'index.html'})
})

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
// })