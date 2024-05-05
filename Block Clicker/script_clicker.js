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
const blocks = ['./clicker_bilder/minecraft-dirt.png', './clicker_bilder/minecraft-stein.png', './clicker_bilder/minecraft-sand.png', './clicker_bilder/minecraft-gold.png', './clicker_bilder/minecraft-diamond.png','./clicker_bilder/tetris.png', './clicker_bilder/iceblock.png']
const blocksName = ['dirt', 'a rock', 'sand', 'gold', 'diamond', 'a tetris block, go play it', 'an ice block, click before it melts']




// setter opp score og diamond counter
let score = localStorage.getItem('score') || 0
let diamonds = localStorage.getItem('diamonds') || 0

    // Lager klikkfunksjon
blockimgEl.addEventListener('click', function klikk(){
    localStorage.score=Number(localStorage.score)+1
    klikkEl.innerHTML='clicks='+ localStorage.score



    //endrer blokk hver 100ende click
    if(localStorage.score%100 === 0){
        const i = Math.floor(Math.random()*blocks.length)
        blockEl.innerHTML=`<img src="${blocks[i]}" alt="Block" id="blokkbilde">`
        tilbakemeldingEl.innerHTML = `congratulations! you found ${blocksName[i]}`

        // Fjerner problem, lager en ny klikkfunksjon
        const updatedBlockImgEl = document.getElementById('blokkbilde')
        updatedBlockImgEl.addEventListener('click', klikk)

        // diamond counter
        if(blockEl.innerHTML=`<img src="./clicker_bilder/minecraft-diamond.png" alt="Block" id="blokkbilde">`){
            localStorage.diamonds=Number(localStorage.diamonds)+1
            nivåEl.innerHTML=`diamond counter: ${localStorage.diamonds}`
        }

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
