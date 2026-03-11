"use client"

import { useRouter } from "next/navigation"

export default function Home() {

const router = useRouter()

return (

<div style={{
height:"100vh",
background:"#0f0f0f",
color:"white",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"20px"
}}>

<h1 style={{fontSize:"60px"}}>Brawl Blitz</h1>

<button onClick={()=>router.push("/game")}>
Play
</button>

<button onClick={()=>router.push("/brawlers")}>
Brawlers
</button>

<button onClick={()=>router.push("/shop")}>
Shop
</button>

<button onClick={()=>router.push("/leaderboard")}>
Leaderboard
</button>

</div>

)

}
