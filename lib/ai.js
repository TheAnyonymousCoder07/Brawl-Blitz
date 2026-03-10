export function calculateBotSkill(playerStats){

let difficulty = 1

if(playerStats.kills > 10)
difficulty = 1.5

if(playerStats.kills > 20)
difficulty = 2

return difficulty

}
