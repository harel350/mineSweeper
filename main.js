import { createElements, removeAllChildren } from './helpFunction.js'
import { openSquare } from './openSquare.js'


var boardGame = []
var bombLocation = []

var timer;
var timerInterval = setInterval(countUp, 1000)

var DifficultyLevel = 1;
var initFlag;

var boardGameContainer = document.getElementById('boardGameContainer')


//function to start new game
function startNewGame() {

    //reset timer
    clearInterval(timerInterval);
    timer = 0;
    document.getElementById('Timer').innerText = '00:00:00'
    //-------------//

    //clear old board and add new background
    removeAllChildren(boardGameContainer)
    document.body.style.backgroundImage = `url('./assets/background${DifficultyLevel}.jpg')`
    //-------------//

    //determine how much bombs  will be in the game according level
    if (DifficultyLevel == 1) {
        initFlag = 2
    }
    if (DifficultyLevel == 2) {
        initFlag = 12
    }
    if (DifficultyLevel == 3) {
        initFlag = 30
    }
    document.getElementById('leftFlag').innerText = initFlag
    //-------------//

    //initial new board game
    boardGame = []
    bombLocation = []
    initBoard()

    //-------------//
}

//create initial board game
function initBoard() {

    //create array of array of square with initial setup
    let row = DifficultyLevel * 4
    for (let i = 0; i < row; i++) {
        let rowBoard = [];
        for (let j = 0; j < row; j++) {
            let squareInfo = {
                location: { i, j },
                number: 0,
                isBomb: false,
                isActive: false,
                isFlag: false
            }
            rowBoard.push(squareInfo)
        }
        boardGame.push(rowBoard)
    }
    //-------------//
    //create visual board game
    createBoardGame()
    //-------------//



}

//function to add bomb to the board game according the first click of user
function randomBomb(initI, initJ) {

    //row variable for to randomize the bomb according the size of board game
    let row = DifficultyLevel * 4;
    var bomb = initFlag

    //add bombs to the board game, number of the bombs determined by the level
    while (bomb > 0) {

        let i = Math.floor(Math.random() * row)
        let j = Math.floor(Math.random() * row)
        if (!isOklocatinToBomb(initI, initJ, i, j)) {
            continue;
        }
        if (!boardGame[i][j].isBomb) {
            boardGame[i][j].isBomb = true;
            bomb--;
            bombLocation.push({ i, j })
        }
    }
    //add a number to the board according bombs location
    locateNumber()

}

// function to locate number accordind the bomb
function locateNumber() {
    for (let indexBomb = 0; indexBomb < bombLocation.length; indexBomb++) {
        let i = bombLocation[indexBomb].i
        let j = bombLocation[indexBomb].j
        if (i > 0) {
            boardGame[i - 1][j].number += 1;
            if (j < boardGame.length - 1)
                boardGame[i - 1][j + 1].number += 1;
            if (j > 0)
                boardGame[i - 1][j - 1].number += 1;
        }
        if (i < boardGame.length - 1) {
            boardGame[i + 1][j].number += 1;
            if (j < boardGame.length - 1)
                boardGame[i + 1][j + 1].number += 1;
            if (j > 0)
                boardGame[i + 1][j - 1].number += 1;
        }
        if (j > 0)
            boardGame[i][j - 1].number += 1;
        if (j < boardGame.length - 1)
            boardGame[i][j + 1].number += 1;
    }
    //clear the number from square contain bomb
    for (let indexBomb = 0; indexBomb < bombLocation.length; indexBomb++) {
        let i = bombLocation[indexBomb].i
        let j = bombLocation[indexBomb].j
        boardGame[i][j].number = -1
    }

}

