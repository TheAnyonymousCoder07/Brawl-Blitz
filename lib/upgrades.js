export const upgradeCost = [
0,
20,40,80,120,200,
350,500,700,1000,
1500,2000
]

export function upgradeBrawler(player,brawler){

const lvl = player.brawlers[brawler].level
const cost = upgradeCost[lvl]

if(player.coins >= cost){

player.coins -= cost
player.brawlers[brawler].level++

}

}
