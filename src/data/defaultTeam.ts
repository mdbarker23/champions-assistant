
import type { Team } from "../types";
export const defaultTeam: Team = {
 id:"default",name:"M-B AI Meta",createdAt:Date.now(),updatedAt:Date.now(),
 builds:[
 {id:"froslass",name:"Froslass",displayName:"Mega Froslass",item:"Froslassite",ability:"Cursed Body",nature:"Timid",training:{hp:2,atk:0,def:0,spa:32,spd:0,spe:32},moves:["Blizzard","Protect","Shadow Ball","Aurora Veil"],roles:["Special attacker","Aurora Veil"],types:["Ice","Ghost"]},
 {id:"kingambit",name:"Kingambit",displayName:"Kingambit",item:"Chople Berry",ability:"Defiant",nature:"Adamant",training:{hp:32,atk:32,def:0,spa:0,spd:2,spe:0},moves:["Sucker Punch","Kowtow Cleave","Protect","Iron Head"],roles:["Priority attacker","Endgame cleaner"],types:["Dark","Steel"]},
 {id:"sneasler",name:"Sneasler",displayName:"Sneasler",item:"Focus Sash",ability:"Unburden",nature:"Jolly",training:{hp:2,atk:32,def:0,spa:0,spd:0,spe:32},moves:["Close Combat","Fake Out","Dire Claw","Protect"],roles:["Fake Out","Fast attacker"],types:["Fighting","Poison"]},
 {id:"garchomp",name:"Garchomp",displayName:"Garchomp",item:"Haban Berry",ability:"Rough Skin",nature:"Jolly",training:{hp:2,atk:32,def:0,spa:0,spd:0,spe:32},moves:["Earthquake","Dragon Claw","Rock Slide","Protect"],roles:["Spread attacker","Physical attacker"],types:["Dragon","Ground"]},
 {id:"aerodactyl",name:"Aerodactyl",displayName:"Mega Aerodactyl",item:"Aerodactylite",ability:"Unnerve",nature:"Jolly",training:{hp:2,atk:32,def:0,spa:0,spd:0,spe:32},moves:["Rock Slide","Tailwind","Dual Wingbeat","Protect"],roles:["Tailwind","Fast attacker"],types:["Rock","Flying"]},
 {id:"eelektross",name:"Eelektross",displayName:"Mega Eelektross",item:"Eelektrossite",ability:"Levitate",nature:"Modest",training:{hp:2,atk:0,def:0,spa:32,spd:0,spe:32},moves:["Grass Knot","Flamethrower","Thunderbolt","Protect"],roles:["Coverage attacker","Ground immunity"],types:["Electric"]}
 ]};
