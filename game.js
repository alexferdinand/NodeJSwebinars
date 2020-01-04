'use strict'

const gameNumber = null
let throwNumbers = 0
let winValue = 0
const ARGS = require('minimist')(process.argv.slice(2))
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const RULES = 'Это игра "Орел и решка". Правила игры: в командной строке на вопрос "Орел или решка?" нужно написать 1, что соответствует "орлу", или 2, что означает решку. Чтобы завершить партию необходимо вбить в консоли "exit" или нажать Ctrl+C. Чтобы изменить файл лога игры при ее запуске нужно ввести ключ вида --logname=filename'
const fs = require('fs')


/**
 * @name isExit
 * @abstract Получает на вход строку ,если она равна "exit" останавливает выполнение скрипта. При прочих условиях передает строку в callback
 * @param {string} string
 * @param {func} 
 */
function isExit(string, func) {
    string === 'exit' ? closeGame() : func(string);
}

function closeGame() {
    const log = logger(throwNumbers, winValue)
    logWrite(log)
    rl.close()
}

/**
 *Принимает на вход количество бросков монет в игре, и количество угаданных падений. 
 *Считывает из файла имеющийся лог или создает новый лог, если файл создан впервые и пуст.
 * @param {number} throwNum количество бросков монеты в игре
 * @param {number} winVal количество угаданных падений в  текущей игре
 * @returns
 */
function logger (throwNum, winVal) {
    let logs = logRead()
    let log = {throwNumbers: throwNum, winValue: winVal}
    if (logs) {
        let logsFromJSON = JSON.parse(logs)
        logsFromJSON.push(log)
        return JSON.stringify(logsFromJSON)
    } else {
        logs = []
        logs.push(log)
        return JSON.stringify(logs)
    }
}


/**
 * 
 *
 * @param {string} string 
 */
function gameCycle(string) {
    throwNumbers++
    let rNumber = randomNumber()
    if (rNumber === +string) {
        console.log("Вы угадали!")
        winValue++
        game()
    }
    else {
        console.log("Вы не угадали!")
        game()
    }
}

/**
 * Возвращает 1 или 2 случайно
 *
 * @returns number
 */
function randomNumber() {
    return Math.round((Math.random() + 1))
}


function fileForLog(args) {
    if (args.hasOwnProperty('logname')) {
           return `${args.logname}.txt`
    } else {
        console.log("Используется имя файла для лога игры по умолчанию")
        return 'defaultLog.txt'
    }
}


function logWrite(string) {
    const fd = fs.openSync(fileForLog(ARGS), 'w+')
    fs.writeFileSync(fd, string, {
        encoding: 'utf8',
        flag: 'w+'
    })
    fs.closeSync(fd)
}

function logRead() {
    try {
        const fd = fs.openSync(fileForLog(ARGS), 'r+')
        let data = fs.readFileSync(fd, {encoding:'utf8'})
        fs.closeSync(fd)
        return data;
    } catch (e) {
        return false
    }
}

/**
 *Выводит в консоль правила игры из константы RULES
 *
 */
function printRules() {
    console.log(RULES)
}


function game() {
        rl.question('Орел или решка?', (cmd) => isExit(cmd, gameCycle))
}


printRules()
game()
