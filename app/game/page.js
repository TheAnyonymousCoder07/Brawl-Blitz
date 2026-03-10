"use client"
import { useEffect, useRef } from "react"

export default function Game(){

const canvasRef = useRef()

useEffect(()=>{

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* ======================
SPRITES
====================== */

const playerImg = new Image()
playerImg.src="/sprites/player.png"

const enemyImg = new Image()
enemyImg.src="/sprites/enemy.png"

/* ======================
PLAYER
====================== */

const player={
x:500,
y:500,
vx:0,
vy:0,
speed:3,
hp:100,
coins:0,
dashCooldown:0,
damage:20
}

/* ======================
INPUT
====================== */

const keys={}

window.addEventListener("keydown",e=>{

keys[e.key]=true

if(e.key==="b") shopOpen=!shopOpen

})

window.addEventListener("keyup",e=>keys[e.key]=false)

/* ======================
OBJECTS
====================== */

const bullets=[]
const enemies=[]
const powerups=[]

let score=0
let shopOpen=false

/* ======================
MAP WALLS
====================== */

const walls=[
{x:300,y:300,w:200,h:40},
{x:700,y:500,w:40,h:200},
{x:900,y:200,w:200,h:40}
]

/* ======================
POWERUPS
====================== */

function spawnPowerup(){

const types=["heal","speed","damage"]

powerups.push({
x:Math.random()*1500,
y:Math.random()*1500,
type:types[Math.floor(Math.random()*types.length)]
})

}

setInterval(spawnPowerup,8000)

/* ======================
ENEMIES
====================== */

function spawnEnemy(){

enemies.push({
x:Math.random()*1500,
y:Math.random()*1500,
speed:1.5,
hp:40
})

}

setInterval(spawnEnemy,3000)

/* ======================
SHOOT
====================== */

canvas.addEventListener("click",()=>{

bullets.push({
x:player.x,
y:player.y,
vx:6,
vy:0
})

})

/* ======================
PLAYER UPDATE
====================== */

function updatePlayer(){

if(keys["w"]) player.vy=-player.speed
else if(keys["s"]) player.vy=player.speed
else player.vy=0

if(keys["a"]) player.vx=-player.speed
else if(keys["d"]) player.vx=player.speed
else player.vx=0

/* dash ability */

if(keys[" "] && player.dashCooldown<=0){

player.vx*=6
player.vy*=6
player.dashCooldown=60

}

player.dashCooldown--

player.x+=player.vx
player.y+=player.vy

}

/* ======================
WALL COLLISION
====================== */

function checkWalls(){

walls.forEach(w=>{

if(
player.x > w.x &&
player.x < w.x+w.w &&
player.y > w.y &&
player.y < w.y+w.h
){

player.x-=player.vx
player.y-=player.vy

}

})

}

/* ======================
POWERUP COLLECTION
====================== */

function updatePowerups(){

powerups.forEach((p,i)=>{

const dx=player.x-p.x
const dy=player.y-p.y
const d=Math.hypot(dx,dy)

if(d<30){

if(p.type==="heal") player.hp+=20
if(p.type==="speed") player.speed+=1
if(p.type==="damage") player.damage+=10

powerups.splice(i,1)

}

})

}

/* ======================
ENEMY AI
====================== */

function updateEnemies(){

enemies.forEach((e,ei)=>{

const dx=player.x-e.x
const dy=player.y-e.y
const dist=Math.hypot(dx,dy)

e.x+=dx/dist*e.speed
e.y+=dy/dist*e.speed

if(dist<30){

player.hp-=0.1

}

})

}

/* ======================
BULLETS
====================== */

function updateBullets(){

bullets.forEach((b,bi)=>{

b.x+=b.vx

enemies.forEach((e,ei)=>{

const d=Math.hypot(b.x-e.x,b.y-e.y)

if(d<30){

e.hp-=player.damage

bullets.splice(bi,1)

if(e.hp<=0){

player.coins+=10
score+=10
enemies.splice(ei,1)

}

}

})

})

}

/* ======================
SHOP
====================== */

function drawShop(){

ctx.fillStyle="rgba(0,0,0,0.8)"
ctx.fillRect(200,100,600,400)

ctx.fillStyle="white"
ctx.font="30px Arial"

ctx.fillText("SHOP",450,150)

ctx.font="20px Arial"

ctx.fillText("1. Upgrade Damage (50 coins)",300,220)
ctx.fillText("2. Upgrade Speed (50 coins)",300,260)
ctx.fillText("3. Heal (30 coins)",300,300)

}

/* shop purchases */

window.addEventListener("keydown",e=>{

if(!shopOpen) return

if(e.key==="1" && player.coins>=50){

player.damage+=10
player.coins-=50

}

if(e.key==="2" && player.coins>=50){

player.speed+=1
player.coins-=50

}

if(e.key==="3" && player.coins>=30){

player.hp+=30
player.coins-=30

}

})

/* ======================
DRAW MAP
====================== */

function drawMap(){

ctx.fillStyle="#1c1c1c"
ctx.fillRect(0,0,canvas.width,canvas.height)

walls.forEach(w=>{

ctx.fillStyle="#555"
ctx.fillRect(w.x,w.y,w.w,w.h)

})

}

/* ======================
DRAW
====================== */

function draw(){

drawMap()

ctx.drawImage(playerImg,player.x-32,player.y-32,64,64)

bullets.forEach(b=>{

ctx.fillStyle="yellow"
ctx.fillRect(b.x,b.y,5,5)

})

enemies.forEach(e=>{

ctx.drawImage(enemyImg,e.x-32,e.y-32,64,64)

})

powerups.forEach(p=>{

ctx.fillStyle="lime"

ctx.beginPath()
ctx.arc(p.x,p.y,10,0,Math.PI*2)
ctx.fill()

})

ctx.fillStyle="white"
ctx.fillText("Score: "+score,20,30)
ctx.fillText("Coins: "+player.coins,20,60)
ctx.fillText("HP: "+Math.floor(player.hp),20,90)

if(shopOpen) drawShop()

}

/* ======================
GAME LOOP
====================== */

function update(){

if(!shopOpen){

updatePlayer()
checkWalls()
updateBullets()
updateEnemies()
updatePowerups()

}

}

function loop(){

update()
draw()
requestAnimationFrame(loop)

}

loop()

},[])

return <canvas ref={canvasRef}/>

}
