import { writable } from "svelte/store";

export const square = writable<number | null>(null)

export const login_request = writable<boolean>(false);