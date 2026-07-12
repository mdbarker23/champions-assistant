
export type StatKey = "hp"|"atk"|"def"|"spa"|"spd"|"spe";
export type Training = Record<StatKey, number>;
export interface PokemonEntry { name:string; types:string[]; stats:{spe:number}; tags:string[]; regulation:string; legal:boolean; }
export interface Build {
  id:string; name:string; displayName:string; item:string; ability:string; nature:string;
  training:Training; moves:[string,string,string,string]; roles:string[]; types:string[];
}
export interface Team { id:string; name:string; createdAt:number; updatedAt:number; builds:Build[]; }
export interface PokemonRef {
  name:string; types:string[]; abilities:string[]; moves:string[]; sprite:string;
  stats:Record<string,number>;
}
export interface MoveRef { name:string; type:string; power:number; priority:number; damageClass:string; target:string; }
export interface Threat { name:string; severity:"low"|"medium"|"high"; reason:string; }
export interface Score { build:Build; score:number; reasons:string[]; risks:string[]; }
export interface Recommendation { ranked:Score[]; brought:Score[]; lead:[Score,Score]; alternative:[Score,Score]; back:Score[]; confidence:number; risk:"Low"|"Medium"|"High"; threats:Threat[]; }
