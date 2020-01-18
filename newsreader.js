'use strict'

class Reader {
    constructor(url = "") {
        this.request = require('request');
        this.cf = require('cli-color')
        this.defaultURL = "https://news.yandex.ru/cosmos.rss"
        this.URL = this._init(url)
        this.xmlDOM
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
    _newsFormatter(news, option = "t") {
        let xml = require('xml-parse')
        this.xmlDOM = new xml.DOM(xml.parse(news));
        switch (option) {
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

class Interface {
    constructor() {
        this.inquirer = require('inquirer');
        this._init()
    }
    
    _init() {
        this.inquirer.prompt([{type: 'list', message: "yes, no", name: "y/n", choices: ['y', 'n']}
            
          ])
          .then(answers => {
            console.log(answers)
          });
    }


}

const rl = new Interface()
let der = new Reader()
//der.showNews()

//console.log(cf.red('ЭЭвавава'))