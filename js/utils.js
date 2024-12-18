'use strict'

const gNeighborOffsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
]

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function showElement(selector) {
    var el = document.querySelectorAll(selector)
    for (var i = 0; i < el.length; i++) {
        el[i].classList.remove('hide')
    }

}

function hideElement(selector) {
    var el = document.querySelectorAll(selector)
    for (var i = 0; i < el.length; i++) {
        el[i].classList.add('hide')
    }

}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
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

function expandShown(board, elCell, i, j) {
    // Check if the current cell is out of bounds
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return

    // If the current cell is already shown -> return
    if (board[i][j].isShown) return

    // If the clicked cell is a mine -> return
    if (board[i][j].isMine) return

    gBoard[i][j].isShown = true
    for (var k = 0; k < gNeighborOffsets.length; k++) {
        var di = gNeighborOffsets[k][0]
        var dj = gNeighborOffsets[k][1]

        var ni = i + di
        var nj = j + dj

        if (ni >= 0 && ni < board.length && nj >= 0 && nj < board[0].length) {
            if (!board[ni][nj].isMine && !board[ni][nj].isShown) {
                elCell = document.querySelector(`.cell-${ni}-${nj}`)
                onCellClicked(elCell, ni, nj)
            }
        }
    }
}



