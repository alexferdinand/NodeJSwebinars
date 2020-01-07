'use strict'
const fs = require('fs')
const ARGS = require('minimist')(process.argv.slice(2))

/**
 *Возвращает имя файла, в который будет записан лог. Если задан --logname то имя файла берется из него, если нет то возвращается defaultLog.txt
 *
 * @param {*} args
 * @returns
 */
function fileForLog(args) {
    if (args.hasOwnProperty('logname')) {
        return args.logname
    } else {
        console.log("Имя лог-файла не задано")
        return 'defaultLog.txt'
    }
}

/**
 *Выполняет чтение из файла лога и возвращает строку
 *
 * @returns string
 */
function logRead() {
    try {
        const fd = fs.openSync(fileForLog(ARGS), 'r+')
        let data = fs.readFileSync(fd, {
            encoding: 'utf8'
        })
        fs.closeSync(fd)
        return data;
    } catch (e) {
        return false
    }
}

function analyzer() {
    const log = JSON.parse(logRead())
    console.log("Количество сыгранных игр:", gameNumber(log), "Количество выигранных игр:", winNumber(log), "Количество проигранных игр:", lossNumber(log), `Самая длинная выигрышная серия ${maxGame(maxWinSeries(an)).value} в игре под номером ${maxGame(maxWinSeries(an)).game}.`, `Самая длинная серия проигрышей ${maxGame(maxLossSeries(an)).value} в игре под номером ${maxGame(maxLossSeries(an)).game}.`)
}

function gameNumber(log) {
    return log.length
}

function winNumber(log) {
    let num = log.filter(n => {
        let winCount = n.sequence.reduce((count, current) => count + current, 0)
        return winCount * 2 > n.sequence.length
    })
    return num.length
}

function lossNumber(log) {
    let num = log.filter(n => {
        let lossCount = n.sequence.reduce((count, current) => count + current, 0);
        return n.sequence.length - lossCount > lossCount
    })
    return num.length
}

function maxWinSeries(log) {
    let maxSeries = log.map(n => {
        return maxSerie(n.sequence, 1)
    })
    return maxSeries
}

function maxLossSeries(log) {
    let maxSeries = log.map(n => {
        return maxSerie(n.sequence, 0)
    })
    return maxSeries
}

function maxGame(array) {
    const valAndGame = {value: null, game: null}
    for (let index = 0; index < array.length; index++) {
         if (valAndGame.value < array[index]) {
             valAndGame.value = array[index]
             valAndGame.game = index + 1
         }
    }
    return valAndGame
}

function maxSerie(arraySeq, winOrLose, last = 1) {
    let max = 1
    if (arraySeq.length == 0) {
        return last
    } else {
        for (let i = 0; i <= arraySeq.length; i++) {
            if (arraySeq[i] == arraySeq[i + 1]) {
                if (arraySeq[i] == winOrLose) {
                    max++
                }
            } else {
                if (last <= max) {
                    return maxSerie(arraySeq.slice(i + 1), winOrLose, max)
                } else {
                    return maxSerie(arraySeq.slice(i + 1), winOrLose, last)
                }

            }
        }
    }
}

let an = JSON.parse(logRead())
analyzer()