//function to create visul board and add click event
function createBoardGame() {

    //create board game visual
    for (let i = 0; i < boardGame.length; i++) {
        let boardRow = createElements('div', boardGameContainer, null, `rowID_${i}`, null, 'd-flex w-100')
        for (let j = 0; j < boardGame.length; j++) {
            let square = createElements('div', boardRow, null, `i_${i}_j_${j}`, null, 'square')

            //add onclick event for each square
            square.onclick = () => {

                //The position of the pressed square
                let locationById = square.id.split("_")
                let i = parseInt(locationById[1])
                let j = parseInt(locationById[3])
                //-------------//
                //check if the game is started its relevant  only for the first click
                let isGameStart = boardGame.every(item => item.every(i => !i.isActive))
                //-------------//

                //add bomb to the board game only in the first click
                if (isGameStart) {
                    randomBomb(i, j)
                    timerInterval = setInterval(countUp, 1000)
                }
                //-------------//
                //check if the position of the pressed square is flag if yes - add +1 to flag that left and off the square
                if (boardGame[i][j].isFlag) {
                    updateLeftFlag()
                    boardGame[i][j].isFlag = false
                    boardGame[i][j].isActive = false
                    showAllActive()
                    removeAllChildren(document.getElementById(`i_${i}_j_${j}`), document.getElementById(`i_${i}_j_${j}_flag`))
                    return;
                }
                //-------------//
                //check if the position of the pressed square is bomb
                if (boardGame[i][j].isBomb) {

                    showBomb(i, j)
                }
                //-------------//
                //check if the position of the pressed square is empty square
                if (boardGame[i][j].number == 0) {
                    openSquare(boardGame, i, j)
                    showAllActive()

                } else {
                    boardGame[i][j].isActive = true
                    showAllActive()
                }

            }
            //-------------//
            //add right click event for each square
            square.addEventListener('contextmenu', (e) => {

                e.preventDefault();
                //The position of the pressed square
                let locationById = square.id.split("_")
                let i = parseInt(locationById[1])
                let j = parseInt(locationById[3])
                //-------------//
                //check if the game is started its relevant  only for the first click
                let isGameStart = boardGame.every(item => item.every(i => !i.isActive))
                //-------------//

                //add bomb to the board game only in the first click
                if (isGameStart) {
                    randomBomb(i, j)
                }
                //-------------//
                //check if the position of the pressed square is empty square if yes does not place a flag
                if (boardGame[i][j].number == 0) {
                    openSquare(boardGame, i, j)
                    showAllActive()
                }
                //if dont check if the square is active, if dont place a flag
                else {
                    if (boardGame[i][j].isActive) {
                        return;
                    }
                    else {
                        let flagIcon = createElements('i', document.getElementById(e.srcElement.id), null, `${e.srcElement.id}_flag`, null, 'fa-solid fa-flag')
                        flagIcon.style.color = 'red'
                        updateLeftFlag('down')
                        boardGame[i][j].isFlag = true
                        boardGame[i][j].isActive = true
                        showAllActive()
                    }

                }
                //-------------//

            }, false);
            //-------------//
        }
    }

}

//function to show all active square
function showAllActive() {

    //The loop goes through each element in the array and checks if the square is active or not
    for (let i = 0; i < boardGame.length; i++) {
        for (let j = 0; j < boardGame.length; j++) {
            if (boardGame[i][j].isActive && boardGame[i][j].number == 0 && !boardGame[i][j].isFlag) {

                document.getElementById(`i_${i}_j_${j}`).style.opacity = 0.6
            }
            if (boardGame[i][j].isActive && boardGame[i][j].number > 0 && !boardGame[i][j].isFlag) {
                let number = boardGame[i][j].number
                document.getElementById(`i_${i}_j_${j}`).innerText = number
                let red = (225 / number).toString()
                let green = (21 * number).toString()
                let blue = (89 / number).toString()
                document.getElementById(`i_${i}_j_${j}`).style.color = `rgb(${red},${green},${blue})`
            }

        }
    }
    //check if all active

    let isGameOver = boardGame.map(item => item.filter(i => i.isActive && !i.isFlag))
    let countActive=0
    let countBoard = 0
    let countBomb = bombLocation.length;
    for (let i = 0; i < isGameOver.length; i++) {
        countActive += isGameOver[i].length
    }
    for (let i = 0; i < boardGame.length; i++) {
        countBoard += boardGame[i].length
    }
    console.log(countBoard,countBomb,countActive)
    
    if (countBoard - countBomb == countActive) {
        showMessage('Won game')
        startNewGame()

    }

}

