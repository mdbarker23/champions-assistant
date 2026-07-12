
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import rosterData from "./data/roster.json";
import { defaultTeam } from "./data/defaultTeam";
import { db } from "./lib/db";
import { fetchMove, fetchPokemon } from "./lib/dataService";
import { recommend } from "./lib/engine";
import type { MoveRef, PokemonEntry, PokemonRef, Recommendation, Team } from "./types";
import { PokemonSprite } from "./components/PokemonSprite";
import { TeamEditor } from "./components/TeamEditor";
import "./styles.css";

const roster=rosterData.pokemon as PokemonEntry[];
const makeId=()=>crypto.randomUUID();
export default function App(){
 const teams=useLiveQuery(()=>db.teams.orderBy("updatedAt").reverse().toArray(),[])??[];
 const [activeId,setActiveId]=useState("default"),[opponents,setOpponents]=useState<PokemonEntry[]>([]),[query,setQuery]=useState("");
 const [refs,setRefs]=useState(new Map<string,PokemonRef>()),[moves,setMoves]=useState(new Map<string,MoveRef>()),[result,setResult]=useState<Recommendation|null>(null);
 const [editing,setEditing]=useState(false),[light,setLight]=useState(localStorage.getItem("arena-light")==="1");
 const active=teams.find(t=>t.id===activeId)??teams[0];
 useEffect(()=>{if(!teams.length)db.teams.put(defaultTeam);else if(!teams.some(t=>t.id===activeId))setActiveId(teams[0].id)},[teams,activeId]);
 useEffect(()=>{document.body.classList.toggle("light",light);localStorage.setItem("arena-light",light?"1":"0")},[light]);
 const enrich=async(names:string[])=>{const data=await Promise.all([...new Set(names)].map(n=>fetchPokemon(n)));setRefs(old=>{const next=new Map(old);data.forEach(d=>d&&next.set(d.name,d));return next})};
 useEffect(()=>{if(active)enrich(active.builds.map(b=>b.name))},[active?.id]);
 const matches=useMemo(()=>query?roster.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())&&!opponents.some(o=>o.name===p.name)).slice(0,10):[],[query,opponents]);
 const analyze=async()=>{if(!active||opponents.length!==6)return;const moveNames=[...new Set(active.builds.flatMap(b=>b.moves))];const data=await Promise.all(moveNames.map(m=>fetchMove(m)));const mm=new Map(moves);data.forEach(d=>d&&mm.set(d.name,d));setMoves(mm);setResult(recommend(active.builds,opponents,refs,mm))};
 const saveTeam=async(t:Team)=>{await db.teams.put(t);setEditing(false)};
 const duplicate=async()=>{if(!active)return;const t=structuredClone(active);t.id=makeId();t.name+=" Copy";t.builds=t.builds.map(b=>({...b,id:makeId()}));t.updatedAt=Date.now();await db.teams.put(t);setActiveId(t.id)};
 const create=async()=>{const t=structuredClone(defaultTeam);t.id=makeId();t.name="New Champions Team";t.builds=t.builds.map(b=>({...b,id:makeId()}));await db.teams.put(t);setActiveId(t.id);setEditing(true)};
 return <div className="app-shell">
  <aside className="rail"><div className="logo">EA</div><nav><button onClick={()=>scrollTo({top:0,behavior:"smooth"})}>◈</button><button onClick={()=>setEditing(true)}>◇</button><button onClick={()=>setLight(!light)}>◐</button></nav><small>V7</small></aside>
  <main>
   <header className="hero"><div><div className="eyebrow">POKÉMON CHAMPIONS · REGULATION {rosterData.regulation.id}</div><h1>Enter the Arena.</h1><p>Turn the six Pokémon revealed at team preview into your best possible path to victory.</p></div><button className="ghost" onClick={()=>enrich([...(active?.builds.map(b=>b.name)??[]),...opponents.map(o=>o.name)])}>Sync data</button></header>
   <section className="top-grid">
    <article className="panel"><div className="section-head"><span>01</span><h2>Opponent preview</h2><b>{opponents.length}/6</b></div><p className="muted">Only visible species are used.</p>
     <div className="search-box"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search legal Pokémon…"/>{matches.length>0&&<div className="search-results">{matches.map(p=><button key={p.name} onClick={()=>{setOpponents([...opponents,p]);setQuery("");enrich([p.name])}}><PokemonSprite name={p.name} refData={refs.get(p.name)}/><span>{p.name}<small>{p.types.join(" / ")}</small></span></button>)}</div>}</div>
     <div className="slots">{Array.from({length:6},(_,i)=>{const p=opponents[i];return <div className={`slot ${p?"filled":""}`} key={i}>{p?<><button className="remove" onClick={()=>setOpponents(opponents.filter((_,j)=>j!==i))}>×</button><PokemonSprite name={p.name} refData={refs.get(p.name)}/><strong>{p.name}</strong><small>{p.types.join(" / ")}</small></>:<span>Slot {i+1}</span>}</div>})}</div>
     <div className="actions"><button className="ghost" onClick={()=>{setOpponents([]);setResult(null)}}>Clear</button><button className="primary" disabled={opponents.length!==6||!active} onClick={analyze}>Analyze matchup →</button></div>
    </article>
    <article className="panel squad"><div className="section-head"><span>02</span><h2>Your squad</h2><button onClick={()=>setEditing(true)}>✦</button></div>
     <select value={activeId} onChange={e=>setActiveId(e.target.value)}>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
     <div className="team-actions"><button onClick={create}>New</button><button onClick={duplicate}>Duplicate</button><button disabled={teams.length<2} onClick={()=>active&&db.teams.delete(active.id)}>Delete</button></div>
     <div className="team-list">{active?.builds.map(b=><div className="team-row" key={b.id}><PokemonSprite name={b.name} refData={refs.get(b.name)}/><span><strong>{b.displayName}</strong><small>{b.item} · {b.ability}</small></span><em>{b.roles[0]}</em></div>)}</div>
    </article>
   </section>
   <AnimatePresence>{result&&<motion.section className="results" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
    <header><div><div className="eyebrow">MATCHUP OUTPUT</div><h2>Your recommended line</h2></div><div className="confidence">{result.confidence}%<small>confidence</small></div></header>
    <div className="lead"><div><span className="eyebrow">PRIMARY LEAD</span><h3>{result.lead[0].build.displayName} + {result.lead[1].build.displayName}</h3><p>{result.lead[0].reasons[0]||"Creates immediate pressure."} {result.lead[1].reasons[0]||"Supports the opening position."}</p></div><div className="lead-cards">{result.lead.map(x=><div key={x.build.id}><PokemonSprite name={x.build.name} refData={refs.get(x.build.name)}/><strong>{x.build.displayName}</strong><small>{x.score.toFixed(1)} score</small></div>)}</div></div>
    <div className="result-grid"><article className="panel"><span className="eyebrow">BACK TWO</span>{result.back.map(x=><p key={x.build.id}><strong>{x.build.displayName}</strong><br/><small>{x.reasons[0]||"Flexible reserve"}</small></p>)}</article><article className="panel"><span className="eyebrow">ALTERNATIVE</span><p><strong>{result.alternative[0].build.displayName} + {result.alternative[1].build.displayName}</strong></p></article><article className="panel"><span className="eyebrow">THREATS</span><div className="chips">{result.threats.map(t=><span key={t.name}>{t.name}</span>)}</div></article><article className="panel"><span className="eyebrow">RISK</span><h3>{result.risk}</h3></article></div>
   </motion.section>}</AnimatePresence>
  </main>
  {editing&&active&&<TeamEditor team={active} roster={roster} refs={refs} onClose={()=>setEditing(false)} onSave={saveTeam}/>}
 </div>
}
