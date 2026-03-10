"use client"
import { useRouter } from "next/navigation"

export default function PlayButton(){

const router = useRouter()

return(

<button
onClick={()=>router.push("/game")}
style={{
fontSize:"30px",
padding:"20px 60px",
background:"#ffcc00",
borderRadius:"20px",
cursor:"pointer"
}}
>

PLAY

</button>

)

}
