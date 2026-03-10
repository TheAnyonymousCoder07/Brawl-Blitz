"use client"

export default function Brawlers(){

const brawlers = [
{name:"Shelly",img:"/sprites/player.png"},
{name:"Colt",img:"/sprites/player.png"},
{name:"Bull",img:"/sprites/player.png"}
]

return(

<div style={{
background:"#111",
height:"100vh",
color:"white",
padding:"40px"
}}>

<h1>Select Brawler</h1>

<div style={{display:"flex",gap:"40px"}}>

{brawlers.map(b=>(
<div key={b.name}>

<img src={b.img} width="120"/>

<p>{b.name}</p>

</div>
))}

</div>

</div>

)

}
