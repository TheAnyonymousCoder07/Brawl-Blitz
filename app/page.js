'use client'
import { useEffect, useRef } from "react"

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const keys = {}

    const player = {
      x: 200,
      y: 200,
      size: 30,
      speed: 3,
      health: 100,
      attacking: false
    }

    const enemy = {
      x: 500,
      y: 200,
      size: 30,
      speed: 1.5,
      health: 100
    }

    // keyboard input
    window.addEventListener("keydown", (e) => {
      keys[e.key.toLowerCase()] = true
      if (e.key === " ") player.attacking = true
    })

    window.addEventListener("keyup", (e) => {
      keys[e.key.toLowerCase()] = false
      if (e.key === " ") player.attacking = false
    })

    function movePlayer() {
      if (keys["w"]) player.y -= player.speed
      if (keys["s"]) player.y += player.speed
      if (keys["a"]) player.x -= player.speed
      if (keys["d"]) player.x += player.speed
    }

    // simple enemy AI
    function moveEnemy() {
      const dx = player.x - enemy.x
      const dy = player.y - enemy.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 5) {
        enemy.x += (dx / dist) * enemy.speed
        enemy.y += (dy / dist) * enemy.speed
      }
    }

    // collision + attack
    function checkCombat() {
      const dx = player.x - enemy.x
      const dy = player.y - enemy.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < player.size + enemy.size) {
        if (player.attacking) {
          enemy.health -= 0.5
        } else {
          player.health -= 0.1
        }
      }
    }

    function drawArena() {
      ctx.fillStyle = "#1e1e1e"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawPlayer() {
      ctx.fillStyle = player.attacking ? "orange" : "blue"
      ctx.beginPath()
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawEnemy() {
      ctx.fillStyle = "red"
      ctx.beginPath()
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawHealth() {
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.fillText("Player HP: " + Math.floor(player.health), 20, 30)
      ctx.fillText("Enemy HP: " + Math.floor(enemy.health), 20, 50)
    }

    // GAME LOOP
    function gameLoop() {
      movePlayer()
      moveEnemy()
      checkCombat()

      drawArena()
      drawPlayer()
      drawEnemy()
      drawHealth()

      requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }, [])

  return (
    <main style={{ textAlign: "center" }}>
      <h1>Brawl Blitz</h1>
      <p>WASD to move • SPACE to attack</p>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          border: "3px solid white",
          background: "black"
        }}
      />
    </main>
  )
}
