
import type { MoveRef, PokemonRef } from "../types";
import { db } from "./db";

const slugMap:Record<string,string> = {
 "Ninetales-Alola":"ninetales-alola","Raichu-Alola":"raichu-alola","Arcanine-Hisui":"arcanine-hisui",
 "Slowbro-Galar":"slowbro-galar","Slowking-Galar":"slowking-galar","Typhlosion-Hisui":"typhlosion-hisui",
 "Samurott-Hisui":"samurott-hisui","Zoroark-Hisui":"zoroark-hisui","Goodra-Hisui":"goodra-hisui",
 "Decidueye-Hisui":"decidueye-hisui","Avalugg-Hisui":"avalugg-hisui","Mr. Rime":"mr-rime"
};
const slug=(s:string)=>(slugMap[s]||s).toLowerCase().replace(/[.'’]/g,"").replace(/\s+/g,"-");
const pretty=(s:string)=>s.split("-").map(x=>x[0]?.toUpperCase()+x.slice(1)).join(" ");

export async function fetchPokemon(name:string, force=false):Promise<PokemonRef|null>{
 if(!force){const cached=await db.pokemonRefs.get(name);if(cached)return cached}
 try{
  const r=await fetch(`https://pokeapi.co/api/v2/pokemon/${slug(name)}`); if(!r.ok)throw Error();
  const d=await r.json();
  const ref:PokemonRef={name,types:d.types.sort((a:any,b:any)=>a.slot-b.slot).map((x:any)=>pretty(x.type.name)),
   abilities:d.abilities.map((x:any)=>pretty(x.ability.name)),moves:d.moves.map((x:any)=>pretty(x.move.name)),
   sprite:d.sprites?.other?.["official-artwork"]?.front_default||d.sprites?.other?.home?.front_default||d.sprites?.front_default||"",
   stats:Object.fromEntries(d.stats.map((x:any)=>[x.stat.name,x.base_stat]))};
  await db.pokemonRefs.put(ref); return ref;
 }catch{return null}
}
export async function fetchMove(name:string, force=false):Promise<MoveRef|null>{
 if(!force){const cached=await db.moveRefs.get(name);if(cached)return cached}
 try{
  const r=await fetch(`https://pokeapi.co/api/v2/move/${slug(name)}`);if(!r.ok)throw Error();const d=await r.json();
  const ref:MoveRef={name,type:pretty(d.type.name),power:d.power||0,priority:d.priority||0,damageClass:pretty(d.damage_class.name),target:pretty(d.target.name)};
  await db.moveRefs.put(ref);return ref;
 }catch{return null}
}