//function to show all the bomb 
async function showBomb(locationX, locationY) {
    //Moves the clicked bomb to the beginning of the array
    let selectedBomb = bombLocation.findIndex(item => item.i === locationX && item.j === locationY)
    bombLocation = [...bombLocation.slice(selectedBomb), ...bombLocation.slice(0, selectedBomb)]
    //-------------//

    //Disable the option to press any button until the bomb detection is complete
    document.getElementById('levelSelector').style.pointerEvents = 'none'
    document.getElementById('boardGameContainer').style.pointerEvents = 'none'
    //-------------//

    new Promise((resolve, reject) => {
        for (let i = 0; i < bombLocation.length; i++) {
            new Promise((resolve, reject) => {
                let idElement = `i_${bombLocation[i].i}_j_${bombLocation[i].j}`
                setTimeout(() => resolve(idElement), 300 * i)
            }).then(idElement => {
                removeAllChildren(document.getElementById(`i_${bombLocation[i].i}_j_${bombLocation[i].j}`), document.getElementById(`i_${bombLocation[i].i}_j_${bombLocation[i].j}_flag`))
                let bombIcon = createElements('i', document.getElementById(idElement), null, null, null, 'fa-solid fa-bomb')

            })
        }
        setTimeout(resolve, bombLocation.length * 300 + 2000)
    }).then(() => {

        removeAllChildren(boardGameContainer);
        document.getElementById('levelSelector').style.pointerEvents = 'all'
        document.getElementById('boardGameContainer').style.pointerEvents = 'all'
        startNewGame();
        showMessage('Game over')
    })






}

//add or remove to count of left flag
function updateLeftFlag(downOrUp) {
    if (downOrUp == 'down')
        initFlag--
    else {
        initFlag++
    }

    document.getElementById('leftFlag').innerText = initFlag
}

//when user change level
document.getElementById('levelSelector').onchange = () => {
    let isGameStart = boardGame.find(item => item.find(i => i.isActive))

    if (isGameStart) {
        showMessage('Change level')
        return;
    }
    DifficultyLevel = document.getElementById('levelSelector').value
    removeAllChildren(boardGameContainer)
    startNewGame()
}

//timer function
function countUp() {
    var timerElement = document.getElementById("Timer");
    setTime()
    function setTime() {
        ++timer;
        timerElement.innerHTML = pad(parseInt(timer / 3600)).toString() + ':' + pad(parseInt(timer / 60)).toString() + ':' + pad(timer % 60);

    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}

//show modal according kind of message
function showMessage(kindOfMsg) {
    let headerText = ''
    let buttonText = ''
    let bodyText = ''
    let actionButton = () => { }

    switch (kindOfMsg) {
        case 'Game over':
            headerText = 'Game Over';
            bodyText = 'Oops, you hit a mine';
            buttonText = `Try Again`;


            break;
        case 'Won game':
            let time = document.getElementById("Timer").innerText
            let level;
            if (DifficultyLevel == 1) {
                level = 'Easy'
            }
            if (DifficultyLevel == 2) {
                level = 'Meduim'
            }
            if (DifficultyLevel == 3) {
                level = 'Hard'
            }
            headerText = 'You Won';
            bodyText = `Congratulations, you finished the game on an ${level} level in a time of ${time}`;
            buttonText = `Add to the leaderboard`;
            actionButton = () => {
                let tbody = document.getElementById('tbody')
                let tr = createElements('tr', tbody)
                let th = createElements('th', tr, tbody.childElementCount)
                let tdName = createElements('td', tr, 'Harel')
                let tdLevel = createElements('td', tr, level)
                let tdtime = createElements('td', tr, time)
                startNewGame()
            }
            break;
        case 'Change level':
            headerText = 'Attention';
            bodyText = `You are in the middle of a game, the system detected an attempt to change the difficulty level, are you sure?`;
            buttonText = `Yes,let's do it`;
            actionButton = () => {
                DifficultyLevel = document.getElementById('levelSelector').value
                startNewGame()
            }
            break;
        default:
            break;
    }
    document.getElementById('exampleModalLabel').innerText = headerText
    document.getElementById('bodyContentModal').innerText = bodyText
    document.getElementById('buttonModal').innerText = buttonText
    document.getElementById('buttonModal').onclick = () => actionButton()
    document.getElementById('closeButton').onclick = () => {
        document.getElementById('levelSelector').value = DifficultyLevel
    }
    document.getElementById('modalButton').click()
}

//check if specific postion its ok for bomb
function isOklocatinToBomb(initI, initJ, i, j) {
    if (i == initI && j == initJ) return false
    if (i == initI - 1 && j == initJ - 1) return false
    if (i == initI - 1 && j == initJ) return false
    if (i == initI - 1 && j == initJ + 1) return false
    if (i == initI && j == initJ + 1) return false
    if (i == initI + 1 && j == initJ + 1) return false
    if (i == initI + 1 && j == initJ) return false
    if (i == initI + 1 && j == initJ - 1) return false
    if (i == initI && j == initJ - 1) return false
    return true

}

startNewGame()
