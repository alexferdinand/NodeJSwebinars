'use strict'

const STAT = {sequence: []}
const ARGS = require('minimist')(process.argv.slice(2))
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const RULES = 'Это игра "Орел и решка". Правила игры: в командной строке на вопрос "Орел или решка?" нужно написать 1, что соответствует "орлу", или 2, что означает решку. Чтобы завершить партию необходимо вбить в консоли "exit" или нажать Ctrl+C. Чтобы изменить файл лога игры при ее запуске нужно ввести ключ вида --logname=filename. Забыли правила? Введите "help".'
const fs = require('fs')


/**
 * @name isExit
 * @abstract Получает на вход строку ,если она равна "exit" останавливает выполнение скрипта. При прочих условиях передает строку в callback
 * @param {string} string
 * @param {func} 
 */
function isExit(string, func) {
    switch (string) {
        case 'exit':
            closeGame()
            break
        case 'help':
            printRules()
            game()
            break
        default:
            func(string)
            break
    }
}

/**
 *При вызове "exit" вызывает logger, затем сохраняет лог в файл и закрывает игру
 *
 */
function closeGame() {
    const log = logger()
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
function logger() {
    let logs = logRead()
    if (logs) {
        let logsFromJSON = JSON.parse(logs)
        logsFromJSON.push(STAT)
        return JSON.stringify(logsFromJSON)
    } else {
        logs = []
        logs.push(STAT)
        return JSON.stringify(logs)
    }
}


/**
 * Принимает строку и проверяет ее на равенство случайному значению, 1 или 2. В случае совпадения увеличвает значение счетчика на 1, пишет в консоль об успехе.
 * В случае несовпадения аргумента со случайным значением пишет в консоль о неудаче. Затем вызывает функцию game()
 * @param {string} string 
 */
function gameCycle(string) {
    let rNumber = randomNumber()
    if (rNumber === +string) {
        console.log("Вы угадали!")
        STAT.sequence.push(1)
    } else {
        STAT.sequence.push(0)
        console.log("Вы не угадали!")
    }
    game()
}

/**
 * Возвращает 1 или 2 случайно
 *
 * @returns number
 */
function randomNumber() {
    return Math.round((Math.random() + 1))
}


/**
 *Возвращает имя файла, в который будет записан лог. Если задан --logname то имя файла берется из него, если нет то возвращается defaultLog.txt
 *
 * @param {*} args
 * @returns
 */
function fileForLog(args) {
    if (args.hasOwnProperty('logname')) {
        return `${args.logname}.txt`
    } else {
        console.log("Используется имя файла для лога игры по умолчанию")
        return 'defaultLog.txt'
    }
}


/**
 *Производит запись в файл лога
 *
 * @param {*} string
 */
function logWrite(string) {
    const fd = fs.openSync(fileForLog(ARGS), 'w+')
    fs.writeFileSync(fd, string, {
        encoding: 'utf8',
        flag: 'w+'
    })
    fs.closeSync(fd)
}

/**
 *Выполняет чтение из файла лога и возвращает строку
 *
 * @returns
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

/**
 *Выводит в консоль правила игры из константы RULES
 *
 */
function printRules() {
    console.log(RULES)
}

/**
 *Задает вопрос и передает ответ в callback 
 *
 */
function game() {
    rl.question('Орел или решка?', (cmd) => isExit(cmd, gameCycle))
}


printRules()
game()
