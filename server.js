'use strict'

const express = require('express')
const bodyParser = require('body-parser')
let cons = require('consolidate');
const app = express()
const cookieParser = require('cookie-parser')
const router = express.Router()
app.use(bodyParser())
app.use(cookieParser())

app.engine('handlebars', cons.handlebars);
app.set('view engine', 'handlebars');



app.listen(8888, function () {
  console.log('Example app listening on 8888');
});



app.post('/', function (req, res) {
  const cookie = new Cookies(req, res)
  let news = new News(cookie.getSubject(), cookie.getMode(), cookie.getCount(), cookie.getCookie())
  news.renderNews('index', res)

})

app.get('/', function (req, res) {
  res.render('index', {
    titlePage: 'Новости Яндекса'
  })
})



class Cookies {
  constructor(request, response) {
    this.response = response
    this.method = request.method
    this.cookie = request.cookies
    this.postBody = request.body
    this._init()

  }

  _init() {
    if (this.method == "POST") {
      for (let key in this.postBody) {
        this.cookie[key] = this.postBody[key]
        this.response.cookie(key, this.cookie[key], {
          maxAge: 3600000
        })
      }
    }

  }

  getCookie() {
    return this.cookie
  }

  getSubject() {
    return this.cookie['subject']
  }

  getMode() {
    return this.cookie['mode']
  }

  getCount() {
    return this.cookie['count']
  }

}


class News {
  constructor(subject, mode = "t", count = 5, ...args) {
    this.categories
    this.subject = subject
    this.uri = null
    this.mode = mode
    this.count = count
    this.request = require('request')
    this.xmlDOM
    this._getURL()
    this.response
    this.page
    this.cookie = args[0]
    this.responseArray = {}
  }



  _getURL() {
    this.uri = `https://news.yandex.ru/${this.subject}.rss`
  }

  _makeRequest(shower) {
    this._setCookie()
    this.request(this.uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        shower(body)
      }
    })
  }

  _setCookie() {
    this.responseArray['cookie']
    if (this.cookie) {
      let element = {}
      element[this.cookie.subject] = true
      element[this.cookie.mode] = true
      switch (this.cookie.count) {
        case '5':
          element["five"] = true
          break;
        case '10':
          element['ten'] = true
          break;
      }
      this.responseArray.cookie = element
    }
  }

  renderNews(page, res) {
    this._makeRequest(this._newsFormatter.bind(this))
    this.response = res
    this.page = page
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
    this.responseArray['news'] = []
    let i = 0
    for (let item of itemList) {
      if (i <= this.count) {
        let news = {
          title: item.getElementsByTagName("title")[0].innerXML,
          pubDate: item.getElementsByTagName("pubDate")[0].innerXML
        }
        this.responseArray.news.push(news)
        i++
      } else {
        break;
      }
    }
    this.response.render(this.page, this.responseArray)
  }

  _printAllNews() {
    const itemList = this.xmlDOM.document.getElementsByTagName('item')
    this.responseArray['news'] = []
    let i = 0
    for (let item of itemList) {
      let title = {}
      if (i <= this.count) {
        title = {
          title: item.getElementsByTagName("title")[0].innerXML,
          pubDate: item.getElementsByTagName("pubDate")[0].innerXML,
          description: item.getElementsByTagName("description")[0].innerXML,
          link: item.getElementsByTagName("link")[0].innerXML
        }
        this.responseArray.news.push(title)
        i++
      } else {
        break;
      }
    }
    this.response.render(this.page, this.responseArray)
  }

}