import { writable } from "svelte/store";

export const square = writable<Bingo.Card.FullSquare | null>(null)