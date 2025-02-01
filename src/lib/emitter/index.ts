export type Fn = (event: EmitterEvent) => unknown;

export type Listener = {
	id: string;
	game_id?: string;
	user_id?: number;
	channel?: string;
	fn: Fn;
};

export type GameUserEvent = {
	type: 'gameUser';
	data: { type: 'join' | 'leave' | 'switch'; user: Bingo.Card.FullUser };
};

export type SquareUpdateEvent = {
	type: 'square';
	data: {
		score: Bingo.Card.FullScore;
		claim: boolean;
	}[];
};

export type StateChangeEvent = {
	type: 'state';
	data: { state: number; winner?: string; card?: Bingo.Card | null };
};

export type Init = {
	type: 'init';
	data: {
		id: string;
	};
};

export type FullUpdateEvent = {
	type: 'fullUpdate';
	data: Bingo.Card;
};

export type FullChatUpdate = {
	type: 'fullChatUpdate';
	data: Bingo.Card.FullChat[];
};

export type ChatMessage = {
	type: 'chat';
	data: Bingo.Card.FullChat;
};

export type LoginRequest = {
	type: 'login_request';
	data: boolean;
};

export type ToastNotification = {
	type: 'toast';
	data: {
		severity: "NORMAL" | "WARNING" | "URGENT"
		msg: string
	};
}

export type DeleteEvent = {
	type: 'delete';
	data: {
		game_id: string
	};
}

export type EmitterEvent =
	| GameUserEvent
	| StateChangeEvent
	| FullUpdateEvent
	| SquareUpdateEvent
	| FullChatUpdate
	| ChatMessage
	| Init
	| LoginRequest
	| ToastNotification
	| DeleteEvent;

export const isGameUserUpdate = (event: EmitterEvent): event is GameUserEvent =>
	event.type == 'gameUser';
export const isSquareUpdate = (event: EmitterEvent): event is SquareUpdateEvent =>
	event.type == 'square';
export const isStateUpdate = (event: EmitterEvent): event is StateChangeEvent =>
	event.type == 'state';
export const isInit = (event: EmitterEvent): event is Init => event.type == 'init';
export const isFullUpdate = (event: EmitterEvent): event is FullUpdateEvent =>
	event.type == 'fullUpdate';
export const isFullChatUpdate = (event: EmitterEvent): event is FullChatUpdate =>
	event.type == 'fullChatUpdate';
export const isChatMessage = (event: EmitterEvent): event is ChatMessage => event.type == 'chat';
export const isLoginRequest = (event: EmitterEvent): event is LoginRequest =>
	event.type == 'login_request';
export const isToastNotification = (event: EmitterEvent): event is ToastNotification =>
	event.type == 'toast';
export const isDeleteEvent = (event: EmitterEvent): event is DeleteEvent =>
	event.type == 'delete';
