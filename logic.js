let board;
let score = 0;

let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    document.getElementById("board").innerHTML = ""; // Clear board before setting up
    document.getElementById("score").innerText = score; // Ensure score starts at 0

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }
    
    setOne();
    setOne();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "tile"; // Reset classes

    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num);
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function () {
    setGame();
    document.addEventListener("keydown", handleSlide);
};

function handleSlide(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        let moved = false;

        if (event.code === "ArrowLeft" && canMoveLeft()) {
            slideLeft();
            moved = true;
        } else if (event.code === "ArrowRight" && canMoveRight()) {
            slideRight();
            moved = true;
        } else if (event.code === "ArrowUp" && canMoveUp()) {
            slideUp();
            moved = true;
        } else if (event.code === "ArrowDown" && canMoveDown()) {
            slideDown();
            moved = true;
        }

        if (moved) {
            setOne();
            updateScore(); // Update score immediately
            setTimeout(() => {
                if (hasLost()) {
                    alert("GAME OVER! CLICK ANY KEY TO RESTART");
                    restartGame();
                } else {
                    checkWin();
                }
            }, 100);
        }
    }
}

function restartGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    setGame();
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r]);
        updateRow(r);
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r].reverse()).reverse();
        updateRow(r);
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = board.map(row => row[c]);
        col = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = board.map(row => row[c]).reverse();
        col = slide(col).reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function updateRow(r) {
    for (let c = 0; c < columns; c++) {
        updateTile(document.getElementById(r + "-" + c), board[r][c]);
    }
}

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; // Increase score on merge
        }
    }

    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function updateScore() {
    document.getElementById("score").innerText = score;
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function setOne() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
            found = true;
        }
    }
}

function canMoveLeft() {
    return board.some(row => row.some((val, c) => c > 0 && (val === row[c - 1] || row[c - 1] === 0)));
}

function canMoveRight() {
    return board.some(row => row.some((val, c) => c < columns - 1 && (val === row[c + 1] || row[c + 1] === 0)));
}

function canMoveUp() {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) {
            if (board[r][c] !== 0 && (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] !== 0 && (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 2048 && !is2048Exist) {
                alert("You win! Ang galing mo!");
                is2048Exist = true;
            } else if (board[r][c] === 4096 && !is4096Exist) {
                alert("Lupit mo!");
                is4096Exist = true;
            } else if (board[r][c] === 8192 && !is8192Exist) {
                alert("Galing mo! Edi ikaw na!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    return !hasEmptyTile() && !canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown();
}
