
import { useMemo, useState } from "react";
import type { Build, PokemonEntry, PokemonRef, Team } from "../types";
const stats=["hp","atk","def","spa","spd","spe"] as const;
export function TeamEditor({team,roster,refs,onClose,onSave}:{team:Team;roster:PokemonEntry[];refs:Map<string,PokemonRef>;onClose:()=>void;onSave:(t:Team)=>void}){
 const [draft,setDraft]=useState<Team>(structuredClone(team));
 const errors=useMemo(()=>{const e:string[]=[];if(new Set(draft.builds.map(b=>b.name)).size<6)e.push("Each Pokémon must be unique.");draft.builds.forEach((b,i)=>{const total=stats.reduce((n,k)=>n+b.training[k],0);if(total>66)e.push(`Slot ${i+1} exceeds 66 training points.`);if(b.moves.some(m=>!m))e.push(`Slot ${i+1} needs four moves.`)});return e},[draft]);
 const update=(i:number,patch:Partial<Build>)=>setDraft(t=>({...t,updatedAt:Date.now(),builds:t.builds.map((b,j)=>j===i?{...b,...patch}:b)}));
 return <div className="modal-backdrop"><div className="modal">
  <header><div><span className="eyebrow">TEAM WORKSPACE</span><h2>Edit squad</h2></div><button onClick={onClose}>×</button></header>
  <label className="field">Team name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
  <div className="editor-list">{draft.builds.map((b,i)=>{const ref=refs.get(b.name);return <section className="build-editor" key={b.id}>
   <h3>Slot {i+1} · {b.displayName}</h3><div className="editor-grid">
    <label className="field">Pokémon<select value={b.name} onChange={e=>{const p=roster.find(x=>x.name===e.target.value)!;update(i,{name:p.name,displayName:p.name,types:p.types,ability:"",moves:["","","",""]})}}>{roster.map(p=><option key={p.name}>{p.name}</option>)}</select></label>
    <label className="field">Display name<input value={b.displayName} onChange={e=>update(i,{displayName:e.target.value})}/></label>
    <label className="field">Item<input value={b.item} onChange={e=>update(i,{item:e.target.value})}/></label>
    <label className="field">Ability<input list={`abilities-${i}`} value={b.ability} onChange={e=>update(i,{ability:e.target.value})}/><datalist id={`abilities-${i}`}>{ref?.abilities.map(x=><option key={x} value={x}/>)}</datalist></label>
    <label className="field">Nature<input value={b.nature} onChange={e=>update(i,{nature:e.target.value})}/></label>
    <label className="field">Roles<input value={b.roles.join(", ")} onChange={e=>update(i,{roles:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></label>
    <div className="move-fields">{b.moves.map((m,j)=><label className="field" key={j}>Move {j+1}<input list={`moves-${i}`} value={m} onChange={e=>{const moves=[...b.moves] as Build["moves"];moves[j]=e.target.value;update(i,{moves})}}/></label>)}<datalist id={`moves-${i}`}>{ref?.moves.map(x=><option key={x} value={x}/>)}</datalist></div>
    <div className="training-fields">{stats.map(k=><label className="field" key={k}>{k.toUpperCase()}<input type="number" min={0} max={32} value={b.training[k]} onChange={e=>update(i,{training:{...b.training,[k]:Math.max(0,Math.min(32,Number(e.target.value)))}})}/></label>)}</div>
   </div></section>})}</div>
  <div className="validation">{errors.map(x=><div key={x}>{x}</div>)}</div>
  <footer><button className="ghost" onClick={onClose}>Cancel</button><button className="primary" disabled={!!errors.length} onClick={()=>onSave(draft)}>Save team</button></footer>
 </div></div>
}