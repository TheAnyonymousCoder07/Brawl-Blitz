'use client'
import { useEffect, useRef } from "react"

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const keys = {}
    const mouse = { x: 0, y: 0 }

    const shootSound = new Audio("/shoot.wav")
    const powerSound = new Audio("/power.wav")

    const playerImg = new Image()
    playerImg.src = "/player.png"

    const enemyImg = new Image()
    enemyImg.src = "/enemy.png"

    const player = {
      x: 400,
      y: 250,
      size: 30,
      speed: 3,
      health: 100,
      attackCooldown: 0,
      dashCooldown: 0
    }

    const bullets = []
    const enemies = []
    const powerups = []

    const walls = [
      {x:200,y:200,w:80,h:80},
      {x:500,y:120,w:100,h:60},
      {x:600,y:350,w:120,h:60}
    ]

    let wave = 1

    function spawnWave(){
      for(let i=0;i<wave*3;i++){
        enemies.push({
          x:Math.random()*800,
          y:Math.random()*500,
          size:30,
          health:40
        })
      }
    }

    spawnWave()

    window.addEventListener("keydown",e=>{
      keys[e.key.toLowerCase()] = true

      if(e.key==="Shift" && player.dashCooldown<=0){
        player.x += 80
        player.dashCooldown = 120
      }
    })

    window.addEventListener("keyup",e=>{
      keys[e.key.toLowerCase()] = false
    })

    canvas.addEventListener("mousemove",e=>{
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    })

    canvas.addEventListener("mousedown",()=>{
      if(player.attackCooldown<=0){

        const dx = mouse.x-player.x
        const dy = mouse.y-player.y
        const dist = Math.sqrt(dx*dx + dy*dy)

        if(dist>0){
          bullets.push({
            x:player.x,
            y:player.y,
            vx:(dx/dist)*7,
            vy:(dy/dist)*7
          })
        }

        shootSound.currentTime = 0
        shootSound.play().catch(()=>{})

        player.attackCooldown = 20
      }
    })

    function movePlayer(){
      let nx = player.x
      let ny = player.y

      if(keys["w"]) ny -= player.speed
      if(keys["s"]) ny += player.speed
      if(keys["a"]) nx -= player.speed
      if(keys["d"]) nx += player.speed

      let blocked=false

      walls.forEach(w=>{
        if(nx>w.x && nx<w.x+w.w && ny>w.y && ny<w.y+w.h){
          blocked=true
        }
      })

      if(!blocked){
        player.x=nx
        player.y=ny
      }
    }

    function moveEnemies(){
      enemies.forEach(e=>{
        const dx = player.x - e.x
        const dy = player.y - e.y
        const dist = Math.sqrt(dx*dx + dy*dy)

        if(dist>0){
          e.x += dx/dist * 1.2
          e.y += dy/dist * 1.2
        }
      })
    }

    function updateBullets(){
      bullets.forEach((b,i)=>{
        b.x += b.vx
        b.y += b.vy

        if(
          b.x < 0 ||
          b.x > canvas.width ||
          b.y < 0 ||
          b.y > canvas.height
        ){
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
            e.health -= 20
            e.x += b.vx * 5
            e.y += b.vy * 5
          }
        })
      })

      enemies.forEach((e,i)=>{
        if(e.health<=0){
          enemies.splice(i,1)

          if(Math.random()<0.3){
            powerups.push({
              x:e.x,
              y:e.y,
              type:"health"
            })
          }
        }
      })
    }

    function checkPowerups(){
      powerups.forEach((p,i)=>{
        const dx=player.x-p.x
        const dy=player.y-p.y
        const dist=Math.sqrt(dx*dx+dy*dy)

        if(dist<30){
          if(p.type==="health"){
            player.health += 20
          }

          powerSound.currentTime = 0
          powerSound.play().catch(()=>{})

          powerups.splice(i,1)
        }
      })
    }

    function nextWaveCheck(){
      if(enemies.length===0){
        wave++
        spawnWave()
      }
    }

    function drawArena(){
      ctx.fillStyle="#1a1a1a"
      ctx.fillRect(0,0,canvas.width,canvas.height)
    }

    function drawWalls(){
      ctx.fillStyle="#444"
      walls.forEach(w=>{
        ctx.fillRect(w.x,w.y,w.w,w.h)
      })
    }

    function drawPlayer(){
      ctx.drawImage(playerImg,player.x-20,player.y-20,40,40)
    }

    function drawEnemies(){
      enemies.forEach(e=>{
        ctx.drawImage(enemyImg,e.x-20,e.y-20,40,40)
      })
    }

    function drawBullets(){
      ctx.fillStyle="yellow"
      bullets.forEach(b=>{
        ctx.fillRect(b.x,b.y,6,6)
      })
    }

    function drawPowerups(){
      ctx.fillStyle="lime"
      powerups.forEach(p=>{
        ctx.fillRect(p.x-10,p.y-10,20,20)
      })
    }

    function drawUI(){
      ctx.fillStyle="white"
      ctx.font="16px Arial"

      ctx.fillText("HP: "+player.health,20,25)
      ctx.fillText("Wave: "+wave,20,45)

      ctx.fillText("Attack",650,470)
      ctx.strokeRect(640,440,80,40)

      ctx.fillText("Dash",550,470)
      ctx.strokeRect(540,440,80,40)
    }

    function gameLoop(){

      movePlayer()
      moveEnemies()
      updateBullets()
      checkHits()
      checkPowerups()
      nextWaveCheck()

      if(player.attackCooldown>0) player.attackCooldown--
      if(player.dashCooldown>0) player.dashCooldown--

      drawArena()
      drawWalls()
      drawPlayer()
      drawEnemies()
      drawBullets()
      drawPowerups()
      drawUI()

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

  },[])

  return (
    <main style={{textAlign:"center"}}>
      <h1>Brawl Blitz</h1>
      <p>WASD Move | Mouse Shoot | Shift Dash</p>

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
