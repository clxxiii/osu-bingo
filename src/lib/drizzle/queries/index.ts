import * as session from './session';
import * as user from './user';
import * as token from './token';
import * as game from './game';
import * as gameuser from './gameuser';
import * as event from './event';

export default {
	...session,
	...user,
	...token,
	...game,
	...gameuser,
	...event
};
