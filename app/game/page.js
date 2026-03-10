"use client"
import { useEffect, useRef } from "react"

export default function GamePage(){

const canvasRef = useRef(null)

useEffect(()=>{

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* =============================
GAME STATE
============================= */

let frame = 0
let score = 0

const mapSize = 3000

const player = {
x:1500,
y:1500,
speed:4,
hp:100,
maxHp:100,
dashCooldown:0
}

const keys = {}

const bullets=[]
const enemies=[]
const coins=[]
const powerups=[]
const damageNumbers=[]

let camera = {x:0,y:0}

/* =============================
INPUT
============================= */

window.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()] = true
})

window.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()] = false
})

let mouse = {x:0,y:0}

canvas.addEventListener("mousemove",e=>{
mouse.x=e.clientX
mouse.y=e.clientY
})

canvas.addEventListener("mousedown",shoot)

/* =============================
SHOOTING
============================= */

function shoot(){

const angle = Math.atan2(
mouse.y - canvas.height/2,
mouse.x - canvas.width/2
)

bullets.push({
x:player.x,
y:player.y,
vx:Math.cos(angle)*10,
vy:Math.sin(angle)*10,
life:80
})

}

/* =============================
DASH
============================= */

window.addEventListener("keydown",e=>{

if(e.key===" " && player.dashCooldown<=0){

const angle = Math.atan2(
mouse.y - canvas.height/2,
mouse.x - canvas.width/2
)

player.x += Math.cos(angle)*120
player.y += Math.sin(angle)*120

player.dashCooldown=120
}

})

/* =============================
SPAWN ENEMIES
============================= */

function spawnEnemy(){

const angle=Math.random()*Math.PI*2
const dist=800

enemies.push({
x:player.x + Math.cos(angle)*dist,
y:player.y + Math.sin(angle)*dist,
hp:40,
speed:1.5
})

}

/* =============================
SPAWN BOSS
============================= */

function spawnBoss(){

enemies.push({
x:player.x+500,
y:player.y+500,
hp:400,
speed:0.8,
boss:true
})

}

/* =============================
POWERUPS
============================= */

function spawnPowerup(){

const types=["heal","speed","damage"]

powerups.push({
x:Math.random()*mapSize,
y:Math.random()*mapSize,
type:types[Math.floor(Math.random()*types.length)]
})

}

/* =============================
DAMAGE NUMBERS
============================= */

function spawnDamage(x,y,value){

damageNumbers.push({
x,y,value,life:60
})

}

/* =============================
PLAYER MOVEMENT
============================= */

function updatePlayer(){

if(keys["w"]) player.y-=player.speed
if(keys["s"]) player.y+=player.speed
if(keys["a"]) player.x-=player.speed
if(keys["d"]) player.x+=player.speed

player.x=Math.max(0,Math.min(mapSize,player.x))
player.y=Math.max(0,Math.min(mapSize,player.y))

}

/* =============================
UPDATE BULLETS
============================= */

function updateBullets(){

bullets.forEach((b,i)=>{

b.x+=b.vx
b.y+=b.vy
b.life--

if(b.life<=0) bullets.splice(i,1)

})

}

/* =============================
UPDATE ENEMIES
============================= */

function updateEnemies(){

enemies.forEach((e,i)=>{

const dx=player.x-e.x
const dy=player.y-e.y
const dist=Math.hypot(dx,dy)

e.x += dx/dist * e.speed
e.y += dy/dist * e.speed

if(dist<30){

player.hp-=0.1

}

bullets.forEach((b,bi)=>{

const d = Math.hypot(b.x-e.x,b.y-e.y)

if(d<20){

e.hp-=10
spawnDamage(e.x,e.y,10)

b.life=0

}

})

if(e.hp<=0){

coins.push({x:e.x,y:e.y})
score+=10

enemies.splice(i,1)

}

})

}

/* =============================
UPDATE COINS
============================= */

function updateCoins(){

coins.forEach((c,i)=>{

if(Math.hypot(player.x-c.x,player.y-c.y)<30){

score+=5
coins.splice(i,1)

}

})

}

/* =============================
UPDATE POWERUPS
============================= */

