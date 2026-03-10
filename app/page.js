'use client'
import { useEffect, useRef } from "react"

export default function Home() {

const canvasRef = useRef(null)

useEffect(()=>{

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

const screenWidth = 800
const screenHeight = 500

const mapWidth = 2000
const mapHeight = 2000

const keys = {}
const mouse = {x:0,y:0}

let score = 0
let highScore = localStorage.getItem("brawlHighScore") || 0

const playerImg = new Image()
playerImg.src="/sprites/player.png"

const enemyImg = new Image()
enemyImg.src="/sprites/enemy.png"

const shootSound = new Audio("/sounds/shoot.wav")

const player={
x:400,
y:400,
size:30,
speed:4,
health:100,
attackCooldown:0
}

let camera={
x:0,
y:0
}

const bullets=[]
const enemies=[]

let wave=1

function spawnWave(){

for(let i=0;i<wave*3;i++){

enemies.push({
x:Math.random()*mapWidth,
y:Math.random()*mapHeight,
size:30,
health:40,
type:"normal"
})

}

if(wave%5===0){

enemies.push({
x:Math.random()*mapWidth,
y:Math.random()*mapHeight,
size:60,
health:200,
type:"boss"
})

}

}

spawnWave()

window.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()]=true
})

window.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()]=false
})

canvas.addEventListener("mousemove",e=>{
const rect=canvas.getBoundingClientRect()

mouse.x=e.clientX-rect.left
mouse.y=e.clientY-rect.top
})

canvas.addEventListener("mousedown",()=>{

if(player.attackCooldown<=0){

const worldMouseX=mouse.x+camera.x
const worldMouseY=mouse.y+camera.y

const dx=worldMouseX-player.x
const dy=worldMouseY-player.y
const dist=Math.sqrt(dx*dx+dy*dy)

bullets.push({
x:player.x,
y:player.y,
vx:(dx/dist)*8,
vy:(dy/dist)*8
})

shootSound.play().catch(()=>{})

player.attackCooldown=20

}

})

function movePlayer(){

if(keys["w"]) player.y-=player.speed
if(keys["s"]) player.y+=player.speed
if(keys["a"]) player.x-=player.speed
if(keys["d"]) player.x+=player.speed

player.x=Math.max(0,Math.min(mapWidth,player.x))
player.y=Math.max(0,Math.min(mapHeight,player.y))

}

function updateCamera(){

camera.x=player.x-screenWidth/2
camera.y=player.y-screenHeight/2

camera.x=Math.max(0,Math.min(mapWidth-screenWidth,camera.x))
camera.y=Math.max(0,Math.min(mapHeight-screenHeight,camera.y))

}

function moveEnemies(){

enemies.forEach(e=>{

const dx=player.x-e.x
const dy=player.y-e.y
const dist=Math.sqrt(dx*dx+dy*dy)

if(dist>0){

let speed=1.5
if(e.type==="boss") speed=0.7

e.x+=dx/dist*speed
e.y+=dy/dist*speed

}

})

}

function updateBullets(){

bullets.forEach((b,i)=>{

b.x+=b.vx
b.y+=b.vy

if(b.x<0||b.x>mapWidth||b.y<0||b.y>mapHeight){

bullets.splice(i,1)

}

})

}

function checkHits(){

bullets.forEach(b=>{

enemies.forEach(e=>{

const dx=b.x-e.x
const dy=b.y-e.y
const dist=Math.sqrt(dx*dx+dy*dy)

if(dist<e.size){

e.health-=20

if(e.health<=0){

score+=10
if(e.type==="boss") score+=100

}

}

})

})

enemies.forEach((e,i)=>{

if(e.health<=0){

enemies.splice(i,1)

}

})

}

function nextWave(){

if(enemies.length===0){

wave++
spawnWave()

}

}

function drawMap(){

ctx.fillStyle="#1a1a1a"
ctx.fillRect(0,0,screenWidth,screenHeight)

}

function drawPlayer(){

ctx.drawImage(
playerImg,
player.x-camera.x-20,
player.y-camera.y-20,
40,
40
)

}

function drawEnemies(){

enemies.forEach(e=>{

ctx.drawImage(
enemyImg,
e.x-camera.x-20,
e.y-camera.y-20,
e.size,
e.size
)

})

}

function drawBullets(){

ctx.fillStyle="yellow"

bullets.forEach(b=>{

ctx.fillRect(
b.x-camera.x,
b.y-camera.y,
6,
6
)

})

}

function drawAimLine(){

ctx.strokeStyle="red"
ctx.beginPath()

ctx.moveTo(
player.x-camera.x,
player.y-camera.y
)

ctx.lineTo(
mouse.x,
mouse.y
)

ctx.stroke()

}

function drawUI(){

ctx.fillStyle="white"
ctx.font="16px Arial"

ctx.fillText("HP: "+player.health,20,25)
ctx.fillText("Wave: "+wave,20,45)
ctx.fillText("Score: "+score,20,65)
ctx.fillText("High Score: "+highScore,20,85)

}

function gameLoop(){

movePlayer()
moveEnemies()
updateBullets()
checkHits()
nextWave()
updateCamera()

if(player.attackCooldown>0) player.attackCooldown--

if(score>highScore){

highScore=score
localStorage.setItem("brawlHighScore",score)

}

drawMap()
drawPlayer()
drawEnemies()
drawBullets()
drawAimLine()
drawUI()

requestAnimationFrame(gameLoop)

}

gameLoop()

},[])

return(

<main style={{textAlign:"center"}}>

<h1>Brawl Blitz</h1>

<canvas
ref={canvasRef}
width={800}
height={500}
style={{
border:"3px solid white",
background:"black"
}}
/>

</main>

)

}
