import * as session from './session';
import * as user from './user';
import * as token from './token';
import * as game from './game';
import * as gameuser from './gameuser';

export default {
	...session,
	...user,
	...token,
	...game,
	...gameuser
};
