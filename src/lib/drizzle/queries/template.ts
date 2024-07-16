import { eq } from "drizzle-orm"
import { db } from ".."
import { Template } from "../schema"

export const newTemplate = async (user_id: number) => {
  const tmt_public = (await db.select().from(Template).where(eq(Template.id, `tmt_public`)))[0];

  if (!tmt_public) return null;

  return (await db
    .insert(Template)
    .values({
      owner_id: user_id,
      data: tmt_public.data
    })
    .returning())[0]
}

export const getTemplate = async (id: string) => {
  return (await db.select().from(Template).where(eq(Template.id, id)))[0]
}

export const updateTemplate = async (id: string, data: Template) => {
  await db.update(Template).set({ data: JSON.stringify(data) }).where(eq(Template.id, id));
}
