
import type { PokemonRef } from "../types";
export function PokemonSprite({name,refData,className=""}:{name:string;refData?:PokemonRef;className?:string}){
 if(refData?.sprite)return <img className={`sprite ${className}`} src={refData.sprite} alt="" loading="lazy"/>;
 return <div className={`sprite-fallback ${className}`}>{name.split(/[\s-]/).map(x=>x[0]).join("").slice(0,2)}</div>;
}