//To Do:
//Sidekollisjon bombe
//forklaring av knapper og bombe


let board
let boardWidth = 800 //800
let boardHeight = 720 //720
let ctx

//spiller
let playerWidth = 100
let playerHeight = 15
let playerVelocityX = 20 //siste level: 54

let player = {
    x : boardWidth/2 - playerWidth/2, //Representerer den horisontale posisjonen til spilleren på brettet
    y : boardHeight - playerHeight - 15, //Plasseres nær bunnen av brettet, med litt margin (-15)
    width : playerWidth,
    height : playerHeight,
    velocityX: playerVelocityX
}

//Ball
let ballWidth = 10
let ballHeight = 10
let ballVelocityX = 3 //siste level: 6.4 //4
let ballVelocityY = 3 //siste level: 5.4 //3

//objekt for ball
let ball = {
    x : boardWidth/2,
    y : boardHeight/1.1,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blokker
let blockArray = []
let blockWidth = 60 //60
let blockHeight = 20 //20
let blockColumns =  10 //10
let blockRows = 3 //legger til mer ettersom spillet fortsetter //3
let blockMaxRows = 10 //grense på hvor mange rader det kan bli
let blockCount = 0

//start blokk topp venstre hjørne
let blockX = 15
let blockY = 45

let score = 0
let highscore = localStorage.getItem("highscore") || 0
let level = 1
let gameOver = false

//Bombe
let bomb = {
    x: Math.random() * (boardWidth - 50), // Tilfeldig startposisjon innenfor brettets bredde
    y: 200, // Startposisjon nær toppen av brettet
    width: 80, //50
    height: 15, //50
    velocityX: 2, // Hastighet i x-retning
    velocityY: 0 // Hastighet i y-retning
}



window.onload = function() { //onload = kjøres når vinduet er ferdig lastet inn
    board = document.getElementById("board")
    board.height = boardHeight
    board.width = boardWidth
    ctx = board.getContext("2d") //For å kunne tegne på brettet

    //Tegne spiller
    ctx.fillStyle = "lightblue"
    ctx.fillRect(player.x, player.y, player.width, player.height)

    requestAnimationFrame(update)//Skrives først her for å starte animasjonsløkken
    document.addEventListener("keydown", movePlayer)

    //lage blokker
    createBlocks()
}

//"Game loop"
function update() { //For å oppdatere framen
    requestAnimationFrame(update)
    if(gameOver) {
        //Setter ny highscore
        if (score > highscore){
            localStorage.setItem("highscore", score)
            highscore = localStorage.getItem("highscore") || 0
        }
        
    }
    ctx.clearRect(0, 0, board.width, board.height) //Fjerner den tidligere posisjonen til spilleren
    
    //spiller
    ctx.fillStyle = "lightgreen"
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Ball
    ctx.fillStyle = "white";
    ball.x += ball.velocityX //posisjonen i x-retning øker med ballVelocityX
    ball.y += ball.velocityY //posisjonen i y-retning øker med ballVelocityY
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height)

    //hvis ball treffer toppen av canvas
    if(ball.y <= 0) {
        ball.velocityY *= -1 //motsatt retning
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        //hvis ballen treffer høyre eller venstre av canvas
        ball.velocityX *= -1
    }
    else if (ball.y + ball.height >= boardHeight) {
        //hvis ball treffer bunnen av canvas = game over
        ctx.font = "30px Arial"
        ctx.fillText("Game Over: press 'space' to restart", 150, 500)
        gameOver = true
    }

    //ball sprette av spiller (Med endring av x fart)
    if(topCollision(ball, player) || bottomCollision(ball, player)){
        ball.velocityY *= -1 //Endre y retningen opp eller ned
        
        if (rightCollisionPlayer(ball, player)){
            ball.velocityX += 1; //0.5
            console.log("høyre")
        }
        if (leftCollisionPlayer(ball, player)){
            ball.velocityX -= 1; //0.5
            console.log("venstre")
        }
    }
    // Sjekk om ballen treffer bomben
    if(level >= 3){
    if (detectCollision(ball, bomb)) {
        if (topCollisionBomb(ball, bomb) || bottomCollisionBomb(ball, bomb)) {
            ball.velocityY *= -1 //endre y retning på ballen
            score -= 100
            console.log("topp/bunn kollisjon")
        }
        if (leftCollisionBomb(ball, bomb) || rightCollisionBomb(ball, bomb)) {
            ball.velocityX *= -1 //endre x retning til ballen
            score -= 100
            console.log("venstre/høyre kollisjon")
        }
    }  
}

    // Sjekk om bomben skal vises på canvaset (fra nivå 2)
    if (level >= 3) {
        //bombe
        ctx.fillStyle = "red" // Farge for bomben (kan endres etter behov)
        ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height)

        // Oppdater bombens posisjon
        bomb.x += bomb.velocityX
        bomb.y += bomb.velocityY

        // Sjekk om bomben treffer venstre eller høyre side av brettet
        if (bomb.x <= 0 || bomb.x + bomb.width >= boardWidth) {
            bomb.velocityX *= -1 // Endre retningen hvis bomben treffer sidene
        }
    }

    //blokker
    //går gjennom blokkene i blockArray, sjekker om de er ødelagt || ikke,  tegner de !ødelagte blokkene
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i]
        if (!block.break) {
           if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true; //blokk blir ødelagt
                ball.velocityY *= -1 //endre y retning på ballen
                blockCount -= 1
                score += 100
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                console.log("ball på venstre eller høyre side")
                block.break = true
                ball.velocityX *= -1 //endre x retning på ballen
                blockCount -= 1
                score += 100
            }
            if (!block.color) {
                // Generer en tilfeldig farge for blokken hvis den ikke allerede har en farge
                block.color = randomBlockColor()
            }
            ctx.fillStyle = block.color // Bruk blokkens lagrede farge
            ctx.fillRect(block.x, block.y, block.width, block.height)
        }
    }

    //nye leveler
    if (blockCount == 0) {//Hvis alle blokkene er borte
        score += 100 * blockColumns //bonus poeng
        //Øker farten til ballen, og spilleren
        ballVelocityY += .3
        ballVelocityX += .3
        player.velocityX += 4
        
        blockRows = Math.min(blockRows + 1, blockMaxRows) //legg til en rad for hver level
        createBlocks()
        level += 1;

        //Setter posisjonen til ballen til start posisjon
        ball = {
            x : player.x,
            y : boardHeight/1.1,
            width : ballWidth,
            height : ballHeight,
            velocityX : ballVelocityX,
            velocityY : ballVelocityY
        };
    }
    
    //Level
    ctx.font = "35px Comic Sans MS"
    ctx.fillText(`Level: ${level}`, 340, boardHeight/2)
    //score
    ctx.font = "20px Comic Sans MS"
    ctx.fillText("score:" + score, 40, 25)

    //highscore
    ctx.font = "20px Comic Sans MS"
    ctx.fillText("Highscore: " + highscore, 600, 25)
};

