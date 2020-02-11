'use strict'



/**
 *Обеспечивает доступ к RSS ленте и ее отображение
 *
 * @class Reader
 */
class Reader {
    constructor(url = "") {
        this.request = require('request');
        this.cf = require('cli-color')
        this.defaultURL = "https://news.yandex.ru/cosmos.rss"
        this.URL = this._init(url)
        this.xmlDOM
        this.option = "t"
    }


    /**
     *Получает на вход строку - URI ресурса для запроса, если строка пустая, то использует адрес по умолчанию
     *
     * @param {string} url
     * @returns string URI ресурса
     * @memberof Reader
     */
    _init(url) {
        if (url === "") {
            return this.defaultURL
        } else {
            return url
        }
    }


    /**
     *Выводит в лог консоли адрес новостного агрегатора по умолчанию
     *
     * @memberof Reader
     */
    showDefaultUrl() {
        console.log(this.URL)
    }


    /**
     *Получает rss/xml в соответствии с выбранной опцией (по умолчанию "t" - titles) вызывает метод отображения заголовков или новостей целиком
     *
     * @param {string} news
     * @param {string} [option='t']
     * @memberof Reader
     */
    _newsFormatter(news) {
        let xml = require('xml-parse')
        this.xmlDOM = new xml.DOM(xml.parse(news));
        switch (this.option) {
            case "t":
                this._printTitle(this.xmlDOM);
                break
            case "a":
                this._printAllNews()
                break
        }
    }


    /**
     *Выводит в консоль список заголовков новостей
     *
     * @param {object} titlesXML
     * @memberof Reader
     */
    _printTitle() {
        const itemList = this.xmlDOM.document.getElementsByTagName('item')
        let titles = 'Оглавление новостей:\n'
        let i = 0
        for (let item of itemList) {
            i++
            titles += `${i}  ${this.cf.bold(item.getElementsByTagName("title")[0].innerXML)} от ${this.cf.italic.white(item.getElementsByTagName("pubDate")[0].innerXML)} \n`
        }
        console.log(titles)
    }


    /**
     *Выводит в консоль список заголовков и описание новостей со ссылками
     *
     * @memberof Reader
     */
    _printAllNews() {
        const itemList = this.xmlDOM.document.getElementsByTagName('item')
        let titles = 'Новости целиком:\n'
        let i = 0
        for (let item of itemList) {
            i++
            titles += `${i}  ${this.cf.bold(item.getElementsByTagName("title")[0].innerXML)} ${item.getElementsByTagName("description")[0].innerXML}  ${this.cf.blue.underline(item.getElementsByTagName("link")[0].innerXML)} от ${this.cf.italic.white(item.getElementsByTagName("pubDate")[0].innerXML)} \n \n`
        }
        console.log(titles)
    }


    /**
     *Создает запрос на RSS/XML
     *
     * @memberof Reader
     */
    showNews() {
        this._makeRequest(this._newsFormatter.bind(this))
    }


    /**
     *Отправляет GET запрос по указанному адресу и передает ответ в callback-функцию
     *
     * @param {callbackFunction} shower
     * @memberof Reader
     */
    _makeRequest(shower) {
        this.request(this.URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                shower(body, "a")
            }
        })
    }
}


/**
 *Создает диалог при помощи модуля Inquirer для выбора желаемой RSS ленты с опциями отображения и отображает их с применением класса Reader
 *
 * @class Dialog
 */
class Dialog {
    constructor() {
        this.inquirer = require('inquirer');
        //Список RSS лент яндека из которых выбираем новости
        this.URI = [{
            subject: 'космос',
            uri: 'https://news.yandex.ru/cosmos.rss'
        }, {
            subject: 'здоровье',
            uri: 'https://news.yandex.ru/health.rss'
        }, {
            subject: 'игры',
            uri: 'https://news.yandex.ru/games.rss'
        }, {
            subject: 'наука',
            uri: 'https://news.yandex.ru/science.rss'
        }, {
            subject: 'политика',
            uri: 'https://news.yandex.ru/politics.rss'
        }, {
            subject: 'путешествия',
            uri: 'https://news.yandex.ru/travels.rss'
        }, {
            subject: 'религия',
            uri: 'https://news.yandex.ru/religion.rss'
        }]
        //Список вопросов для диалога
        this.questions = [{
            type: 'list',
            name: 'subject',
            message: 'Выберите интересующую тему:',
            choices: () => {
                const arr = []
                for (let item of this.URI) {
                    arr.push(item.subject)
                }
                return arr
            }
        },
        {
            type: 'list',
            message: 'Показывать только заголовки новостей или новость целиком?',
            name: 'full',
            choices:['Только заголовки', 'Новость целиком'],
            filter: function(val) {
                switch (val) {
                    case 'Только заголовки':
                    return 't'
                    break
                    case 'Новость целиком':
                    return 'a'
                    break
                }
              }
          }]
        this._init()
    }


/**
 *Задает вопросы в диалогах из this.questions, вызывает функцию this._getNew() с выбранным адресом и опцией отображения - целиком или только заголовки
 *
 * @memberof Dialog
 */
_init() {
        this.inquirer.prompt(this.questions)
            .then(answers => {
                const uri = this.URI.find(item => item.subject === answers.subject ? item.uri : false)
                this._getNews(uri.uri, answers.full)
            })
    }


/**
 *Принимает адрес RSS-ленты и опции отображения (целиком или только заголовки). Создает объект Reader c заданными параметрами и отображает ленту. Вновь вызывает this._init. 
 *
 * @param {string} uri
 * @param {string} option
 * @memberof Dialog
 */
_getNews(uri, option) {
        let der = new Reader(uri)
        der.option = option
        der.showNews()
        this._init()
    }

}


new Dialog()
