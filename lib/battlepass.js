export const PASS = Array.from({length:50},(_,i)=>{

return{
tier:i+1,
xp:(i+1)*100,
freeReward:"coins",
paidReward:"skin"
}

})
