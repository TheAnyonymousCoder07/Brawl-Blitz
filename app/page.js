"use client"

import { useRouter } from "next/navigation"

export default function ShopPage() {

const router = useRouter()

return (

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

<h1 style={{fontSize:"50px"}}>Shop</h1>

<p>Buy skins, coins, and diamonds</p>

<button onClick={()=>router.push("/")}>
Back Home
</button>

</div>

)

}
