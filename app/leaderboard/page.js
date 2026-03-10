"use client"

export default function Leaderboard(){

const scores = JSON.parse(
localStorage.getItem("scores") || "[]"
)

return(

<div style={{
background:"#111",
height:"100vh",
color:"white",
padding:"40px"
}}>

<h1>Leaderboard</h1>

{scores.map((s,i)=>(
<p key={i}>{i+1}. {s}</p>
))}

</div>

)

}
