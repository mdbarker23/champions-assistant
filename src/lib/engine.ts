
import type { Build, MoveRef, PokemonEntry, PokemonRef, Recommendation, Score, Threat } from "../types";

const weak:Record<string,string[]>={
Normal:["Fighting"],Fire:["Water","Ground","Rock"],Water:["Electric","Grass"],Electric:["Ground"],Grass:["Fire","Ice","Poison","Flying","Bug"],
Ice:["Fire","Fighting","Rock","Steel"],Fighting:["Flying","Psychic","Fairy"],Poison:["Ground","Psychic"],Ground:["Water","Grass","Ice"],
Flying:["Electric","Ice","Rock"],Psychic:["Bug","Ghost","Dark"],Bug:["Fire","Flying","Rock"],Rock:["Water","Grass","Fighting","Ground","Steel"],
Ghost:["Ghost","Dark"],Dragon:["Ice","Dragon","Fairy"],Dark:["Fighting","Bug","Fairy"],Steel:["Fire","Fighting","Ground"],Fairy:["Poison","Steel"]};
const fallback:Record<string,string>={"Blizzard":"Ice","Shadow Ball":"Ghost","Sucker Punch":"Dark","Kowtow Cleave":"Dark","Iron Head":"Steel","Close Combat":"Fighting","Dire Claw":"Poison","Earthquake":"Ground","Dragon Claw":"Dragon","Rock Slide":"Rock","Dual Wingbeat":"Flying","Grass Knot":"Grass","Flamethrower":"Fire","Thunderbolt":"Electric","Fake Out":"Normal"};
const isWeak=(types:string[],attack:string)=>types.some(t=>weak[t]?.includes(attack));

export function detectThreats(opponents:PokemonEntry[]):Threat[]{
 const tags=opponents.flatMap(p=>p.tags||[]),has=(t:string)=>tags.includes(t),out:Threat[]=[];
 const add=(name:string,severity:Threat["severity"],reason:string)=>out.push({name,severity,reason});
 if(has("rain"))add("Rain","high","Rain support is visible."); if(has("sun"))add("Sun","high","Sun support is visible.");
 if(has("snow"))add("Snow","medium","Snow or Aurora Veil is plausible."); if(has("sand"))add("Sand","medium","Sand support is visible.");
 if(has("tailwind"))add("Tailwind","high","A common Tailwind setter is present.");
 if(has("trick-room")&&opponents.some(p=>p.stats.spe<=60))add("Trick Room","high","A likely setter is paired with slow Pokémon.");
 if(has("intimidate"))add("Intimidate","medium","Physical attackers may be weakened.");
 if(has("fake-out"))add("Fake Out","medium","Immediate flinch pressure is visible.");
 if(has("redirection"))add("Redirection","medium","Follow Me or Rage Powder is plausible.");
 if(has("screens"))add("Screens","low","Damage reduction support is plausible.");
 if(has("priority-block"))add("Priority denial","high","Priority attacks may be blocked.");
 return out;
}
function scoreBuild(build:Build,opps:PokemonEntry[],threats:Threat[],pokemonRefs:Map<string,PokemonRef>,moveRefs:Map<string,MoveRef>):Score{
 let value=5;const reasons:string[]=[],risks:string[]=[];const speed=pokemonRefs.get(build.name)?.stats.speed??opps.find(x=>x.name===build.name)?.stats.spe??80;
 for(const o of opps){
  const moveTypes=build.moves.map(m=>moveRefs.get(m)?.type||fallback[m]).filter(Boolean);
  if(moveTypes.some(t=>isWeak(o.types,t!))){value+=.5;reasons.push(`Super-effective coverage into ${o.name}`)}
  if(o.types.some(t=>isWeak(build.types,t))){value-=.35;risks.push(`STAB weakness to ${o.name}`)}
 }
 value+=opps.filter(o=>speed>o.stats.spe).length/opps.length*1.35;
 if(build.moves.includes("Tailwind")){value+=1;reasons.push("Tailwind provides speed control")}
 if(build.moves.includes("Aurora Veil")){value+=.7;reasons.push("Aurora Veil improves survivability")}
 if(build.moves.includes("Fake Out")&&!threats.some(t=>t.name==="Priority denial")){value+=.7;reasons.push("Fake Out creates turn-one pressure")}
 if(build.ability==="Defiant"&&threats.some(t=>t.name==="Intimidate")){value+=1.5;reasons.push("Defiant punishes Intimidate")}
 return{build,score:Math.max(0,Math.min(10,value)),reasons:[...new Set(reasons)].slice(0,4),risks:[...new Set(risks)].slice(0,3)};
}
export function recommend(team:Build[],opps:PokemonEntry[],pokemonRefs:Map<string,PokemonRef>,moveRefs:Map<string,MoveRef>):Recommendation{
 const threats=detectThreats(opps),ranked=team.map(b=>scoreBuild(b,opps,threats,pokemonRefs,moveRefs)).sort((a,b)=>b.score-a.score),brought=ranked.slice(0,4);
 const pairs:Array<[Score,Score,number]>=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){let s=brought[i].score+brought[j].score;if(brought[i].build.moves.includes("Tailwind")||brought[j].build.moves.includes("Tailwind"))s+=1;if(brought[i].build.moves.includes("Fake Out")||brought[j].build.moves.includes("Fake Out"))s+=.5;pairs.push([brought[i],brought[j],s])}
 pairs.sort((a,b)=>b[2]-a[2]);const lead:[Score,Score]=[pairs[0][0],pairs[0][1]],alternative:[Score,Score]=[pairs[1][0],pairs[1][1]],back=brought.filter(x=>x!==lead[0]&&x!==lead[1]);
 const margin=(ranked[3]?.score||0)-(ranked[4]?.score||0),confidence=Math.round(Math.max(40,Math.min(94,64+margin*12))),risk=confidence<58?"High":confidence<74?"Medium":"Low";
 return{ranked,brought,lead,alternative,back,confidence,risk,threats};
}
