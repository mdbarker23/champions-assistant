
import Dexie, { type EntityTable } from "dexie";
import type { Team, PokemonRef, MoveRef } from "../types";

export interface Setting { key:string; value:string; }
export const db = new Dexie("EnterTheArenaV7") as Dexie & {
  teams: EntityTable<Team,"id">;
  pokemonRefs: EntityTable<PokemonRef,"name">;
  moveRefs: EntityTable<MoveRef,"name">;
  settings: EntityTable<Setting,"key">;
};
db.version(1).stores({
  teams:"id, name, updatedAt",
  pokemonRefs:"name",
  moveRefs:"name",
  settings:"key"
});
