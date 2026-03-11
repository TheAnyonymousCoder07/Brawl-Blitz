"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LeaderboardPage(){

const router = useRouter()
const [scores, setScores] = useState([])

useEffect(()=>{

if(typeof window !== "undefined"){

const saved = localStorage.getItem("leaderboard")

if(saved){
setScores(JSON.parse(saved))
}

}

},[])

return(

<div style={{
height:"100vh",
background:"#111",
color:"white",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"20px"
}}>

<h1 style={{fontSize:"50px"}}>Leaderboard</h1>

{scores.length === 0 ? (
<p>No scores yet</p>
) : (
scores.map((s,i)=>(
<div key={i}>
{s.name} - {s.score}
</div>
))
)}

<button onClick={()=>router.push("/")}>
Back Home
</button>

</div>

)

}
