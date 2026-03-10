"use client"
import { useRouter } from "next/navigation"
import TopBar from "../components/TopBar"
import PlayButton from "../components/PlayButton"

export default function Home(){

const router = useRouter()

return(

<div style={{
height:"100vh",
background:"#0f0f0f",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"space-between",
padding:"30px"
}}>

<TopBar/>

<h1 style={{color:"white",fontSize:"50px"}}>
Brawl Blitz
</h1>

<img src="/sprites/player.png" width="200"/>

<div style={{display:"flex",gap:"20px"}}>

<button onClick={()=>router.push("/brawlers")}>
Brawlers
</button>

<button onClick={()=>router.push("/leaderboard")}>
Leaderboard
</button>

</div>

<PlayButton/>

</div>

)

}
