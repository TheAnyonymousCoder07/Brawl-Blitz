"use client"
import { useEffect, useRef } from "react"

export default function Game(){

const canvasRef = useRef()

useEffect(()=>{

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const playerImg = new Image()
playerImg.src="/sprites/player.png"

const enemyImg = new Image()
enemyImg.src="/sprites/enemy.png"

const bossImg = new Image()
bossImg.src="/sprites/boss.png"

const player={
x:500,
y:500,
speed:4,
hp:100
}

const bullets=[]
const enemies=[]

let score=0
let wave=1

const keys={}

window.addEventListener("keydown",e=>keys[e.key]=true)
window.addEventListener("keyup",e=>keys[e.key]=false)

window.addEventListener("click",shoot)

function shoot(){

bullets.push({
x:player.x,
y:player.y,
vx:6,
vy:0
})

}

function spawnEnemy(){

enemies.push({
x:Math.random()*2000,
y:Math.random()*2000,
speed:1+wave*0.1,
hp:30
})

}

function spawnBoss(){

enemies.push({
x:Math.random()*2000,
y:Math.random()*2000,
speed:1,
hp:200,
boss:true
})

}

setInterval(()=>{

spawnEnemy()

if(wave%5===0) spawnBoss()

wave++

},5000)

function update(){

if(keys["w"])player.y-=player.speed
if(keys["s"])player.y+=player.speed
if(keys["a"])player.x-=player.speed
if(keys["d"])player.x+=player.speed

bullets.forEach(b=>b.x+=b.vx)

enemies.forEach(e=>{

const dx=player.x-e.x
const dy=player.y-e.y
const dist=Math.hypot(dx,dy)

e.x+=dx/dist*e.speed
e.y+=dy/dist*e.speed

})

bullets.forEach((b,bi)=>{

enemies.forEach((e,ei)=>{

const d=Math.hypot(b.x-e.x,b.y-e.y)

if(d<30){

e.hp-=20
bullets.splice(bi,1)

if(e.hp<=0){

score+=10
enemies.splice(ei,1)

}

}

})

})

}

function draw(){

ctx.fillStyle="#111"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.drawImage(playerImg,player.x-32,player.y-32,64,64)

bullets.forEach(b=>{

ctx.fillStyle="yellow"
ctx.fillRect(b.x,b.y,5,5)

})

enemies.forEach(e=>{

const img=e.boss?bossImg:enemyImg

ctx.drawImage(img,e.x-32,e.y-32,64,64)

})

ctx.fillStyle="white"
ctx.fillText("Score: "+score,20,30)
ctx.fillText("Wave: "+wave,20,50)

}

function loop(){

update()
draw()
requestAnimationFrame(loop)

}

loop()

},[])

return(
<canvas ref={canvasRef}/>
)

}
