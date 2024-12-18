'use strict'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    isFirstClick: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    markedMines: 0,
    life: 3
}

var gTimer

const MARKED = '📍'
const MINE = '💣'

function onInit() {
    gGame.life = 3
    gGame.markedMines = 0
    gGame.isOn = true
    gGame.isFirstClick = true
    gBoard = buildBoard(gLevel.SIZE)
    // setMines()
    // setAllNegs()
    hideElement('.good-game')
    renderBoard(gBoard, '.game-container')
    resetTimer()
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
    var elLifePoints = document.querySelector('.life-points')
    if (gGame.isOn === false) return
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isShown) return
    if (gGame.isFirstClick) {
        setMines({ i: i, j: j })
        setAllNegs()
        gGame.isFirstClick = false
        startTimer()
    }
    if (gBoard[i][j].isMine) {
        gGame.life--
        elCell.innerText = MINE
        elLifePoints.innerText = gGame.life
        gBoard[i][j].isShown = true
        if (gGame.life < 1) {
            gameOver(false)
            return
        }


    } else if (gBoard[i][j].minesAroundCount !== 0) {
        gBoard[i][j].isShown = true
        elCell.innerText = gBoard[i][j].minesAroundCount
        elCell.classList.add('clicked-cell-num')
    } else if (gBoard[i][j].minesAroundCount === 0) {
        elCell.innerText = ''
        elCell.classList.add('clicked-cell-zero')
        expandShown(gBoard, elCell, i, j)
    }
    if (checkVictory()) {
        gameOver(true)
    }
}


function setMines(clickedIdx) {
    var count = 0
    while (count < gLevel.MINES) {
        var i = getRandomIntInclusive(0, gBoard.length - 1)
        var j = getRandomIntInclusive(0, gBoard.length - 1)

        if (!gBoard[i][j].isMine && i !== clickedIdx.i && j !== clickedIdx.j) {
            gBoard[i][j].isMine = true
            count++
        }

    }
}

function onCellMarked(elCell, i, j) {
    event.preventDefault()
    if (gGame.isOn === false) return
    if (gBoard[i][j].isShown && !gBoard[i][j].isMarked) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        elCell.innerText = MARKED
        gGame.markedCount++
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerText = ''
        gGame.markedCount--
    }
    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gGame.markedMines++
    if (checkVictory()) {
        gameOver(true)
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

function setMinesNegsCount(board, index) {

    var row = index.i
    var col = index.j
    var mineCount = 0


    for (var k = 0; k < gNeighborOffsets.length; k++) {
        var offset = gNeighborOffsets[k]
        var neighborRow = row + offset[0]
        var neighborCol = col + offset[1]

        if (
            neighborRow >= 0 && neighborRow < board.length &&
            neighborCol >= 0 && neighborCol < board[0].length
        ) {
            if (board[neighborRow][neighborCol].isMine) {
                mineCount++
            }
        }
    }

    gBoard[index.i][index.j].minesAroundCount = mineCount
}

function checkVictory() {
    var counter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                counter++
            }
        }
    }
    return counter === gBoard.length ** 2 - gLevel.MINES
}


function gameOver(isWin) {
    var elMsg = document.querySelector('.out-come-msg')
    if (!isWin) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    var elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerText = MINE
                    elMsg.innerText = 'You Lose, try again'
                }
            }
        }
    }
    if (isWin) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    var elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerText = MARKED
                    elMsg.innerText = 'You Win! Good game'
                }
            }
        }
    }

    gTimer = clearInterval(gTimer)
    gGame.isOn = false
    showElement('.good-game')

}

function startTimer() {
    var startTime = Date.now()
    const timerDisplay = document.querySelector('.timer')
    gTimer = setInterval(() => {
        var formattedTime = getTimeFormat(startTime)
        timerDisplay.innerText = formattedTime
        var timeArr = formattedTime.split(':')
        if (gGame.secsPassed !== +timeArr[0]) {
            gGame.secsPassed = +timeArr[0]
        }
    }, 10)
}

function resetTimer() {
    gTimer = clearInterval(gTimer) // Stop the timer
    const timerDisplay = document.querySelector('.timer')
    if (timerDisplay) {
        timerDisplay.innerText = `00 : 000` // Reset display
    }

}