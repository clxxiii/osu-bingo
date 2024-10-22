import { writable } from 'svelte/store';

import type { ChatMessage, GameUserEvent } from './emitter';

export const square = writable<number | null>(null);

export const login_request = writable<boolean>(false);

export const listener = writable<string | null>(null);

export const user = writable<Bingo.User | undefined>(undefined);

export const game = writable<Bingo.Card | null>(null);

export const chats = writable<(ChatMessage | GameUserEvent)[]>([]);
