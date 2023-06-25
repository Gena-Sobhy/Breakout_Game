// board 
let board;
let boardWidth = 500;
let boardHeight = 500;
let ctx;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX =10;

let player = {
    x: boardWidth/2 -playerWidth/2,
    y: boardHeight -playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth/2,
    y:boardHeight/2 ,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//blocks
let blockArary = [] ;
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as game goes on 
let blockMaxRows =10; // limit how many rows
let blockCount = 0;

//starting block corners top left
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    ctx = board.getContext("2d");

    // draw initial player
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(player.x ,player.y,player.width,player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown" , movePlayer);

    //create blocks
    createBlocks();
};

function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0 ,0 ,boardWidth, boardHeight);

    //player
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(player.x ,player.y,player.width,player.height);

    ctx.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ctx.fillRect(ball.x ,ball.y,ball.width,ball.height)

    //bounce ball off walls
    if(ball.y <= 0){
        // if ball touches top of canvas
        ball.velocityY *= -1;
    }else if (ball.x <= 0 ||( ball.x +ball.width) >= boardWidth){
        // if ball touches left or right of canvas
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        ctx.font = "20px sans-serif";
        ctx.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //bounce the ball off player paddle
    if(topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1; // flip y direction up or down
    } else if( leftCollision (ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1; // flip x direction right or left
    }

    //blocks
    ctx.fillStyle = "skyBlue";
    for (let i = 0; i < blockArary.length; i++) {
        let block = blockArary[i];
        if(!block.break) {
            if(topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
                score += 100;
            }
            else if(leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                score += 100;
            }
            ctx.fillRect(block.x, block.y, block.width , block.height);
        }
    }

    //next level
    if(blockCount == 0 ) { 
        score += 100*blockRows*blockColumns; // bonus points :)
        blockRows = Math.min(blockRows+ 1 , blockMaxRows);
        createBlocks();
    }

    //score
    ctx.font = "20px sans-serif";
    ctx.fillText(score , 10,25);
};

function outOfBound(xPosition) {
    return (xPosition<0 || xPosition + playerWidth > boardWidth);
};

function movePlayer(e) {
    if (gameOver) {
        if(e.code == "Space"){
            resetGame();
        }
        return;
    }

    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextPlayerX = player.x - player.velocityX;
        if(!outOfBound(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    } else if (e.code == "ArrowRight")  {
        // player.x += player.velocityX;
        let nextPlayerX = player.x + player.velocityX;
        if(!outOfBound(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
};
    
function detectCollision(a , b) {
    return a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x  && // a's top right corner passes b's top left corner
        a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y; // a's bottom left corner passes b's top left corner
};

function topCollision(ball, block) { // a is above b(ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
};

function bottomCollision(ball, block) { //a is below b(ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
};

function leftCollision(ball , block) { // a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball , block) { // a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArary = [];
    for (let i = 0; i < blockColumns; i++) {
        for (let j = 0; j < blockRows; j++) {
            let block = {
                x: blockX + i*blockWidth + i*10, //i*10 space 10px apart columns
                y: blockY + j*blockHeight + j*10, //j*10 space 10px apart rows
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArary.push(block);
        }
    }
    blockCount = blockArary.length;
};

function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth/2 -playerWidth/2,
        y: boardHeight -playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    }
    ball = {
        x: boardWidth/2,
        y:boardHeight/2 ,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    }
    blockArary = [] ;
    blockRows = 3;
    score = 0 ;
    createBlocks() ;
}     