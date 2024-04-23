//Henter elementer fra DOM
const klikkEl = document.getElementById('antallKlikk')
const blockEl = document.getElementById('block')
const blockimgEl = document.getElementById('blokkbilde')
const infoEl = document.getElementById('info')
const infoMenuEl = document.getElementById('infoMenu')
const infoExitEl = document.getElementById('infoExit')
const shopEl = document.getElementById('shop') 
const shopMenuEl = document.getElementById('shopMenu')
const shopExitEl = document.getElementById('shopExit')
const mainEl = document.querySelector('main')
const nivåEl = document.getElementById('nivå')
const tilbakemeldingEl = document.getElementById('tilbakemelding')

//Liste med ulike blokker
const blocks = ['minecraft-dirt.png', 'minecraft-stein.png', 'minecraft-sand.png', 'minecraft-gold.png', 'minecraft-diamond.png','tetris.png']
const blocksName = ['dirt', 'a rock', 'sand', 'gold', 'diamond', 'a tetris block, go play it']

//Øker scoren, og lagrer i local storage

// Sjekker om localStorage er mulig
if (typeof localStorage !== 'undefined') {
    // legger til localStorage.score hvis den ikke finnes
    if (!localStorage.score) {
        localStorage.score = 0;
    }}
blockimgEl.addEventListener('click', function klikk(){
    localStorage.score=Number(localStorage.score)+1
    klikkEl.innerHTML='clicks='+ localStorage.score

    // Setter opp spillscore
    if(localStorage.score > 10000){
        nivåEl.innerHTML = 'gold'
        nivåEl.style.backgroundColor = 'gold'
    }
    else if (localStorage.score > 3000 && score<10000){
        nivåEl.innerHTML = 'silver, next level: 10000'
        nivåEl.style.backgroundColor = 'silver'
    }
    else if(localStorage.score > 1000 && score<3000){
        nivåEl.innerHTML = 'bronze, next level: 3000'
        nivåEl.style.backgroundColor = 'brown'
    }

    //endrer blokk hver 100ende click
    if(localStorage.score%100 === 0){
        const i = Math.floor(Math.random()*blocks.length)
        blockEl.innerHTML=`<img src="./${blocks[i]}" alt="Block" id="blokkbilde">`
        tilbakemeldingEl.innerHTML = `congratulations! you found ${blocksName[i]}`

        // Fjerner problem, lager en ny klikkfunksjon
        const updatedBlockImgEl = document.getElementById('blokkbilde')
        updatedBlockImgEl.addEventListener('click', klikk)

    }


})
//når du går inn/ut på highscore
infoEl.addEventListener('click', function(){
    infoMenuEl.style.display= 'flex'
    infoMenuEl.style.position= 'fixed'
})
infoExitEl.addEventListener('click', function(){
    infoMenuEl.style.display= 'none'
})
//Når du går inn/ut av shop
shopEl.addEventListener('click', function(){
    shopMenuEl.style.display= 'flex'
    shopMenuEl.style.position= 'fixed'
})


shopExitEl.addEventListener('click', function(){
    shopMenuEl.style.display= 'none'
})



//Alternativer i Shop
const shopList = ['', 'Overworld.jpg' , 'Nether.jpg', 'nadderud.jpg']

//Henter bakrunnene
const bImg0 = document.getElementById(`bImg0`)
const bImg1 = document.getElementById(`bImg1`)
const bImg2 = document.getElementById(`bImg2`)
const bImg3 = document.getElementById(`bImg3`)

//Endrer bakgrunnen ved å klikke
for(let i=0;i<shopList.length;i++){
    eval(`bImg${i}`).addEventListener('click', function(){
        mainEl.style.backgroundImage = `url("${shopList[i]}")`
        eval(`bImg${i}`).style.objectFit = 'contain'
    })
}
