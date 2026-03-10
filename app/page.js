"use client"

import { useEffect, useRef } from "react"

export default function Page() {

const canvasRef = useRef(null)

useEffect(() => {

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* ======================
INPUT SYSTEM
====================== */

const keys = {}

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true)
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false)

let mouse = {x:0,y:0}

canvas.addEventListener("mousemove", e=>{
mouse.x = e.clientX
mouse.y = e.clientY
})

canvas.addEventListener("click", shoot)

/* ======================
PLAYER
====================== */

const player = {
x:500,
y:500,
vx:0,
vy:0,
speed:0.6,
friction:0.85,
hp:100,
maxHp:100,
dashCooldown:0
}

/* ======================
CAMERA
====================== */

const camera = {
x:0,
y:0
}

/* ======================
GAME OBJECTS
====================== */

const enemies = []
const bullets = []
const powerups = []
const damageTexts = []

let score = 0
let wave = 1

/* ======================
SPAWN ENEMY
====================== */

function spawnEnemy(){

enemies.push({
x:Math.random()*3000,
y:Math.random()*3000,
vx:0,
vy:0,
speed:1 + wave*0.1,
hp:40 + wave*5,
maxHp:40 + wave*5
})

}

/* ======================
SPAWN BOSS
====================== */

function spawnBoss(){

enemies.push({
x:Math.random()*3000,
y:Math.random()*3000,
vx:0,
vy:0,
speed:1,
hp:600,
maxHp:600,
boss:true
})

}

/* ======================
POWERUPS
====================== */

function spawnPowerup(){

powerups.push({
x:Math.random()*3000,
y:Math.random()*3000,
type:"heal"
})

}

/* ======================
SHOOT
====================== */

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
damage:20
})

}

/* ======================
PLAYER UPDATE
====================== */

function updatePlayer(){

if(keys["w"]) player.vy -= player.speed
if(keys["s"]) player.vy += player.speed
if(keys["a"]) player.vx -= player.speed
if(keys["d"]) player.vx += player.speed

player.vx *= player.friction
player.vy *= player.friction

player.x += player.vx
player.y += player.vy

if(keys[" "] && player.dashCooldown<=0){
player.vx *= 8
player.vy *= 8
player.dashCooldown = 60
}

if(player.dashCooldown>0) player.dashCooldown--

}

/* ======================
CAMERA UPDATE
====================== */

function updateCamera(){

camera.x = player.x - canvas.width/2
camera.y = player.y - canvas.height/2

}

/* ======================
BULLETS
====================== */

function updateBullets(){

bullets.forEach((b,i)=>{

b.x += b.vx
b.y += b.vy

enemies.forEach(enemy=>{

const dx = b.x - enemy.x
const dy = b.y - enemy.y
const dist = Math.sqrt(dx*dx + dy*dy)

if(dist < 20){

enemy.hp -= b.damage

enemy.vx += b.vx*0.3
enemy.vy += b.vy*0.3

damageTexts.push({
x:enemy.x,
y:enemy.y,
value:b.damage,
life:60
})

bullets.splice(i,1)

}

})

})

}

/* ======================
ENEMIES
====================== */

function updateEnemies(){

enemies.forEach((enemy,i)=>{

const dx = player.x - enemy.x
const dy = player.y - enemy.y
const dist = Math.sqrt(dx*dx + dy*dy)

enemy.vx += (dx/dist)*0.1
enemy.vy += (dy/dist)*0.1

enemy.vx *= 0.9
enemy.vy *= 0.9

enemy.x += enemy.vx
enemy.y += enemy.vy

if(dist < 30){
player.hp -= 0.2
}

if(enemy.hp <= 0){
score += 10
enemies.splice(i,1)
}

})

}

/* ======================
POWERUPS
====================== */

function updatePowerups(){

powerups.forEach((p,i)=>{

const dx = player.x - p.x
const dy = player.y - p.y
const dist = Math.sqrt(dx*dx+dy*dy)

if(dist < 30){

if(p.type==="heal"){
player.hp = Math.min(player.hp+30,player.maxHp)
}

powerups.splice(i,1)

}

})

}

/* ======================
DAMAGE TEXT
====================== */

function updateDamage(){

damageTexts.forEach((d,i)=>{

d.y -= 0.5
d.life--

if(d.life<=0) damageTexts.splice(i,1)

})

}

/* ======================
DRAW
====================== */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

/* arena */

ctx.fillStyle="#1a1a1a"
ctx.fillRect(0,0,canvas.width,canvas.height)

/* player */

ctx.fillStyle="cyan"
ctx.beginPath()
ctx.arc(
player.x-camera.x,
player.y-camera.y,
20,
0,
Math.PI*2
)
ctx.fill()

/* enemies */

enemies.forEach(enemy=>{

ctx.fillStyle = enemy.boss ? "purple":"red"

ctx.beginPath()
ctx.arc(
enemy.x-camera.x,
enemy.y-camera.y,
20,
0,
Math.PI*2
)
ctx.fill()

/* health bar */

ctx.fillStyle="black"
ctx.fillRect(
enemy.x-camera.x-20,
enemy.y-camera.y-30,
40,
6
)

ctx.fillStyle="lime"
ctx.fillRect(
enemy.x-camera.x-20,
enemy.y-camera.y-30,
40*(enemy.hp/enemy.maxHp),
6
)

})

/* bullets */

ctx.fillStyle="yellow"

bullets.forEach(b=>{

ctx.beginPath()
ctx.arc(
b.x-camera.x,
b.y-camera.y,
5,
0,
Math.PI*2
)
ctx.fill()

})

/* powerups */

powerups.forEach(p=>{

ctx.fillStyle="green"

ctx.beginPath()
ctx.arc(
p.x-camera.x,
p.y-camera.y,
10,
0,
Math.PI*2
)
ctx.fill()

})

/* damage numbers */

ctx.fillStyle="white"
ctx.font="16px Arial"

damageTexts.forEach(d=>{
ctx.fillText(
d.value,
d.x-camera.x,
d.y-camera.y
)
})

/* UI */

ctx.fillStyle="white"
ctx.font="20px Arial"
ctx.fillText("Score: "+score,20,30)
ctx.fillText("Wave: "+wave,20,60)

ctx.fillStyle="red"
ctx.fillRect(20,80,200,10)

ctx.fillStyle="lime"
ctx.fillRect(20,80,200*(player.hp/player.maxHp),10)

/* aiming line */

ctx.strokeStyle="white"

ctx.beginPath()
ctx.moveTo(canvas.width/2,canvas.height/2)
ctx.lineTo(mouse.x,mouse.y)
ctx.stroke()

}

/* ======================
GAME LOOP
====================== */

function update(){

updatePlayer()
updateCamera()
updateBullets()
updateEnemies()
updatePowerups()
updateDamage()

}

/* ======================
WAVES
====================== */

setInterval(()=>{

wave++

for(let i=0;i<wave+2;i++){
spawnEnemy()
}

if(wave % 5 === 0){
spawnBoss()
}

if(Math.random()<0.5){
spawnPowerup()
}

},8000)

/* ======================
MAIN LOOP
====================== */

function loop(){

update()
draw()

requestAnimationFrame(loop)

}

loop()

},[])

return (
<canvas
ref={canvasRef}
style={{width:"100vw",height:"100vh"}}
/>
)

}
