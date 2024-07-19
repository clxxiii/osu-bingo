import * as session from './session';
import * as user from './user';
import * as token from './token';
import * as game from './game';
import * as gameuser from './gameuser';
import * as event from './event';
import * as score from './score';
import * as square from './square';
import * as chat from './chat';
import * as map from './map'
import * as template from './template'
import * as mappool from './mappool'

export default {
	...session,
	...user,
	...token,
	...game,
	...gameuser,
	...event,
	...score,
	...square,
	...chat,
	...map,
	...template,
	...mappool
};
