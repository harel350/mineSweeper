

export function openSquare(boardGame, locationX, locationY) {
    boardGame[locationX][locationY].isActive = true
    let i = locationX;
    let j = locationY;

    if (i > 0) {
        //option 1
        if (j > 0)
            if (!boardGame[i - 1][j - 1].isActive && boardGame[i - 1][j - 1].number == 0) {
                openSquare(boardGame, i - 1, j - 1)
            } else {
                
                    boardGame[i - 1][j - 1].isActive = true

            }

        //option 2
        if (!boardGame[i - 1][j].isActive && boardGame[i - 1][j].number == 0) {

            openSquare(boardGame, i - 1, j)
        }
        else {
           
            boardGame[i - 1][j].isActive = true

        }


        //option 3
        if (j < boardGame.length - 1)
            if (!boardGame[i - 1][j + 1].isActive && boardGame[i - 1][j + 1].number == 0) {
                openSquare(boardGame, i - 1, j + 1)
            } else {
                
                boardGame[i - 1][j + 1].isActive = true

            }

    }
    //option 4
    if (j < boardGame.length - 1) {
        if (!boardGame[i][j + 1].isActive && boardGame[i][j + 1].number == 0) {
            openSquare(boardGame, i, j + 1)
        }
        else {
            
            boardGame[i][j + 1].isActive = true
        }
    }



    if (i < boardGame.length - 1) {
        //option 5
        if (j < boardGame.length - 1)
            if (!boardGame[i + 1][j + 1].isActive && boardGame[i + 1][j + 1].number == 0) {
                openSquare(boardGame, i + 1, j + 1)
            } else {
               
                boardGame[i + 1][j + 1].isActive = true

            }
        //option 6
        if (!boardGame[i + 1][j].isActive && boardGame[i + 1][j].number == 0) {
            openSquare(boardGame, i + 1, j)
        }
        else {
            
            boardGame[i + 1][j].isActive = true

        }


        //optino 7
        if (j > 0)
            if (!boardGame[i + 1][j - 1].isActive && boardGame[i + 1][j - 1].number == 0) {
                openSquare(boardGame, i + 1, j - 1)
            } else {
                
                boardGame[i + 1][j - 1].isActive = true
            }
    }
    //option 8
    if (j > 0) {
        if (!boardGame[i][j - 1].isActive && boardGame[i][j - 1].number == 0) {
            openSquare(boardGame, i, j - 1)
        }
        else {
            
            boardGame[i][j - 1].isActive = true
        }
    }

    return true

}

