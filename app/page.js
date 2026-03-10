"use client"
import { useRouter } from "next/navigation"

export default function Home(){

const router = useRouter()

return(

<div style={{
height:"100vh",
background:"#0f0f0f",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"30px"
}}>

<h1 style={{color:"white",fontSize:"50px"}}>
Brawl Blitz
</h1>

<button
style={{padding:"15px 40px",fontSize:"20px"}}
onClick={()=>router.push("/game")}
>
Play
</button>

<button
style={{padding:"10px 30px"}}
onClick={()=>router.push("/leaderboard")}
>
Leaderboard
</button>

<button
style={{padding:"10px 30px"}}
onClick={()=>router.push("/brawlers")}
>
Brawlers
</button>

</div>

)

}
