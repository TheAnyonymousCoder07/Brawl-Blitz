'use client'
import { useEffect, useRef } from "react"

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const keys = {}

    const player = {
      x: 400,
      y: 250,
      size: 20,
      speed: 3,
      health: 100,
      dashCooldown: 0
    }

    const bullets = []

    const enemies = []

    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        size: 20,
        health: 40,
        vx: 0,
        vy: 0
      })
    }

    window.addEventListener("keydown", (e) => {
      keys[e.key.toLowerCase()] = true

      if (e.key === " ") {
        bullets.push({
          x: player.x,
          y: player.y,
          vx: 6,
          vy: 0
        })
      }

      if (e.key.toLowerCase() === "shift" && player.dashCooldown <= 0) {
        player.x += 80
        player.dashCooldown = 60
      }
    })

    window.addEventListener("keyup", (e) => {
      keys[e.key.toLowerCase()] = false
    })

    function movePlayer() {
      if (keys["w"]) player.y -= player.speed
      if (keys["s"]) player.y += player.speed
      if (keys["a"]) player.x -= player.speed
      if (keys["d"]) player.x += player.speed
    }

    function updateBullets() {
      bullets.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
      })
    }

    function moveEnemies() {
      enemies.forEach((enemy) => {
        const dx = player.x - enemy.x
        const dy = player.y - enemy.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        enemy.vx = (dx / dist) * 1.5
        enemy.vy = (dy / dist) * 1.5

        enemy.x += enemy.vx
        enemy.y += enemy.vy
      })
    }

    function checkBulletHits() {
      bullets.forEach((b) => {
        enemies.forEach((enemy) => {
          const dx = b.x - enemy.x
          const dy = b.y - enemy.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < enemy.size) {
            enemy.health -= 10

            enemy.x += b.vx * 5
            enemy.y += b.vy * 5
          }
        })
      })
    }

    function drawArena() {
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawPlayer() {
      ctx.fillStyle = "cyan"
      ctx.fillRect(player.x - 15, player.y - 15, 30, 30)
    }

    function drawEnemies() {
      enemies.forEach((enemy) => {
        if (enemy.health <= 0) return

        ctx.fillStyle = "red"
        ctx.fillRect(enemy.x - 15, enemy.y - 15, 30, 30)
      })
    }

    function drawBullets() {
      ctx.fillStyle = "yellow"

      bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, 6, 6)
      })
    }

    function drawUI() {
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.fillText("HP: " + player.health, 20, 25)
    }

    function gameLoop() {
      movePlayer()
      moveEnemies()
      updateBullets()
      checkBulletHits()

      if (player.dashCooldown > 0) player.dashCooldown--

      drawArena()
      drawPlayer()
      drawEnemies()
      drawBullets()
      drawUI()

      requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }, [])

  return (
    <main style={{ textAlign: "center" }}>
      <h1>Brawl Blitz</h1>
      <p>WASD Move | SPACE Shoot | SHIFT Dash</p>

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