// Funksjon for å velge tilfeldig farge fra arrayet
function randomBlockColor() {
    // Definer et array med farger du ønsker å velge fra
    let blockColors = ["pink", "lightgreen", "lightblue", "orange", "yellow", "MediumOrchid", "turquoise", "lime", "chartreuse", "gold"]
    //Velger tilfeldig farge fra arrayet
    let randomColor = Math.floor(Math.random() * blockColors.length)
    // Returner fargen på denne indeksen
    return blockColors[randomColor]
}

//Setter grenser på venstre og høyre siden
function outOfBounds(xPosition){
    return (xPosition < -playerWidth || xPosition > boardWidth) 
}

//Funksjon for å flytte spiller til venstre/høyre
function movePlayer(e) {
    if(gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
    }
    if (e.code == "ArrowLeft"){
        let nextPlayerX = player.x - player.velocityX //Ny posisjon
        
        // Sjekker om den nye posisjonen vil være utenfor venstre kant
        if(nextPlayerX < 0) {
            player.x = 0; // Justerer posisjonen til å være helt til venstre
        } else {
            player.x = nextPlayerX; // Oppdaterer posisjonen
        }
    }
    else if (e.code == "ArrowRight"){
        let nextPlayerX = player.x + player.velocityX
        
        // Sjekker om den nye posisjonen vil være utenfor høyre kant
        if(nextPlayerX + player.width > boardWidth) {
            player.x = boardWidth - player.width // Justerer posisjonen til å være helt til høyre
        } else {
            player.x = nextPlayerX // Oppdaterer posisjonen
        }
    }
}

