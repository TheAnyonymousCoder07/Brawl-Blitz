export default function Joystick({onMove}){

function handleTouch(e){

const touch = e.touches[0]
onMove(touch.clientX,touch.clientY)

}

return(
<div
onTouchMove={handleTouch}
style={{
position:"fixed",
bottom:40,
left:40,
width:120,
height:120,
borderRadius:"50%",
background:"rgba(255,255,255,0.2)"
}}
/>
)

}
