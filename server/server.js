import { Server } from "ws"

const wss = new Server({port:3001})

let players = {}

wss.on("connection",(ws)=>{

ws.on("message",(msg)=>{

const data = JSON.parse(msg)

players[data.id] = data

})

})
