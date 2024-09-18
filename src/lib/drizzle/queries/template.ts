import { eq } from 'drizzle-orm';
import { db } from '..';
import { Template } from '../schema';
import { logger } from '$lib/logger';

export const newTemplate = async (user_id: number) => {
	const tmt_public = (await db.select().from(Template).where(eq(Template.id, `tmt_public`)))[0];

	if (!tmt_public) return null;

	logger.silly('Started db request', { function: 'newTemplate', obj: 'insert', dir: 'start' });
	const insertTemplate = (
		await db
			.insert(Template)
			.values({
				owner_id: user_id,
				data: tmt_public.data
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'newTemplate', obj: 'insert', dir: 'end' });
	return insertTemplate;
};

export const getTemplate = async (id: string | null) => {
	if (!id) id = 'tmt_default';
	logger.silly('Started db request', { function: 'getTemplate', obj: 'template', dir: 'start' });
	const template = (await db.select().from(Template).where(eq(Template.id, id)))[0];
	logger.silly('Finished db request', { function: 'getTemplate', obj: 'template', dir: 'end' });
	return template;
};

export const updateTemplate = async (id: string, data: Template) => {
	logger.silly('Started db request', { function: 'updateTemplate', obj: 'update', dir: 'start' });
	await db
		.update(Template)
		.set({ data: JSON.stringify(data) })
		.where(eq(Template.id, id));
	logger.silly('Finished db request', { function: 'updateTemplate', obj: 'update', dir: 'end' });
};
