'use strict'


class Connector {
    constructor() {
        this.key = 'trnsl.1.1.20200119T172845Z.330e878f94657800.93596906837eee5ff2a135219f06bea617f8c2cf'
        this.host = 'translate.yandex.net'
        this.lang = 'ru'
        this.get = '/api/v1.5/tr.json/translate'
        this.urlutils = require('url')
        this._init()
        this.httpServer
    }

    _init() {
        this.httpServer = require("http");
        this.httpServer.createServer(this._onRequest.bind(this)).listen(8888);
        console.log("Server has started.");
    }
/**
 *Царь-метод - делает ВСЕ!))
 *
 * @param {*} request
 * @param {*} response
 * @memberof Connector
 */
_onRequest(request, response) {
        if (request.headers.hasOwnProperty('referer')) {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write("base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAB3ySURBVHhe7Z0JWBTnlobvzCS5sya5yUwyd5JczeKSzeyaxBgVjbjjEsUdjMF9jUaJxgCCgAqICCgg+w7KvqqgKOKOcSOJNyEuicaoqCiLevP8831F/W3RtuICCk2d53kfuquri65zvv+c81d1V/2pMVjnzp2fBtLmAYcuXbp4gXwNIVyuYglobdRN6NaU7OOPP34MwbNmUEEZEOSTTz4RPXr0UOjbt+8N9OrVy/C6fI9KErY3AbRQ/4Vujc04WsEMBKuIQbOwsBC9e/cWAwYMECNHjrw8duzYMjs7u0sLFy48Szy9PEVwSLABXz9f4eDoUM7XpkydwvXP2djaXBg4cKAiDopHFUMJ8ML/6qD+a90epCEQHOmlDA5Hbr9+/cSgQYPEhIkTzi1durQiPiFeZOdki9S0VJGwNkEhPCJchISGiDXBa8TyFctF4JpA5XlYeJhhnZTUFJGVlSWSk5PFihUrrk6fPv3ckCFDKikGS0tLRQzINGX4/w6dOnX6s/pxdLtfBsdbIgDFDESfPn2EtbX15VmzZp318/");
            response.end();
        } else {
            const params = this.urlutils.parse(request.url, true)
            const url = this._requestMaker(params.query.translate)
            const req = require("request")
            req(url, function (error, responseYandex, body) {
                if (error) {
                    console.error(error);
                } else {
                    let b = JSON.parse(body)
                    response.writeHead(200, {
                        "Content-Type": "text/plain; charset=utf-8"
                    });
                    response.write(b.text[0]);
                    response.end();
                }
            })
        }

    }

    _requestMaker(question) {
        const queryObj = {
            lang: this.lang,
            key: this.key,
            text: encodeURIComponent(question)
        }
        return this.urlutils.format({
            protocol: 'https',
            host: this.host,
            pathname: this.get,
            query: queryObj
        })
    }

}



new Connector()