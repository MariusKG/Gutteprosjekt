//Gjør at siden ikke laster inn, før alt fra DOM er lastet inn
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) //lager et array for alle de 200 div elementene i grid. De får hver sin verdi fra 0-199
    let scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#startButton') 
    const width = 10
    nextRandom = 0
    const colors = [
        'orange',
        'pink',
        'rgb(30,180,90)',
        'yellow',
        'MediumOrchid',
        'gold'
      ]
      let score = 0


   //Tetrominoer(navn for figurene). Lager de ulike formene tetris-blokkene kommer i. Bokastavene representerer formene
   const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
   ]
   const lTetromino = [
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2+1,width*2],
    [width,width*2,width*2+1,width*2+2],
   ]

   const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1],
   ]

   const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
   ]
   const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1],
   ]

   const tetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

   //lage startposisjon for tetrominoene. Position gjør så de starter midt på og Rotation så de starter riktig vei
   let currentPosition = 4
   let currentRotation = 0

   //henter en tilfeldig figur fra "tetrominoes"-arrayet
   let random = Math.floor(Math.random()*tetrominoes.length)
   let current = tetrominoes[random][0]

   //lager en funksjon for å tegne den første tetrominoene
   function draw() {
    current.forEach(index=>{
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
   }

   //lager en funksjon for å fjerne en tetromino
   function undraw (){
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
        
    })
   }


   // tid for hvor ofte tetrominoene skal falle nedover ved å kalle funksjonen moveDown som står nedenfor og ved å angi tid (i ms)
   timerId = setInterval(moveDown,500)

   //Alle knapper på tastaturet har en keycode, som man kan bruke for å hente ved funksjoner ved tryk av denne keycoden. Her lager jeg funskjoner for de ulike keycodene så man kan bevege på tetrominoene senere i koden
   function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    }
     else if(e.keyCode === 39){
        moveRight()
     }
     else if(e.keyCode === 38){ //Rotasjon for knapp opp
        rotate()
     }
     else if(e.keyCode === 40){ //Flytter blokken nedover raskere for knapp ned
        moveDown() 
     }
   }
   document.addEventListener('keyup',control)//Når knappen slippes skjer funksjonen


   //lager en funksjon for når tetrominoene faller nedover
   function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()//legger til funskjonen nedenfor, så sjekkes det om tetrominoen skal stoppe hver gang den går nedover
   }

   //lager en funskjon for at blokkene skal stoppe
   function freeze() {
    if(
        current.some(index => squares[currentPosition + index + width].classList.contains('full')) 
        ||  
        current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
    ){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //gjør så en ny tertomino starter når forrige stopper 
        random = nextRandom
        nextRandom = Math.floor(Math.random()*tetrominoes.length)
        current = tetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        addScore()
        gameOver()
    }
    }
    

    //Lager en funksjon for game-over
    function gameOver() {
        if(
            current.some(index => squares[currentPosition + index + width].classList.contains('gameOver')) 
            &&
            current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
        ){
            console.log("gameover")
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
    
        }
    }
       
    

//Lager en funksjon for å flytte tetrominoen til venstre, men så den stopper når man treffer kanten
function moveLeft(){
    undraw()
    let leftEdge = current.some(index => (currentPosition +index)% width === 0)//Hvis posisjonen delt på 10 = 0 i rest, vil det si at den er et sted i 10-gangen altså i div-ene som ligger til venstre(pga flex wrap)
    if(!leftEdge) currentPosition -=1 //
    //lager en funksjon som flytter tetromioen en tilbake mot høyre dersom den treffer på en annen tetromino til venstre
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
    }

    draw()
}

//Lager en funksjon for å flytte tetrominoen til høyre, men så den stopper når man treffer kanten
function moveRight(){
    undraw()
    let rightEdge = current.some(index => (currentPosition +index) % width === width-1)//Hvis posisjonen delt på 10 = 0 i rest, vil det si at den er et sted i 10-gangen altså i div-ene som ligger til venstre(pga flex wrap)
    if(!rightEdge) currentPosition +=1 //
    //lager en funksjon som flytter tetromioen en tilbake mot venstre dersom den treffer på en annen tetromino til høyre
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }

    draw()
}


//funksjon for å rotere tetromioen
function rotate (){
    undraw()
    currentRotation = (currentRotation + 1) % current.length
    current = tetrominoes[random][currentRotation]
    draw()
}

//Funksjon for å fjerne tetrominoer når du har 10 ved siden, pluss å legge til score senere
function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
          score += 100
          scoreDisplay.innerHTML = score
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //Gjør så man ikke kan scrolle nedover med arrowkeys
  window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false)
  












})