function detectCollision(a, b) { //2 rektangler: a og b
    return a.x < b.x + b.width && //a's øvre venstre hjørne når ikke b's øverste høyre hjørne
    a.x + a.width > b.x &&  //a's øvre høyre hjørne passerer b's øverste venstre hjørne
    a.y < b.y + b.height && //a's øvre venstre hjørne når ikke b's nedre venstre hjørne
    a.y + a.height > b.y; //a's nedre venstre hjørne passerer b's øvre venstre hjørne
}

//Funksjoner for kollisjon oppå, under, venstre og høyre av blokkene
function topCollision(ball, block) {
    return detectCollision(ball, block) && block.y >= ball.y //ball: y+h >= block: y
}
 
function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) <= ball.y + ball.height //block: y+h >= ball: y
}

function leftCollision(ball, block) { 
    return detectCollision(ball, block) && (ball.x-ball.width) <= block.x
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= (block.x + block.width)
}

function rightCollisionPlayer(ball, player) {
    return detectCollision(ball, player) && ball.x > player.x + player.width / 2
}

function leftCollisionPlayer(ball, player) {
    return detectCollision(ball, player) && ball.x < player.x + player.width / 2
}

function topCollisionBomb(ball, bomb) {
    return detectCollision(ball, bomb) && bomb.y >= ball.y //ball: y+h >= bomb: y
}

function bottomCollisionBomb(ball, bomb) {
    return detectCollision(ball, bomb) && (bomb.y + bomb.height) <= ball.y + ball.height //bomb: y+h >= ball: y
}

function leftCollisionBomb(ball, bomb) { 
    return detectCollision(ball, bomb) && (ball.x-ball.width) <= bomb.x
}

function rightCollisionBomb(ball, bomb) {
    return detectCollision(ball, bomb) && (ball.x + ball.width) >= (bomb.x + bomb.width)
}
function createBlocks(){
    blockArray = []; // Tømmer blockArray
    for (let c = 0; c < blockColumns; c++) { // Setter x-posisjonen til blokkene. blockX = startposisjonen langs x-aksen. c * blockWidth = avstand mellom hver blokk 
        for (let r = 0; r < blockRows; r++) { // Setter y-posisjonen til blokkene. blockY = startposisjonen langs y-aksen. r * blockHeight = avstand mellom hver blokk i raden.
            let block = { // Plasserer blokkene etter hverandre
                x : blockX + c * blockWidth + c * 19, //19px mellom blokkene horisontalt 
                y : blockY + r * blockHeight + r * 20, //20px mellom blokken vertikalt
                width : blockWidth,
                height : blockHeight,
                break : false
            };
            blockArray.push(block) // Legger block i en array
        }
    }
    blockCount = blockArray.length
}

function resetGame() { //Setter spiller og ball tilbake til start posisjon
    gameOver = false;

    player = {
        x : boardWidth/2 - playerWidth/2, //Representerer den horisontale posisjonen til spilleren på brettet
        y : boardHeight - playerHeight - 15, //Plasseres nær bunnen av brettet, med litt margin (-15)
        width : playerWidth,
        height : playerHeight,
        velocityX: playerVelocityX
    };
    
    ball = {
        x : boardWidth/2,
        y : boardHeight/1.1,
        width : ballWidth,
        height : ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    };
    blockArray = []
    blockRows = 3
    score = 0
    createBlocks()
    
    bomb = {
        x: Math.random() * (boardWidth - 50), // Tilfeldig startposisjon innenfor brettets bredde
        y: 200, // Startposisjon nær toppen av brettet
        width: 80, //50
        height: 15, //50
        velocityX: 2, // Hastighet i x-retning
        velocityY: 0 // Hastighet i y-retning
    };
}