function updatePowerups(){

powerups.forEach((p,i)=>{

if(Math.hypot(player.x-p.x,player.y-p.y)<30){

if(p.type==="heal") player.hp=Math.min(player.maxHp,player.hp+20)
if(p.type==="speed") player.speed+=1
if(p.type==="damage") score+=50

powerups.splice(i,1)

}

})

}

/* =============================
UPDATE DAMAGE TEXT
============================= */

function updateDamage(){

damageNumbers.forEach((d,i)=>{

d.y-=0.5
d.life--

if(d.life<=0) damageNumbers.splice(i,1)

})

}

/* =============================
CAMERA
============================= */

function updateCamera(){

camera.x = player.x - canvas.width/2
camera.y = player.y - canvas.height/2

}

/* =============================
DRAW PLAYER
============================= */

function drawPlayer(){

ctx.fillStyle="#3aa0ff"

ctx.beginPath()
ctx.arc(player.x-camera.x,player.y-camera.y,20,0,Math.PI*2)
ctx.fill()

}

/* =============================
DRAW ENEMY
============================= */

function drawEnemy(e){

ctx.fillStyle=e.boss ? "purple":"red"

ctx.beginPath()
ctx.arc(e.x-camera.x,e.y-camera.y,e.boss?40:18,0,Math.PI*2)
ctx.fill()

}

/* =============================
DRAW MAP
============================= */

function drawMap(){

ctx.fillStyle="#1c1c1c"
ctx.fillRect(-camera.x,-camera.y,mapSize,mapSize)

}

/* =============================
DRAW HEALTHBAR
============================= */

function drawHealthBar(x,y,hp,max){

ctx.fillStyle="red"
ctx.fillRect(x-camera.x-20,y-camera.y-30,40,6)

ctx.fillStyle="lime"
ctx.fillRect(x-camera.x-20,y-camera.y-30,(hp/max)*40,6)

}

/* =============================
DRAW DAMAGE
============================= */

function drawDamage(){

ctx.fillStyle="white"
ctx.font="16px Arial"

damageNumbers.forEach(d=>{
ctx.fillText(d.value,d.x-camera.x,d.y-camera.y)
})

}

/* =============================
DRAW COINS
============================= */

function drawCoins(){

coins.forEach(c=>{

ctx.fillStyle="gold"
ctx.beginPath()
ctx.arc(c.x-camera.x,c.y-camera.y,8,0,Math.PI*2)
ctx.fill()

})

}

/* =============================
DRAW POWERUPS
============================= */

function drawPowerups(){

powerups.forEach(p=>{

ctx.fillStyle="cyan"

ctx.beginPath()
ctx.arc(p.x-camera.x,p.y-camera.y,10,0,Math.PI*2)
ctx.fill()

})

}

/* =============================
DRAW UI
============================= */

function drawUI(){

ctx.fillStyle="white"
ctx.font="20px Arial"
ctx.fillText("Score: "+score,20,30)

ctx.fillText("HP: "+Math.floor(player.hp),20,60)

}

/* =============================
GAME LOOP
============================= */

function gameLoop(){

frame++

ctx.clearRect(0,0,canvas.width,canvas.height)

updatePlayer()
updateBullets()
updateEnemies()
updateCoins()
updatePowerups()
updateDamage()

updateCamera()

drawMap()

drawPlayer()

enemies.forEach(e=>{
drawEnemy(e)
drawHealthBar(e.x,e.y,e.hp,e.boss?400:40)
})

drawCoins()
drawPowerups()

bullets.forEach(b=>{

ctx.fillStyle="yellow"
ctx.beginPath()
ctx.arc(b.x-camera.x,b.y-camera.y,4,0,Math.PI*2)
ctx.fill()

})

drawDamage()
drawUI()

if(frame%120===0) spawnEnemy()
if(frame%900===0) spawnBoss()
if(frame%600===0) spawnPowerup()

if(player.dashCooldown>0) player.dashCooldown--

requestAnimationFrame(gameLoop)

}

gameLoop()

},[])

return <canvas ref={canvasRef} style={{display:"block"}}/>

}
