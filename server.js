'use strict'

const express = require('express')
const bodyParser = require('body-parser')
let cons = require('consolidate');

const app = express()
const router = express.Router()

app.engine('handlebars', cons.handlebars);
app.set('view engine', 'handlebars');


app.use(bodyParser())

app.listen(8888, function () {
  console.log('Example app listening on 8888');
});



app.post('/', function (req, res) {
  let news = new News(req.body.subject, req.body.mode, req.body.count)
  news.renderNews('index', res)
  
})

app.get('/', function (req, res) {
  res.render('index', {titlePage: 'Новости Яндекса'})
})





// class Response {
//   constructor(siteName, mode = 'all') {
//     this.sites = {}
//     this.siteName = siteName
//     this.html = null
//     this.mode = mode
//     this.request = require('request');
//   }

//   requestToSite(res) {
//     let uri = this.getURL()
//     this.request.get(uri, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         res.send(body)
//       } else {
//         res.send(error)
//       }
//     });
//   }

//   getURL() {
//     return this.sites[this.siteName]
//   }

// }

class News {
  constructor(subject, mode = "t", count = 5) {
    this.categories
    this.subject = subject
    this.uri = null
    this.mode = mode
    this.count = count
    this.request = require('request')
    this.xmlDOM
    this._getURL()
    this.response = null
  }
  _getURL() {
    this.uri = `https://news.yandex.ru/${this.subject}.rss`
  }

  _makeRequest(shower) {
    this.request(this.uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        shower(body)
      }
    })
  }

  renderNews(page, res) {
    this._makeRequest(this._newsFormatter.bind(this))
    res.render(page, this.response)
  }

  _newsFormatter(news) {
    let xml = require('xml-parse')
    this.xmlDOM = new xml.DOM(xml.parse(news));
    switch (this.mode) {
      case "t":
        this._printTitle(this.xmlDOM);
        break
      case "a":
        this._printAllNews()
        break
    }
  }

  _printTitle() {
    const itemList = this.xmlDOM.document.getElementsByTagName('item')
    let responseArray = {titles:[]}
    let i = 0
    for (let item of itemList) {
      if (i <= this.count) {
       let news = {
          title: item.getElementsByTagNa
          me("title")[0].innerXML,
          pubDate: item.getElementsByTagName("pubDate")[0].innerXML
        }
        responseArray.titles.push(news)
        i++
      } else {
        break;
      }
    }
    console.log(responseArray)
    this.response = responseArray
  }

  _printAllNews() {
    const itemList = this.xmlDOM.document.getElementsByTagName('item')
    let titles = 'Новости целиком:\n'
    let i = 0
    for (let item of itemList) {
      if (i <= this.count) {
        title = {
          title: item.getElementsByTagName("title")[0].innerXML,
          pubDate: item.getElementsByTagName("pubDate")[0].innerXML,
          description: item.getElementsByTagName("description")[0].innerXML,
          link: item.getElementsByTagName("link")[0].innerXML
        }
        titles.push(title)
        i++
      } else {
        break;
      }
    }
    console.log(titles)
  }

}