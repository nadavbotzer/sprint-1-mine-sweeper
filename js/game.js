'use strict'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    markedMines: 0
}

const MARKED = '📍'
const MINE = '💣'

function onInit() {
    gGame.markedMines = 0
    gGame.isOn = true
    gBoard = buildBoard(gLevel.SIZE)
    setMines()
    setAllNegs()
    hideElement('.good-game')
    renderBoard(gBoard, '.game-container')
}

function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // board[2][2].isMine = true
    // board[3][3].isMine = true

    return board
}

function setAllNegs() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            setMinesNegsCount(gBoard, { i: i, j: j })
        }
    }
}

function onCellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        elCell.innerText = MINE
        gameOver()
        return
    } else if (gBoard[i][j].minesAroundCount !== 0) {
        gBoard[i][j].isShown = true
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = gBoard[i][j].minesAroundCount
        expandShown(gBoard, elCell, i, j)

    }
    if (checkVictory()) {
        showElement('.good-game')
    }
}

function setMines() {
    var count = 0
    while (count < gLevel.MINES) {
        var i = getRandomIntInclusive(0, gBoard.length - 1)
        var j = getRandomIntInclusive(0, gBoard.length - 1)

        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true
            count++
        }

    }
}

function onCellMarked(elCell, i, j) {
    event.preventDefault()
    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isMarked) {
        elCell.innerText = MARKED
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    } else {
        elCell.innerText = ''
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    }
    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gGame.markedMines++
    if (checkVictory()) {
        showElement('.good-game')
    }
}

function onChangeDiff(operator) {
    if (operator === 1) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        onInit()
    }
    if (operator === 2) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        onInit()
    }
    if (operator === 3) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        onInit()
    }
}

function checkVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                return false
            }
        }
    }
    return gGame.markedMines === gLevel.MINES

}
function gameOver() {
    gGame.isOn = false
    console.log('Game Over')
    showElement('.good-game')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerText = MINE
            }
        }
    }
}