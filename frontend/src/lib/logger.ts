import { Logtail } from '@logtail/node';
import winston, { config } from 'winston';
import { env } from '$env/dynamic/private';
import { LogtailTransport } from '@logtail/winston';

export const logger = winston.createLogger({
	format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	defaultMeta: { host: process.env.HOST },
	handleExceptions: true,
	levels: config.npm.levels,

	transports: [
		new winston.transports.Console({
			level: 'http',
			format: winston.format.combine(
				winston.format.align(),
				winston.format.cli({
					levels: config.npm.levels,
					colors: {
						error: 'bold red',
						warn: 'bold yellow',
						info: 'bold blue',
						http: 'bold green',
						debug: 'bold gray',
						silly: 'bold pink'
					},
				})
			)
		})
	]
});

if (env.LOG_TOKEN) {
	const logtail = new Logtail(env.LOG_TOKEN);
	logger.add(new LogtailTransport(logtail));
} else {
	logger.warn('Missing logtail token, running without uploading logs...');
}

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.File({
		filename: 'app.log',
		level: 'debug'
	}));
}
