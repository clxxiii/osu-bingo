/**
 * This is a custom implementation of node's EventEmitter built specifically for
 * the use case of this application.
 * - A listener has an id, and a function at a minimum, and can include a
 * game_id, user_id, or a channel.
 * - The id must be saved client-side so that the listener can be removed.
 * - If a game_id, user_id, or channel are specified, that listener will be
 * called with sendToGame, sendToUser, or sendToChannel
 */

import { logger } from '$lib/logger';
import ShortUniqueId from 'short-unique-id';

import type { EmitterEvent, Fn, Listener } from '.';

const { randomUUID } = new ShortUniqueId({ length: 12, dictionary: 'alpha' });

// Store of all listeners
const listeners = new Map<string, Listener>();

// Message maps to send messages without searching through the entire listeners
// array
const games = new Map<string, string[]>();
const users = new Map<number, string[]>();
const game_channels = new Map<string, string[]>();

export const addListener = (fn: Fn, game_id?: string, user_id?: number, channel?: string) => {
	const id = `ltn_${randomUUID()}`;

	const listener = { id, game_id, user_id, channel, fn };
	listeners.set(id, listener);

	// Update message maps
	if (game_id) {
		let game = games.get(game_id);
		if (!game) game = [];

		game.push(id);
		games.set(game_id, game);
	}

	if (user_id) {
		let user = users.get(user_id);
		if (!user) user = [];

		user.push(id);
		users.set(user_id, user);
	}

	if (channel && game_id) {
		let game_channel = game_channels.get(`${game_id}_${channel}`);
		if (!game_channel) game_channel = [];

		game_channel.push(id);
		game_channels.set(`${game_id}_${channel}`, game_channel);
	}

	logger.info(`[+] New Listener ${id}; Total Listeners: ${listeners.size}`, {
		listener,
		type: 'listener_added',
		listener_count: listeners.size
	});
	return listener;
};

export const removeListener = (id: string) => {
	const listener = listeners.get(id);
	if (!listener) return;

	listeners.delete(id);

	// Update message maps
	if (listener.game_id) {
		const game = games.get(listener.game_id);
		if (game) {
			const i = game.indexOf(id);
			if (i != -1) game.splice(i);

			if (game.length == 0) games.delete(listener.game_id);
			else games.set(listener.game_id, game);
		}
	}

	if (listener.user_id) {
		const user = users.get(listener.user_id);
		if (user) {
			const i = user.indexOf(id);
			if (i != -1) user.splice(i);

			if (user.length == 0) users.delete(listener.user_id);
			else users.set(listener.user_id, user);
		}
	}

	if (listener.channel && listener.game_id) {
		const game_channel = game_channels.get(`${listener.game_id}_${listener.channel}`);
		if (game_channel) {
			const i = game_channel.indexOf(id);
			if (i != -1) game_channel.splice(i);

			if (game_channel.length == 0) game_channels.delete(`${listener.game_id}_${listener.channel}`);
			else game_channels.set(`${listener.game_id}_${listener.channel}`, game_channel);
		}
	}

	logger.info(`[-] Listener ${id} removed; Total Listeners: ${listeners.size}`, {
		listener,
		type: 'listener_removed',
		listener_count: listeners.size
	});
	return listener;
};

export const sendToListener = (id: string, event: EmitterEvent) => {
	const listener = listeners.get(id);
	if (listener) listener.fn(event);
};

export const sendToGame = (game_id: string, event: EmitterEvent) => {
	const game = games.get(game_id);
	if (!game) return;

	for (const id of game) {
		sendToListener(id, event);
	}
	logger.info(`Sent ${event.type} event to game ${game_id}`, { event, type: 'sent_game_event' });
};

export const sendToUser = (user_id: number, event: EmitterEvent) => {
	const user = users.get(user_id);
	if (!user) return;

	for (const id of user) {
		sendToListener(id, event);
	}
	logger.info(`Sent ${event.type} event to user ${user_id}`, { event, type: 'sent_user_event' });
};

export const sendToChannel = (game_id: string, channel: string, event: EmitterEvent) => {
	const game_channel = game_channels.get(`${game_id}_${channel}`);
	if (!game_channel) return;

	for (const id of game_channel) {
		sendToListener(id, event);
	}
	logger.info(`Sent ${event.type} event to game channel ${game_id}_${channel}`, {
		event,
		type: 'sent_channel_event'
	});
};

export const switchGame = (id: string, game_id: string) => {
	const listener = listeners.get(id);
	if (!listener) return;
	if (listener.game_id == game_id) return;

	// Remove old game
	if (listener.game_id) {
		const game = games.get(listener.game_id);
		if (game) {
			const i = game.indexOf(id);
			if (i != -1) game.splice(i);

			if (game.length == 0) games.delete(listener.game_id);
			else games.set(listener.game_id, game);
		}
	}

	listener.game_id = game_id;
	listeners.set(id, listener);

	// Add new game
	let game = games.get(game_id);
	if (!game) game = [];

	game.push(id);
	games.set(game_id, game);
	logger.info(`[~] Switched listener ${id} to game ${game_id}`, {
		listener,
		type: 'listener_game_switch'
	});
	return listener;
};

export const removeGame = (id: string) => {
	const listener = listeners.get(id);
	if (!listener) return;

	// Remove old game
	if (listener.game_id) {
		const game = games.get(listener.game_id);
		if (game) {
			const i = game.indexOf(id);
			if (i != -1) game.splice(i);

			if (game.length == 0) games.delete(listener.game_id);
			else games.set(listener.game_id, game);
		}
	}

	listener.game_id = undefined;
	listeners.set(id, listener);

	logger.info(`[~] Switched listener ${id} to no game`, { listener, type: 'listener_game_switch' });
	return listener;
};

export const switchChannel = (id: string, channel: string) => {
	const listener = listeners.get(id);
	if (!listener) return;
	if (listener.channel == channel) return;

	// Remove old channel
	if (listener.channel) {
		const game_channel = game_channels.get(`${listener.game_id}_${listener.channel}`);
		if (game_channel) {
			const i = game_channel.indexOf(id);
			if (i != -1) game_channel.splice(i);

			if (game_channel.length == 0) game_channels.delete(`${listener.game_id}_${listener.channel}`);
			else game_channels.set(`${listener.game_id}_${listener.channel}`, game_channel);
		}
	}

	listener.channel = channel;
	listeners.set(id, listener);

	// Add new channel
	let game_channel = game_channels.get(`${listener.game_id}_${channel}`);
	if (!game_channel) game_channel = [];

	game_channel.push(id);
	game_channels.set(`${listener.game_id}_${channel}`, game_channel);
	logger.info(`[~] Switched listener ${id} to channel ${channel}`, {
		listener,
		type: 'listener_channel_switch'
	});
	return listener;
};
